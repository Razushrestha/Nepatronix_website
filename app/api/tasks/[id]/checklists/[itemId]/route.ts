import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee } from '@/lib/hr/models'
import { TaskChecklist } from '@/lib/tasks/models'
import type { TaskChecklistDoc } from '@/lib/tasks/models'
import {
  isValidObjectId,
  loadTaskContext,
  logHistory,
  notify,
  recomputeProgress,
  sanitizeHtml,
  serializeChecklist,
  toObjectId,
} from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, itemId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!isValidObjectId(itemId)) return NextResponse.json({ error: 'Invalid item' }, { status: 400 })

  const item = await TaskChecklist.findOne({
    _id: toObjectId(itemId),
    taskId: ctx.task._id,
    deletedAt: null,
  }).lean<TaskChecklistDoc>()
  if (!item) return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 })

  const body = await req.json()
  const set: Record<string, unknown> = {}
  const canManage = ctx.isAdmin || ctx.isCreator
  // Anyone assigned to the task (or the item) can tick / add proof.
  const canComplete = canManage || ctx.isAssignee || String(item.assignedToId || '') === String(session.id)

  let completedChanged = false

  if (body.completionPercent !== undefined && canComplete) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(body.completionPercent) || 0)))
    set.completionPercent = pct
    if (pct >= 100) {
      set.completed = true
      set.completedAt = new Date()
      set.completedBy = ctx.actor
      completedChanged = !item.completed
    } else {
      set.completed = false
      set.completedAt = undefined
      set.completedBy = undefined
      completedChanged = item.completed
    }
  }

  if (body.completed !== undefined) {
    if (!canComplete) {
      return NextResponse.json({ error: 'You cannot update this item' }, { status: 403 })
    }
    const completed = Boolean(body.completed)
    set.completed = completed
    if (completed) {
      set.completionPercent = 100
      set.completedAt = new Date()
      set.completedBy = ctx.actor
    } else {
      const keep =
        body.completionPercent !== undefined
          ? Math.max(0, Math.min(99, Math.round(Number(body.completionPercent) || 0)))
          : Math.min(item.completionPercent ?? 0, 99)
      set.completionPercent = keep
      set.completedAt = undefined
      set.completedBy = undefined
    }
    completedChanged = completed !== item.completed
  }

  if (body.remarks !== undefined && canComplete) set.remarks = String(body.remarks)
  if (body.proofFileId !== undefined && canComplete) {
    set.proofFileId = body.proofFileId || undefined
    set.proofFileName = body.proofFileName || undefined
  }

  if (canManage) {
    if (body.title !== undefined && String(body.title).trim()) set.title = String(body.title).trim()
    if (body.description !== undefined) set.description = sanitizeHtml(body.description)
    if (body.dailyPlanId !== undefined) {
      set.dailyPlanId = body.dailyPlanId && isValidObjectId(body.dailyPlanId) ? toObjectId(body.dailyPlanId) : undefined
    }
    if (body.assignedToId !== undefined) {
      if (body.assignedToId && isValidObjectId(body.assignedToId)) {
        const emp = await HrEmployee.findById(body.assignedToId).select('fullName').lean<{ fullName: string }>()
        set.assignedToId = toObjectId(body.assignedToId)
        set.assignedToName = emp?.fullName
      } else {
        set.assignedToId = undefined
        set.assignedToName = undefined
      }
    }
  }

  if (!Object.keys(set).length) return NextResponse.json({ error: 'No changes' }, { status: 400 })

  await TaskChecklist.updateOne({ _id: item._id }, { $set: set })

  if (completedChanged) {
    const action = set.completed ? 'checklist_completed' : 'checklist_reopened'
    await logHistory(
      ctx.task._id,
      ctx.actor,
      action,
      `${set.completed ? 'Completed' : 'Reopened'} checklist "${item.title}"`
    )
    if (set.completed) {
      const recipients = [String(ctx.task.createdBy?.id)]
      if (item.assignedToId) recipients.push(String(item.assignedToId))
      await notify(recipients, {
        type: 'checklist_completed',
        title: 'Checklist completed',
        body: `${item.title} — ${ctx.task.title}`,
        taskId: ctx.task._id,
        link: `/admin/tasks?task=${ctx.task._id}`,
      }, session.id)
    }
  } else {
    await logHistory(ctx.task._id, ctx.actor, 'checklist_updated', `Updated checklist "${item.title}"`)
  }

  const overall = await recomputeProgress(ctx.task._id)
  const fresh = await TaskChecklist.findById(item._id).lean<TaskChecklistDoc>()
  return NextResponse.json({ checklist: serializeChecklist(fresh as TaskChecklistDoc), completionPercent: overall })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, itemId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'You cannot remove checklist items' }, { status: 403 })
  }
  if (!isValidObjectId(itemId)) return NextResponse.json({ error: 'Invalid item' }, { status: 400 })

  const item = await TaskChecklist.findOne({ _id: toObjectId(itemId), taskId: ctx.task._id }).lean<TaskChecklistDoc>()
  if (!item) return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 })

  await TaskChecklist.updateOne({ _id: item._id }, { $set: { deletedAt: new Date() } })
  await logHistory(ctx.task._id, ctx.actor, 'checklist_removed', `Removed checklist "${item.title}"`)
  const overall = await recomputeProgress(ctx.task._id)
  return NextResponse.json({ ok: true, completionPercent: overall })
}
