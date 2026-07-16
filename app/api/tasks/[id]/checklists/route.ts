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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const rows = await TaskChecklist.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ order: 1, createdAt: 1 })
    .lean<TaskChecklistDoc[]>()
  return NextResponse.json({ checklists: rows.map(serializeChecklist) })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'You cannot add checklist items' }, { status: 403 })
  }

  const body = await req.json()
  const title = String(body.title || '').trim()
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  let assignedToId: string | undefined
  let assignedToName: string | undefined
  if (body.assignedToId && isValidObjectId(body.assignedToId)) {
    const emp = await HrEmployee.findById(body.assignedToId).select('fullName').lean<{ fullName: string }>()
    if (emp) {
      assignedToId = body.assignedToId
      assignedToName = emp.fullName
    }
  }

  const last = await TaskChecklist.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ order: -1 })
    .limit(1)
    .lean<TaskChecklistDoc[]>()
  const order = (last[0]?.order ?? -1) + 1

  const item = await TaskChecklist.create({
    taskId: ctx.task._id,
    dailyPlanId: body.dailyPlanId && isValidObjectId(body.dailyPlanId) ? toObjectId(body.dailyPlanId) : undefined,
    title,
    description: sanitizeHtml(body.description),
    assignedToId: assignedToId ? toObjectId(assignedToId) : undefined,
    assignedToName,
    order,
  })

  await logHistory(ctx.task._id, ctx.actor, 'checklist_added', `Added checklist "${title}"`)
  if (assignedToId) {
    await notify([assignedToId], {
      type: 'checklist_assigned',
      title: 'Checklist item assigned',
      body: `${title} — ${ctx.task.title}`,
      taskId: ctx.task._id,
      link: `/attendance?task=${ctx.task._id}`,
    }, session.id)
  }
  await recomputeProgress(ctx.task._id)

  return NextResponse.json({ checklist: serializeChecklist(item) }, { status: 201 })
}
