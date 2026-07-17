import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import {
  Task,
  TaskAssignment,
  TaskAttachment,
  TaskChecklist,
  TaskComment,
  TaskCommentFile,
  TaskDailyPlan,
  TaskHistory,
} from '@/lib/tasks/models'
import type {
  TaskAssignmentDoc,
  TaskAttachmentDoc,
  TaskChecklistDoc,
  TaskCommentDoc,
  TaskCommentFileDoc,
  TaskDailyPlanDoc,
  TaskDoc,
  TaskHistoryDoc,
} from '@/lib/tasks/models'
import {
  canAccessTask,
  isValidObjectId,
  logHistory,
  notify,
  recomputeProgress,
  sanitizeHtml,
  serializeAssignment,
  serializeAttachment,
  serializeChecklist,
  serializeComment,
  serializeDailyPlan,
  serializeHistory,
  serializeTask,
  taskAssigneeIds,
  toActor,
} from '@/lib/tasks/service'
import {
  canApproveTask,
  canHardDeleteTask,
  isTaskAdmin,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_VISIBILITIES,
} from '@/lib/tasks/constants'

export const runtime = 'nodejs'

const PRIORITY_VALUES = TASK_PRIORITIES.map((p) => p.value)
const STATUS_VALUES = TASK_STATUSES.map((s) => s.value)
const VISIBILITY_VALUES = TASK_VISIBILITIES.map((v) => v.value)

async function loadTask(id: string): Promise<TaskDoc | null> {
  if (!isValidObjectId(id)) return null
  return Task.findOne({ _id: id, deletedAt: null }).lean<TaskDoc>()
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { id } = await params
  const task = await loadTask(id)
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(await canAccessTask(session, task))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [assignments, dailyPlans, checklists, attachments, comments, history] = await Promise.all([
    TaskAssignment.find({ taskId: task._id, removedAt: null }).sort({ createdAt: 1 }).lean<TaskAssignmentDoc[]>(),
    TaskDailyPlan.find({ taskId: task._id, deletedAt: null }).sort({ order: 1, dayNumber: 1 }).lean<TaskDailyPlanDoc[]>(),
    TaskChecklist.find({ taskId: task._id, deletedAt: null }).sort({ order: 1, createdAt: 1 }).lean<TaskChecklistDoc[]>(),
    TaskAttachment.find({ taskId: task._id, deletedAt: null }).sort({ createdAt: -1 }).lean<TaskAttachmentDoc[]>(),
    TaskComment.find({ taskId: task._id }).sort({ createdAt: 1 }).lean<TaskCommentDoc[]>(),
    TaskHistory.find({ taskId: task._id }).sort({ createdAt: -1 }).lean<TaskHistoryDoc[]>(),
  ])

  const commentFiles = await TaskCommentFile.find({ taskId: task._id }).lean<TaskCommentFileDoc[]>()

  return NextResponse.json({
    task: serializeTask(task, {
      checklistTotal: checklists.length,
      checklistDone: checklists.filter((c) => c.completed).length,
    }),
    assignments: assignments.map(serializeAssignment),
    dailyPlans: dailyPlans.map(serializeDailyPlan),
    checklists: checklists.map(serializeChecklist),
    attachments: attachments.map(serializeAttachment),
    comments: comments.map((c) => serializeComment(c, commentFiles)),
    history: history.map(serializeHistory),
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { id } = await params
  const task = await loadTask(id)
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(await canAccessTask(session, task))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const actor = toActor(session)
  const admin = isTaskAdmin(session.role)
  const isCreator = isValidObjectId(session.id) && String(task.createdBy?.id) === String(session.id)
  const assignee = await TaskAssignment.exists({ taskId: task._id, assigneeId: session.id, removedAt: null })

  // ---- Lifecycle actions (admin only) --------------------------------
  const action = body.action as string | undefined
  if (action) {
    if (!canApproveTask(session.role)) {
      return NextResponse.json({ error: 'Only an admin can perform this action' }, { status: 403 })
    }
    const set: Record<string, unknown> = {}
    if (action === 'approve') {
      set.status = 'completed'
      set.approvedBy = actor
      set.approvedAt = new Date()
    } else if (action === 'archive') {
      set.archived = true
    } else if (action === 'restore') {
      set.archived = false
    } else if (action === 'close') {
      set.closedAt = new Date()
      set.status = 'completed'
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    await Task.updateOne({ _id: task._id }, { $set: set })
    const map: Record<string, [string, string]> = {
      approve: ['task_approved', 'Approved the task'],
      archive: ['task_archived', 'Archived the task'],
      restore: ['task_restored', 'Restored the task'],
      close: ['task_closed', 'Closed the task'],
    }
    const [act, msg] = map[action]
    await logHistory(task._id, actor, act as never, msg)
    if (action === 'approve') {
      await notify(await taskAssigneeIds(task._id), {
        type: 'task_approved',
        title: 'Task approved',
        body: task.title,
        taskId: task._id,
        link: `/attendance?task=${task._id}`,
      }, session.id)
    }
    const fresh = await Task.findById(task._id).lean<TaskDoc>()
    return NextResponse.json({ task: serializeTask(fresh as TaskDoc) })
  }

  // ---- Field updates -------------------------------------------------
  const set: Record<string, unknown> = {}
  const changes: string[] = []

  const canEditContent = admin || isCreator
  const canEditStatus = admin || isCreator || Boolean(assignee)

  if (body.status !== undefined) {
    if (!canEditStatus) {
      return NextResponse.json({ error: 'You cannot change this task' }, { status: 403 })
    }
    if (!STATUS_VALUES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (body.status !== task.status) {
      set.status = body.status
      changes.push(`status → ${body.status}`)
    }
  }

  if (canEditContent) {
    if (body.title !== undefined && String(body.title).trim()) {
      set.title = String(body.title).trim()
      changes.push('title')
    }
    if (body.description !== undefined) {
      set.description = sanitizeHtml(body.description)
      changes.push('description')
    }
    for (const field of ['project', 'category', 'department'] as const) {
      if (body[field] !== undefined) {
        if (field === 'category' && body[field] && !TASK_CATEGORIES.includes(body[field])) continue
        set[field] = body[field] || undefined
        changes.push(field)
      }
    }
    if (body.priority !== undefined && PRIORITY_VALUES.includes(body.priority)) {
      set.priority = body.priority
      changes.push('priority')
    }
    if (body.visibility !== undefined && VISIBILITY_VALUES.includes(body.visibility)) {
      set.visibility = body.visibility
      changes.push('visibility')
    }
    for (const field of ['startDate', 'dueDate'] as const) {
      if (body[field] !== undefined) {
        set[field] = body[field] || undefined
        changes.push(field)
      }
    }
    for (const field of ['estimatedHours', 'actualHours'] as const) {
      if (body[field] !== undefined) {
        set[field] = Number(body[field]) || 0
        changes.push(field)
      }
    }
  } else if (!canEditStatus) {
    return NextResponse.json({ error: 'You cannot edit this task' }, { status: 403 })
  }

  if (!Object.keys(set).length) {
    return NextResponse.json({ error: 'No changes' }, { status: 400 })
  }

  await Task.updateOne({ _id: task._id }, { $set: set })

  if (set.status) {
    await logHistory(task._id, actor, 'status_changed', `Changed status to ${set.status}`, {
      from: task.status,
      to: set.status,
    })
    const recipients = [String(task.createdBy?.id), ...(await taskAssigneeIds(task._id))]
    await notify(recipients, {
      type: set.status === 'completed' ? 'task_completed' : 'task_updated',
      title: set.status === 'completed' ? 'Task completed' : 'Task status updated',
      body: `${task.title} → ${set.status}`,
      taskId: task._id,
      link: `/attendance?task=${task._id}`,
    }, session.id)
  }
  const contentChanges = changes.filter((c) => c !== `status → ${set.status}`)
  if (contentChanges.length) {
    await logHistory(task._id, actor, 'task_updated', `Updated ${contentChanges.join(', ')}`)
  }

  const fresh = await Task.findById(task._id).lean<TaskDoc>()
  return NextResponse.json({ task: serializeTask(fresh as TaskDoc) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canHardDeleteTask(session.role)) {
    return NextResponse.json({ error: 'Only an admin can delete tasks' }, { status: 403 })
  }

  await connectToDatabase()
  const { id } = await params
  const task = await loadTask(id)
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const actor = toActor(session)
  const hard = req.nextUrl.searchParams.get('hard') === 'true'

  if (hard) {
    await Promise.all([
      Task.deleteOne({ _id: task._id }),
      TaskAssignment.deleteMany({ taskId: task._id }),
      TaskDailyPlan.deleteMany({ taskId: task._id }),
      TaskChecklist.deleteMany({ taskId: task._id }),
      TaskAttachment.deleteMany({ taskId: task._id }),
      TaskComment.deleteMany({ taskId: task._id }),
      TaskCommentFile.deleteMany({ taskId: task._id }),
      TaskHistory.deleteMany({ taskId: task._id }),
    ])
    return NextResponse.json({ ok: true, deleted: 'hard' })
  }

  await Task.updateOne({ _id: task._id }, { $set: { deletedAt: new Date() } })
  await logHistory(task._id, actor, 'task_deleted', 'Moved task to trash')
  await recomputeProgress(task._id).catch(() => {})
  return NextResponse.json({ ok: true, deleted: 'soft' })
}
