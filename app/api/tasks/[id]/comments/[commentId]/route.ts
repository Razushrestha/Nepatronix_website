import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskComment, TaskCommentFile } from '@/lib/tasks/models'
import type { TaskCommentDoc, TaskCommentFileDoc } from '@/lib/tasks/models'
import {
  isValidObjectId,
  loadTaskContext,
  logHistory,
  sanitizeHtml,
  serializeComment,
  toObjectId,
} from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, commentId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!isValidObjectId(commentId)) return NextResponse.json({ error: 'Invalid comment' }, { status: 400 })

  const comment = await TaskComment.findOne({ _id: toObjectId(commentId), taskId: ctx.task._id }).lean<TaskCommentDoc>()
  if (!comment || comment.deletedAt) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  const isAuthor = String(comment.author?.id) === String(session.id)
  if (!isAuthor) return NextResponse.json({ error: 'You can only edit your own comment' }, { status: 403 })

  const body = await req.json()
  const text = sanitizeHtml(body.body)
  if (!text) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })

  await TaskComment.updateOne({ _id: comment._id }, { $set: { body: text, editedAt: new Date() } })
  await logHistory(ctx.task._id, ctx.actor, 'comment_edited', 'Edited a comment')

  const fresh = await TaskComment.findById(comment._id).lean<TaskCommentDoc>()
  const files = await TaskCommentFile.find({ commentId: comment._id }).lean<TaskCommentFileDoc[]>()
  return NextResponse.json({ comment: serializeComment(fresh as TaskCommentDoc, files) })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id, commentId } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  if (!isValidObjectId(commentId)) return NextResponse.json({ error: 'Invalid comment' }, { status: 400 })

  const comment = await TaskComment.findOne({ _id: toObjectId(commentId), taskId: ctx.task._id }).lean<TaskCommentDoc>()
  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  const isAuthor = String(comment.author?.id) === String(session.id)
  if (!isAuthor && !ctx.isAdmin) {
    return NextResponse.json({ error: 'You cannot delete this comment' }, { status: 403 })
  }

  await TaskComment.updateOne({ _id: comment._id }, { $set: { deletedAt: new Date() } })
  await logHistory(ctx.task._id, ctx.actor, 'comment_deleted', 'Deleted a comment')
  return NextResponse.json({ ok: true })
}
