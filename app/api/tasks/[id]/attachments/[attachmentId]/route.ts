import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { deleteFile } from '@/lib/gridfs'
import { TaskAttachment } from '@/lib/tasks/models'
import type { TaskAttachmentDoc } from '@/lib/tasks/models'
import { isValidObjectId, loadTaskContext, logHistory, toObjectId } from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, attachmentId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!isValidObjectId(attachmentId)) {
    return NextResponse.json({ error: 'Invalid attachment' }, { status: 400 })
  }

  const attachment = await TaskAttachment.findOne({
    _id: toObjectId(attachmentId),
    taskId: ctx.task._id,
    deletedAt: null,
  }).lean<TaskAttachmentDoc>()
  if (!attachment) return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })

  const isUploader = String(attachment.uploadedBy?.id) === String(session.id)
  if (!(ctx.isAdmin || ctx.isCreator || isUploader)) {
    return NextResponse.json({ error: 'You cannot delete this attachment' }, { status: 403 })
  }

  await TaskAttachment.updateOne({ _id: attachment._id }, { $set: { deletedAt: new Date() } })
  await deleteFile(attachment.fileId).catch(() => {})
  await logHistory(ctx.task._id, ctx.actor, 'attachment_removed', `Removed "${attachment.fileName}"`)
  return NextResponse.json({ ok: true })
}
