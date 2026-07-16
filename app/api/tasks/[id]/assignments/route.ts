import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskAssignment } from '@/lib/tasks/models'
import type { TaskAssignmentDoc } from '@/lib/tasks/models'
import {
  loadTaskContext,
  logHistory,
  notify,
  resolveAssignees,
  serializeAssignment,
  toObjectId,
} from '@/lib/tasks/service'
import { canCreateTask } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const rows = await TaskAssignment.find({ taskId: ctx.task._id, removedAt: null })
    .sort({ createdAt: 1 })
    .lean<TaskAssignmentDoc[]>()
  return NextResponse.json({ assignments: rows.map(serializeAssignment) })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator) || !canCreateTask(session.role)) {
    return NextResponse.json({ error: 'You cannot assign this task' }, { status: 403 })
  }

  const body = await req.json()
  const ids: string[] = Array.isArray(body.assigneeIds)
    ? body.assigneeIds
    : body.assigneeId
      ? [body.assigneeId]
      : []
  if (!ids.length) return NextResponse.json({ error: 'No assignees provided' }, { status: 400 })

  const resolved = await resolveAssignees(ids)
  if (!resolved.length) return NextResponse.json({ error: 'No valid assignees' }, { status: 400 })

  for (const r of resolved) {
    await TaskAssignment.updateOne(
      { taskId: ctx.task._id, assigneeId: toObjectId(r.id) },
      {
        $set: {
          assigneeType: r.type,
          assigneeName: r.name,
          assigneeDepartment: r.department,
          assignedBy: ctx.actor,
          removedAt: null,
        },
        $setOnInsert: { status: 'pending', completionPercent: 0 },
      },
      { upsert: true }
    )
  }

  await logHistory(
    ctx.task._id,
    ctx.actor,
    'task_assigned',
    `Assigned to ${resolved.map((r) => r.name).join(', ')}`,
    { assigneeIds: resolved.map((r) => r.id) }
  )
  await notify(
    resolved.map((r) => r.id),
    {
      type: 'task_assigned',
      title: 'New task assigned',
      body: ctx.task.title,
      taskId: ctx.task._id,
      link: `/attendance?task=${ctx.task._id}`,
    },
    session.id
  )

  const rows = await TaskAssignment.find({ taskId: ctx.task._id, removedAt: null }).lean<TaskAssignmentDoc[]>()
  return NextResponse.json({ assignments: rows.map(serializeAssignment) }, { status: 201 })
}
