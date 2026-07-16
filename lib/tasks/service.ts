import mongoose from 'mongoose'
import { fileUrl } from '@/lib/gridfs'
import type { HrSessionUser } from '@/lib/hr/auth'
import { HrEmployee } from '@/lib/hr/models'
import type { EmploymentType } from '@/lib/hr/constants'
import {
  Notification,
  Task,
  TaskAssignment,
  TaskAttachment,
  TaskChecklist,
  TaskComment,
  TaskCommentFile,
  TaskHistory,
  type ActorRef,
  type NotificationDoc,
  type TaskAssignmentDoc,
  type TaskAttachmentDoc,
  type TaskChecklistDoc,
  type TaskCommentDoc,
  type TaskCommentFileDoc,
  type TaskDailyPlanDoc,
  type TaskDoc,
  type TaskHistoryDoc,
} from './models'
import {
  canViewAllTasks,
  isManager,
  isTaskAdmin,
  type AssigneeType,
  type NotificationType,
  type TaskHistoryAction,
} from './constants'

const { ObjectId } = mongoose.Types

export function toObjectId(id: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId {
  if (id instanceof ObjectId) return id
  return new ObjectId(String(id))
}

export function isValidObjectId(id: unknown): boolean {
  return typeof id === 'string' && mongoose.isValidObjectId(id)
}

/** Snapshot of the acting user for history / actor refs. */
export function toActor(session: HrSessionUser): ActorRef {
  const id = isValidObjectId(session.id) ? toObjectId(session.id) : new ObjectId()
  return { id, name: session.fullName, role: session.role }
}

export function assigneeTypeFromEmployment(type?: EmploymentType | string): AssigneeType {
  return type === 'freelance' || type === 'project_basis' ? 'freelancer' : 'employee'
}

/* ------------------------------------------------------------------ */
/* HTML sanitization for rich-text descriptions & comments            */
/* ------------------------------------------------------------------ */

const DISALLOWED_TAGS = /<\/?(script|style|iframe|object|embed|link|meta|base|form)[^>]*>/gi
const EVENT_ATTRS = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi
const JS_URI = /(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi

/** Strip dangerous markup while preserving formatting from the rich-text editor. */
export function sanitizeHtml(input: string | undefined | null): string {
  if (!input) return ''
  return String(input)
    .replace(DISALLOWED_TAGS, '')
    .replace(EVENT_ATTRS, '')
    .replace(JS_URI, '$1="#"')
    .trim()
}

/* ------------------------------------------------------------------ */
/* Access control helpers                                              */
/* ------------------------------------------------------------------ */

/** Task ids the session is assigned to (active assignments only). */
export async function getAssignedTaskIds(userId: string): Promise<mongoose.Types.ObjectId[]> {
  if (!isValidObjectId(userId)) return []
  const rows = await TaskAssignment.find({
    assigneeId: toObjectId(userId),
    removedAt: null,
  })
    .select('taskId')
    .lean<{ taskId: mongoose.Types.ObjectId }[]>()
  return rows.map((r) => r.taskId)
}

/** Build a Mongo filter limiting tasks to what the session may see. */
export async function buildTaskAccessFilter(
  session: HrSessionUser
): Promise<Record<string, unknown>> {
  if (canViewAllTasks(session.role)) return {}

  const assignedIds = await getAssignedTaskIds(session.id)
  const createdMatch = isValidObjectId(session.id)
    ? { 'createdBy.id': toObjectId(session.id) }
    : { 'createdBy.id': new ObjectId() }

  if (isManager(session.role)) {
    return { $or: [createdMatch, { _id: { $in: assignedIds } }, { 'assignedBy.id': createdMatch['createdBy.id'] }] }
  }
  return { $or: [createdMatch, { _id: { $in: assignedIds } }] }
}

/** Whether the session can view a specific task. */
export async function canAccessTask(session: HrSessionUser, task: TaskDoc): Promise<boolean> {
  if (canViewAllTasks(session.role)) return true
  if (isValidObjectId(session.id) && String(task.createdBy?.id) === String(session.id)) return true
  const assigned = await TaskAssignment.exists({
    taskId: task._id,
    assigneeId: toObjectId(session.id),
    removedAt: null,
  })
  return Boolean(assigned)
}

export interface TaskContext {
  task: TaskDoc
  isAdmin: boolean
  isCreator: boolean
  isAssignee: boolean
  actor: ActorRef
}

/** Load a non-deleted task with the session's role relationship to it, or null. */
export async function loadTaskContext(
  session: HrSessionUser,
  id: string
): Promise<TaskContext | null> {
  if (!isValidObjectId(id)) return null
  const task = await Task.findOne({ _id: toObjectId(id), deletedAt: null }).lean<TaskDoc>()
  if (!task) return null
  if (!(await canAccessTask(session, task))) return null
  const isCreator = isValidObjectId(session.id) && String(task.createdBy?.id) === String(session.id)
  const isAssignee = Boolean(
    await TaskAssignment.exists({ taskId: task._id, assigneeId: toObjectId(session.id), removedAt: null })
  )
  return {
    task,
    isAdmin: isTaskAdmin(session.role),
    isCreator,
    isAssignee,
    actor: toActor(session),
  }
}

/* ------------------------------------------------------------------ */
/* History + notifications                                             */
/* ------------------------------------------------------------------ */

export async function logHistory(
  taskId: mongoose.Types.ObjectId | string,
  actor: ActorRef,
  action: TaskHistoryAction,
  message: string,
  meta?: Record<string, unknown>
): Promise<void> {
  await TaskHistory.create({ taskId: toObjectId(taskId), actor, action, message, meta })
}

export async function notify(
  userIds: (mongoose.Types.ObjectId | string)[],
  payload: {
    type: NotificationType
    title: string
    body?: string
    taskId?: mongoose.Types.ObjectId | string
    link?: string
    meta?: Record<string, unknown>
  },
  excludeUserId?: string
): Promise<void> {
  const unique = Array.from(
    new Set(userIds.filter(Boolean).map((u) => String(u)))
  ).filter((u) => u !== excludeUserId && isValidObjectId(u))
  if (!unique.length) return
  await Notification.insertMany(
    unique.map((uid) => ({
      userId: toObjectId(uid),
      type: payload.type,
      title: payload.title,
      body: payload.body,
      taskId: payload.taskId ? toObjectId(payload.taskId) : undefined,
      link: payload.link,
      meta: payload.meta,
      read: false,
    }))
  )
}

/** Active assignee ids for a task, used to fan out notifications. */
export async function taskAssigneeIds(
  taskId: mongoose.Types.ObjectId | string
): Promise<string[]> {
  const rows = await TaskAssignment.find({ taskId: toObjectId(taskId), removedAt: null })
    .select('assigneeId')
    .lean<{ assigneeId: mongoose.Types.ObjectId }[]>()
  return rows.map((r) => String(r.assigneeId))
}

/* ------------------------------------------------------------------ */
/* Progress recomputation                                             */
/* ------------------------------------------------------------------ */

/**
 * Recompute completion % from checklists for the whole task and each assignee.
 * Progress = completed checklist items / total checklist items.
 */
export async function recomputeProgress(
  taskId: mongoose.Types.ObjectId | string
): Promise<number> {
  const tid = toObjectId(taskId)
  const items = await TaskChecklist.find({ taskId: tid, deletedAt: null }).lean<TaskChecklistDoc[]>()

  const total = items.length
  const done = items.filter((i) => i.completed).length
  const overall = total ? Math.round((done / total) * 100) : 0

  await Task.updateOne({ _id: tid }, { $set: { completionPercent: overall } })

  const assignments = await TaskAssignment.find({ taskId: tid, removedAt: null }).lean<
    TaskAssignmentDoc[]
  >()
  for (const a of assignments) {
    const own = items.filter((i) => String(i.assignedToId || '') === String(a.assigneeId))
    let percent = overall
    if (own.length) {
      percent = Math.round((own.filter((i) => i.completed).length / own.length) * 100)
    }
    const patch: Record<string, unknown> = { completionPercent: percent }
    if (percent === 100 && a.status !== 'completed' && a.status !== 'cancelled') {
      patch.completedAt = a.completedAt || new Date()
    }
    await TaskAssignment.updateOne({ _id: a._id }, { $set: patch })
  }

  return overall
}

export function isOverdue(task: Pick<TaskDoc, 'dueDate' | 'status'>): boolean {
  if (!task.dueDate) return false
  if (task.status === 'completed' || task.status === 'cancelled') return false
  const today = new Date().toISOString().slice(0, 10)
  return task.dueDate < today
}

/* ------------------------------------------------------------------ */
/* Serializers                                                         */
/* ------------------------------------------------------------------ */

function serializeActor(a?: ActorRef | null) {
  if (!a) return undefined
  return { id: String(a.id), name: a.name, role: a.role }
}

export function serializeTask(t: TaskDoc, extra?: Record<string, unknown>) {
  return {
    id: String(t._id),
    title: t.title,
    description: t.description || '',
    priority: t.priority,
    status: t.status,
    effectiveStatus: isOverdue(t) ? 'overdue' : t.status,
    overdue: isOverdue(t),
    category: t.category,
    department: t.department,
    project: t.project,
    visibility: t.visibility,
    startDate: t.startDate,
    dueDate: t.dueDate,
    estimatedHours: t.estimatedHours,
    actualHours: t.actualHours,
    completionPercent: t.completionPercent,
    createdBy: serializeActor(t.createdBy),
    assignedBy: serializeActor(t.assignedBy),
    approvedBy: serializeActor(t.approvedBy),
    approvedAt: t.approvedAt,
    archived: t.archived,
    closedAt: t.closedAt,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    ...extra,
  }
}

export function serializeAssignment(a: TaskAssignmentDoc) {
  return {
    id: String(a._id),
    taskId: String(a.taskId),
    assigneeId: String(a.assigneeId),
    assigneeType: a.assigneeType,
    assigneeName: a.assigneeName,
    assigneeDepartment: a.assigneeDepartment,
    assignedBy: serializeActor(a.assignedBy),
    status: a.status,
    completionPercent: a.completionPercent,
    completedAt: a.completedAt,
    createdAt: a.createdAt,
  }
}

export function serializeDailyPlan(p: TaskDailyPlanDoc) {
  return {
    id: String(p._id),
    taskId: String(p.taskId),
    dayNumber: p.dayNumber,
    title: p.title,
    description: p.description || '',
    dueDate: p.dueDate,
    order: p.order,
    createdAt: p.createdAt,
  }
}

export function serializeChecklist(c: TaskChecklistDoc) {
  return {
    id: String(c._id),
    taskId: String(c.taskId),
    dailyPlanId: c.dailyPlanId ? String(c.dailyPlanId) : undefined,
    title: c.title,
    description: c.description || '',
    assignedToId: c.assignedToId ? String(c.assignedToId) : undefined,
    assignedToName: c.assignedToName,
    completed: c.completed,
    completedAt: c.completedAt,
    completedBy: serializeActor(c.completedBy),
    remarks: c.remarks,
    proofFileId: c.proofFileId,
    proofFileName: c.proofFileName,
    proofUrl: c.proofFileId ? fileUrl(c.proofFileId) : undefined,
    order: c.order,
    createdAt: c.createdAt,
  }
}

export function serializeAttachment(a: TaskAttachmentDoc) {
  return {
    id: String(a._id),
    taskId: String(a.taskId),
    title: a.title,
    description: a.description,
    fileId: a.fileId,
    fileName: a.fileName,
    contentType: a.contentType,
    size: a.size,
    url: fileUrl(a.fileId),
    uploadedBy: serializeActor(a.uploadedBy),
    createdAt: a.createdAt,
  }
}

export function serializeComment(
  c: TaskCommentDoc,
  files: TaskCommentFileDoc[] = []
) {
  return {
    id: String(c._id),
    taskId: String(c.taskId),
    parentId: c.parentId ? String(c.parentId) : undefined,
    author: serializeActor(c.author),
    body: c.deletedAt ? '' : c.body,
    mentions: (c.mentions || []).map((m) => ({ id: String(m.id), name: m.name })),
    edited: Boolean(c.editedAt),
    deleted: Boolean(c.deletedAt),
    files: files
      .filter((f) => String(f.commentId) === String(c._id))
      .map((f) => ({
        id: String(f._id),
        fileId: f.fileId,
        fileName: f.fileName,
        contentType: f.contentType,
        url: fileUrl(f.fileId),
      })),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }
}

export function serializeHistory(h: TaskHistoryDoc) {
  return {
    id: String(h._id),
    taskId: String(h.taskId),
    action: h.action,
    actor: serializeActor(h.actor),
    message: h.message,
    meta: h.meta,
    createdAt: h.createdAt,
  }
}

export function serializeNotification(n: NotificationDoc) {
  return {
    id: String(n._id),
    type: n.type,
    title: n.title,
    body: n.body,
    taskId: n.taskId ? String(n.taskId) : undefined,
    link: n.link,
    read: n.read,
    readAt: n.readAt,
    createdAt: n.createdAt,
  }
}

/** Resolve employee snapshots for a list of ids (for assignment creation). */
export async function resolveAssignees(
  ids: string[]
): Promise<
  { id: string; name: string; type: AssigneeType; department?: string }[]
> {
  const valid = ids.filter(isValidObjectId)
  if (!valid.length) return []
  const emps = await HrEmployee.find({ _id: { $in: valid.map(toObjectId) } })
    .select('fullName employmentType department')
    .lean<{ _id: mongoose.Types.ObjectId; fullName: string; employmentType: EmploymentType; department: string }[]>()
  return emps.map((e) => ({
    id: String(e._id),
    name: e.fullName,
    type: assigneeTypeFromEmployment(e.employmentType),
    department: e.department,
  }))
}

export { TaskAttachment, TaskComment, TaskCommentFile }
