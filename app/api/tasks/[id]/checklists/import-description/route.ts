import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskChecklist } from '@/lib/tasks/models'
import type { TaskChecklistDoc } from '@/lib/tasks/models'
import { parseDescriptionToChecklistItems } from '@/lib/tasks/parse-description-checklist'
import {
  loadTaskContext,
  logHistory,
  recomputeProgress,
  serializeChecklist,
} from '@/lib/tasks/service'

export const runtime = 'nodejs'

/** Create checklist items from the task description (admin/creator only). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!(ctx.isAdmin || ctx.isCreator)) {
    return NextResponse.json({ error: 'Only the task creator or admin can import checklist items' }, { status: 403 })
  }

  const description = ctx.task.description || ''
  const parsed = parseDescriptionToChecklistItems(description)
  if (!parsed.length) {
    return NextResponse.json(
      { error: 'No list items found in the description. Use numbered lines, bullets, or a bullet/numbered list.' },
      { status: 400 }
    )
  }

  const existing = await TaskChecklist.find({ taskId: ctx.task._id, deletedAt: null })
    .select('title')
    .lean<{ title: string }[]>()
  const existingKeys = new Set(existing.map((e) => e.title.toLowerCase().trim()))

  const toCreate = parsed.filter((t) => !existingKeys.has(t.toLowerCase()))
  if (!toCreate.length) {
    return NextResponse.json({
      created: [],
      skipped: parsed.length,
      message: 'All items from the description already exist in the checklist.',
    })
  }

  const last = await TaskChecklist.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ order: -1 })
    .limit(1)
    .lean<TaskChecklistDoc[]>()
  let order = (last[0]?.order ?? -1) + 1

  const created = []
  for (const title of toCreate) {
    const item = await TaskChecklist.create({
      taskId: ctx.task._id,
      title,
      order: order++,
    })
    created.push(serializeChecklist(item))
  }

  await logHistory(
    ctx.task._id,
    ctx.actor,
    'checklist_added',
    `Imported ${created.length} checklist item(s) from description`
  )
  const completionPercent = await recomputeProgress(ctx.task._id)

  return NextResponse.json({
    created,
    skipped: parsed.length - toCreate.length,
    completionPercent,
    message: `Added ${created.length} checklist item(s) from description`,
  })
}
