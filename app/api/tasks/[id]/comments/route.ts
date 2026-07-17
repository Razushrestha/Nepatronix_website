import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee } from '@/lib/hr/models'
import { TaskComment, TaskCommentFile } from '@/lib/tasks/models'
import type { TaskCommentDoc, TaskCommentFileDoc } from '@/lib/tasks/models'
import {
  isValidObjectId,
  loadTaskContext,
  logHistory,
  notify,
  sanitizeHtml,
  serializeComment,
  taskAssigneeIds,
  toObjectId,
} from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const [comments, files] = await Promise.all([
    TaskComment.find({ taskId: ctx.task._id }).sort({ createdAt: 1 }).lean<TaskCommentDoc[]>(),
    TaskCommentFile.find({ taskId: ctx.task._id }).lean<TaskCommentFileDoc[]>(),
  ])
  return NextResponse.json({ comments: comments.map((c) => serializeComment(c, files)) })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const body = await req.json()
  const text = sanitizeHtml(body.body)
  const files: { fileId: string; fileName: string; contentType?: string; size?: number }[] =
    Array.isArray(body.files) ? body.files : []
  if (!text && !files.length) {
    return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })
  }

  // Resolve mentions from provided ids.
  const mentionIds: string[] = Array.isArray(body.mentions) ? body.mentions.filter(isValidObjectId) : []
  let mentions: { id: import('mongoose').Types.ObjectId; name: string }[] = []
  if (mentionIds.length) {
    const emps = await HrEmployee.find({ _id: { $in: mentionIds.map(toObjectId) } })
      .select('fullName')
      .lean<{ _id: import('mongoose').Types.ObjectId; fullName: string }[]>()
    mentions = emps.map((e) => ({ id: e._id, name: e.fullName }))
  }

  const comment = await TaskComment.create({
    taskId: ctx.task._id,
    parentId: body.parentId && isValidObjectId(body.parentId) ? toObjectId(body.parentId) : undefined,
    author: ctx.actor,
    body: text,
    mentions,
  })

  const savedFiles: TaskCommentFileDoc[] = []
  for (const f of files) {
    if (!f.fileId || !f.fileName) continue
    const cf = await TaskCommentFile.create({
      commentId: comment._id,
      taskId: ctx.task._id,
      fileId: f.fileId,
      fileName: f.fileName,
      contentType: f.contentType,
      size: f.size,
      uploadedBy: ctx.actor,
    })
    savedFiles.push(cf)
  }

  await logHistory(ctx.task._id, ctx.actor, 'comment_added', 'Added a comment')

  // Notify participants + mentioned users.
  const participants = [String(ctx.task.createdBy?.id), ...(await taskAssigneeIds(ctx.task._id))]
  await notify(participants, {
    type: 'comment_added',
    title: 'New comment',
    body: `${ctx.actor.name} commented on "${ctx.task.title}"`,
    taskId: ctx.task._id,
    link: `/admin/tasks?task=${ctx.task._id}`,
  }, session.id)
  if (mentions.length) {
    await notify(
      mentions.map((m) => String(m.id)),
      {
        type: 'comment_mention',
        title: 'You were mentioned',
        body: `${ctx.actor.name} mentioned you on "${ctx.task.title}"`,
        taskId: ctx.task._id,
        link: `/admin/tasks?task=${ctx.task._id}`,
      },
      session.id
    )
  }

  return NextResponse.json({ comment: serializeComment(comment, savedFiles) }, { status: 201 })
}
