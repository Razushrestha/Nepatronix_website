import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskAssignment } from '@/lib/tasks/models'
import type { TaskAssignmentDoc } from '@/lib/tasks/models'
import {
  isValidObjectId,
  loadTaskContext,
  logHistory,
  notify,
  serializeAssignment,
  toObjectId,
} from '@/lib/tasks/service'
import { ASSIGNABLE_STATUSES } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, assignmentId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!isValidObjectId(assignmentId)) {
    return NextResponse.json({ error: 'Invalid assignment' }, { status: 400 })
  }

  const assignment = await TaskAssignment.findOne({
    _id: toObjectId(assignmentId),
    taskId: ctx.task._id,
    removedAt: null,
  }).lean<TaskAssignmentDoc>()
  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

  const isOwnAssignment = String(assignment.assigneeId) === String(session.id)
  if (!(ctx.isAdmin || ctx.isCreator || isOwnAssignment)) {
    return NextResponse.json({ error: 'You cannot update this assignment' }, { status: 403 })
  }

  const body = await req.json()
  const set: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!ASSIGNABLE_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    set.status = body.status
    if (body.status === 'completed') set.completedAt = new Date()
    else set.completedAt = undefined
  }
  if (body.completionPercent !== undefined && (ctx.isAdmin || ctx.isCreator || isOwnAssignment)) {
    const p = Math.max(0, Math.min(100, Number(body.completionPercent) || 0))
    set.completionPercent = p
  }

  if (!Object.keys(set).length) {
    return NextResponse.json({ error: 'No changes' }, { status: 400 })
  }

  await TaskAssignment.updateOne({ _id: assignment._id }, { $set: set })
  await logHistory(
    ctx.task._id,
    ctx.actor,
    'assignee_status_changed',
    `${assignment.assigneeName}: ${set.status ? `status → ${set.status}` : `progress → ${set.completionPercent}%`}`,
    { assignmentId: String(assignment._id) }
  )

  // Notify task creator when an assignee updates their own progress.
  if (isOwnAssignment && !ctx.isCreator) {
    await notify([String(ctx.task.createdBy?.id)], {
      type: 'task_updated',
      title: 'Assignee progress updated',
      body: `${assignment.assigneeName} updated "${ctx.task.title}"`,
      taskId: ctx.task._id,
      link: `/admin/tasks?task=${ctx.task._id}`,
    }, session.id)
  }

  const fresh = await TaskAssignment.findById(assignment._id).lean<TaskAssignmentDoc>()
  return NextResponse.json({ assignment: serializeAssignment(fresh as TaskAssignmentDoc) })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, assignmentId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'You cannot remove assignees' }, { status: 403 })
  }
  if (!isValidObjectId(assignmentId)) {
    return NextResponse.json({ error: 'Invalid assignment' }, { status: 400 })
  }

  const assignment = await TaskAssignment.findOne({
    _id: toObjectId(assignmentId),
    taskId: ctx.task._id,
  }).lean<TaskAssignmentDoc>()
  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

  await TaskAssignment.updateOne({ _id: assignment._id }, { $set: { removedAt: new Date() } })
  await logHistory(
    ctx.task._id,
    ctx.actor,
    'task_unassigned',
    `Removed ${assignment.assigneeName} from task`
  )
  return NextResponse.json({ ok: true })
}
