import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskChecklist, TaskDailyPlan } from '@/lib/tasks/models'
import type { TaskDailyPlanDoc } from '@/lib/tasks/models'
import {
  isValidObjectId,
  loadTaskContext,
  logHistory,
  sanitizeHtml,
  serializeDailyPlan,
  toObjectId,
} from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; planId: string }> }
) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, planId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'You cannot edit the plan' }, { status: 403 })
  }
  if (!isValidObjectId(planId)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const body = await req.json()
  const set: Record<string, unknown> = {}
  if (body.title !== undefined && String(body.title).trim()) set.title = String(body.title).trim()
  if (body.description !== undefined) set.description = sanitizeHtml(body.description)
  if (body.dueDate !== undefined) set.dueDate = body.dueDate || undefined
  if (body.dayNumber !== undefined) set.dayNumber = Number(body.dayNumber) || 1
  if (body.order !== undefined) set.order = Number(body.order) || 0
  if (!Object.keys(set).length) return NextResponse.json({ error: 'No changes' }, { status: 400 })

  const plan = await TaskDailyPlan.findOneAndUpdate(
    { _id: toObjectId(planId), taskId: ctx.task._id, deletedAt: null },
    { $set: set },
    { new: true }
  ).lean<TaskDailyPlanDoc>()
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  await logHistory(ctx.task._id, ctx.actor, 'daily_plan_updated', `Updated day plan "${plan.title}"`)
  return NextResponse.json({ dailyPlan: serializeDailyPlan(plan) })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; planId: string }> }
) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, planId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'You cannot edit the plan' }, { status: 403 })
  }
  if (!isValidObjectId(planId)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const plan = await TaskDailyPlan.findOne({ _id: toObjectId(planId), taskId: ctx.task._id }).lean<TaskDailyPlanDoc>()
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  await TaskDailyPlan.updateOne({ _id: plan._id }, { $set: { deletedAt: new Date() } })
  // Detach checklists from the removed day so they remain on the task.
  await TaskChecklist.updateMany(
    { dailyPlanId: plan._id, deletedAt: null },
    { $unset: { dailyPlanId: '' } }
  )
  await logHistory(ctx.task._id, ctx.actor, 'daily_plan_removed', `Removed day plan "${plan.title}"`)
  return NextResponse.json({ ok: true })
}
