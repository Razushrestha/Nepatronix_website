import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { Task, TaskAssignment, TaskChecklist } from '@/lib/tasks/models'
import type { TaskAssignmentDoc, TaskDoc } from '@/lib/tasks/models'
import {
  buildTaskAccessFilter,
  logHistory,
  notify,
  resolveAssignees,
  sanitizeHtml,
  serializeAssignment,
  serializeTask,
  toActor,
  toObjectId,
  isValidObjectId,
} from '@/lib/tasks/service'
import {
  canCreateTask,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_VISIBILITIES,
} from '@/lib/tasks/constants'

export const runtime = 'nodejs'

const PRIORITY_VALUES = TASK_PRIORITIES.map((p) => p.value)
const STATUS_VALUES = TASK_STATUSES.map((s) => s.value)
const VISIBILITY_VALUES = TASK_VISIBILITIES.map((v) => v.value)

export async function GET(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const url = req.nextUrl.searchParams

  const page = Math.max(1, parseInt(url.get('page') || '1', 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(url.get('limit') || '25', 10) || 25))
  const skip = (page - 1) * limit

  const access = await buildTaskAccessFilter(session)
  const and: Record<string, unknown>[] = [access]

  and.push({ deletedAt: null })

  const archived = url.get('archived')
  if (archived === 'true') and.push({ archived: true })
  else if (archived === 'all') {
    /* include both */
  } else and.push({ archived: false })

  const status = url.get('status')
  if (status && STATUS_VALUES.includes(status as never)) and.push({ status })

  const priority = url.get('priority')
  if (priority && PRIORITY_VALUES.includes(priority as never)) and.push({ priority })

  const department = url.get('department')
  if (department) and.push({ department })

  const project = url.get('project')
  if (project) and.push({ project })

  const category = url.get('category')
  if (category && TASK_CATEGORIES.includes(category as never)) and.push({ category })

  const creator = url.get('creator')
  if (creator && isValidObjectId(creator)) and.push({ 'createdBy.id': toObjectId(creator) })

  const dateFrom = url.get('dateFrom')
  const dateTo = url.get('dateTo')
  if (dateFrom || dateTo) {
    const range: Record<string, string> = {}
    if (dateFrom) range.$gte = dateFrom
    if (dateTo) range.$lte = dateTo
    and.push({ dueDate: range })
  }

  const today = new Date().toISOString().slice(0, 10)
  if (url.get('overdue') === 'true') {
    and.push({ dueDate: { $lt: today, $ne: null }, status: { $nin: ['completed', 'cancelled'] } })
  }
  if (url.get('completed') === 'true') and.push({ status: 'completed' })

  // Filter by assignee: restrict to tasks that assignee is on.
  const assignee = url.get('assignee')
  if (assignee && isValidObjectId(assignee)) {
    const ids = await TaskAssignment.find({ assigneeId: toObjectId(assignee), removedAt: null })
      .select('taskId')
      .lean<{ taskId: mongoose.Types.ObjectId }[]>()
    and.push({ _id: { $in: ids.map((i) => i.taskId) } })
  }

  const q = url.get('q')?.trim()
  if (q) {
    and.push({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { project: { $regex: q, $options: 'i' } },
        { 'createdBy.name': { $regex: q, $options: 'i' } },
      ],
    })
  }

  const filter = and.length ? { $and: and } : {}

  const sortField = url.get('sort') || 'createdAt'
  const sortDir = url.get('dir') === 'asc' ? 1 : -1
  const sort: Record<string, 1 | -1> = { [sortField]: sortDir }

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit).lean<TaskDoc[]>(),
    Task.countDocuments(filter),
  ])

  const taskIds = tasks.map((t) => t._id)
  const [assignments, checklistCounts] = await Promise.all([
    TaskAssignment.find({ taskId: { $in: taskIds }, removedAt: null }).lean<TaskAssignmentDoc[]>(),
    TaskChecklist.aggregate<{ _id: mongoose.Types.ObjectId; total: number; done: number }>([
      { $match: { taskId: { $in: taskIds }, deletedAt: null } },
      {
        $group: {
          _id: '$taskId',
          total: { $sum: 1 },
          done: { $sum: { $cond: ['$completed', 1, 0] } },
        },
      },
    ]),
  ])

  const byTask = new Map<string, ReturnType<typeof serializeAssignment>[]>()
  for (const a of assignments) {
    const key = String(a.taskId)
    if (!byTask.has(key)) byTask.set(key, [])
    byTask.get(key)!.push(serializeAssignment(a))
  }
  const checklistMap = new Map(checklistCounts.map((c) => [String(c._id), c]))

  const data = tasks.map((t) => {
    const cl = checklistMap.get(String(t._id))
    return serializeTask(t, {
      assignees: byTask.get(String(t._id)) || [],
      checklistTotal: cl?.total || 0,
      checklistDone: cl?.done || 0,
    })
  })

  return NextResponse.json({
    tasks: data,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
  })
}

export async function POST(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canCreateTask(session.role)) {
    return NextResponse.json({ error: 'You do not have permission to create tasks' }, { status: 403 })
  }

  try {
    await connectToDatabase()
    const body = await req.json()

    const title = String(body.title || '').trim()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const priority = PRIORITY_VALUES.includes(body.priority) ? body.priority : 'medium'
    const status = STATUS_VALUES.includes(body.status) ? body.status : 'pending'
    const visibility = VISIBILITY_VALUES.includes(body.visibility) ? body.visibility : 'team'
    const category = TASK_CATEGORIES.includes(body.category) ? body.category : undefined

    const actor = toActor(session)

    const task = await Task.create({
      title,
      description: sanitizeHtml(body.description),
      priority,
      status,
      category,
      department: body.department || session.department,
      project: body.project ? String(body.project).trim() : undefined,
      visibility,
      startDate: body.startDate || undefined,
      dueDate: body.dueDate || undefined,
      estimatedHours: Number(body.estimatedHours) || 0,
      actualHours: Number(body.actualHours) || 0,
      completionPercent: 0,
      createdBy: actor,
      assignedBy: actor,
    })

    await logHistory(task._id, actor, 'task_created', `Created task "${title}"`)

    // Optional inline assignment on creation.
    const assigneeIds: string[] = Array.isArray(body.assigneeIds) ? body.assigneeIds : []
    if (assigneeIds.length) {
      const resolved = await resolveAssignees(assigneeIds)
      for (const r of resolved) {
        await TaskAssignment.updateOne(
          { taskId: task._id, assigneeId: toObjectId(r.id) },
          {
            $set: {
              assigneeType: r.type,
              assigneeName: r.name,
              assigneeDepartment: r.department,
              assignedBy: actor,
              removedAt: null,
            },
            $setOnInsert: { status: 'pending', completionPercent: 0 },
          },
          { upsert: true }
        )
      }
      await logHistory(
        task._id,
        actor,
        'task_assigned',
        `Assigned to ${resolved.map((r) => r.name).join(', ')}`,
        { assigneeIds: resolved.map((r) => r.id) }
      )
      await notify(
        resolved.map((r) => r.id),
        {
          type: 'task_assigned',
          title: 'New task assigned',
          body: title,
          taskId: task._id,
          link: `/attendance?task=${task._id}`,
        },
        session.id
      )
    }

    const fresh = await Task.findById(task._id).lean<TaskDoc>()
    return NextResponse.json({ task: serializeTask(fresh as TaskDoc) }, { status: 201 })
  } catch (err) {
    console.error('[tasks POST]', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
