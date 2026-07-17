import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskAttachment } from '@/lib/tasks/models'
import type { TaskAttachmentDoc } from '@/lib/tasks/models'
import { loadTaskContext, logHistory, notify, serializeAttachment, taskAssigneeIds } from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const rows = await TaskAttachment.find({ taskId: ctx.task._id, deletedAt: null })
    .sort({ createdAt: -1 })
    .lean<TaskAttachmentDoc[]>()
  return NextResponse.json({ attachments: rows.map(serializeAttachment) })
}

/** Register an already-uploaded file (via /api/hr/upload) as a task attachment. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const body = await req.json()
  const fileId = String(body.fileId || '').trim()
  const fileName = String(body.fileName || '').trim()
  if (!fileId || !fileName) {
    return NextResponse.json({ error: 'fileId and fileName are required' }, { status: 400 })
  }

  const attachment = await TaskAttachment.create({
    taskId: ctx.task._id,
    title: body.title ? String(body.title).trim() : undefined,
    description: body.description ? String(body.description).trim() : undefined,
    fileId,
    fileName,
    contentType: body.contentType,
    size: Number(body.size) || undefined,
    uploadedBy: ctx.actor,
  })

  await logHistory(ctx.task._id, ctx.actor, 'attachment_uploaded', `Uploaded "${fileName}"`)
  await notify([String(ctx.task.createdBy?.id), ...(await taskAssigneeIds(ctx.task._id))], {
    type: 'task_updated',
    title: 'New attachment',
    body: `${ctx.actor.name} added "${fileName}" to ${ctx.task.title}`,
    taskId: ctx.task._id,
    link: `/admin/tasks?task=${ctx.task._id}`,
  }, session.id)

  return NextResponse.json({ attachment: serializeAttachment(attachment) }, { status: 201 })
}
