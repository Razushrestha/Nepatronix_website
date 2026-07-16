import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskDailyPlan } from '@/lib/tasks/models'
import type { TaskDailyPlanDoc } from '@/lib/tasks/models'
import { loadTaskContext, logHistory, sanitizeHtml, serializeDailyPlan } from '@/lib/tasks/service'
import { canCreateTask } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const rows = await TaskDailyPlan.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ order: 1, dayNumber: 1 })
    .lean<TaskDailyPlanDoc[]>()
  return NextResponse.json({ dailyPlans: rows.map(serializeDailyPlan) })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator) || !canCreateTask(session.role)) {
    return NextResponse.json({ error: 'You cannot edit the plan' }, { status: 403 })
  }

  const body = await req.json()
  const title = String(body.title || '').trim()
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const last = await TaskDailyPlan.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ order: -1 })
    .limit(1)
    .lean<TaskDailyPlanDoc[]>()
  const order = (last[0]?.order ?? -1) + 1

  const plan = await TaskDailyPlan.create({
    taskId: ctx.task._id,
    dayNumber: Number(body.dayNumber) || order + 1,
    title,
    description: sanitizeHtml(body.description),
    dueDate: body.dueDate || undefined,
    order,
  })

  await logHistory(ctx.task._id, ctx.actor, 'daily_plan_added', `Added day plan "${title}"`)
  return NextResponse.json({ dailyPlan: serializeDailyPlan(plan) }, { status: 201 })
}
