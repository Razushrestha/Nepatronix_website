import mongoose, { Schema, model, models, type Model } from 'mongoose'
import type { HrDepartment, HrRole } from '@/lib/hr/constants'
import type {
  AssigneeType,
  NotificationType,
  TaskCategory,
  TaskHistoryAction,
  TaskPriority,
  TaskStatus,
  TaskVisibility,
} from './constants'

function makeModel<T>(name: string, schema: Schema): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema)
}

type OID = mongoose.Types.ObjectId

/** Lightweight actor snapshot stored inline so history survives employee edits. */
export interface ActorRef {
  id: OID
  name: string
  role?: HrRole | string
}

const ActorRefSchema = new Schema<ActorRef>(
  {
    id: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true },
    name: { type: String, required: true },
    role: String,
  },
  { _id: false }
)

/* ------------------------------------------------------------------ */
/* Task                                                                */
/* ------------------------------------------------------------------ */

export interface TaskDoc {
  _id: OID
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  category?: TaskCategory
  department?: HrDepartment
  project?: string
  visibility: TaskVisibility
  startDate?: string
  dueDate?: string
  estimatedHours: number
  actualHours: number
  completionPercent: number
  createdBy: ActorRef
  assignedBy?: ActorRef
  approvedBy?: ActorRef
  approvedAt?: Date
  archived: boolean
  closedAt?: Date
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<TaskDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'review', 'completed', 'cancelled', 'overdue'],
      default: 'pending',
      index: true,
    },
    category: String,
    department: { type: String, index: true },
    project: { type: String, index: true },
    visibility: {
      type: String,
      enum: ['private', 'team', 'company'],
      default: 'team',
    },
    startDate: String,
    dueDate: { type: String, index: true },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    createdBy: { type: ActorRefSchema, required: true },
    assignedBy: ActorRefSchema,
    approvedBy: ActorRefSchema,
    approvedAt: Date,
    archived: { type: Boolean, default: false, index: true },
    closedAt: Date,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
)
TaskSchema.index({ title: 'text', description: 'text', project: 'text' })
TaskSchema.index({ deletedAt: 1, archived: 1, status: 1 })

export const Task = makeModel<TaskDoc>('Task', TaskSchema)

/* ------------------------------------------------------------------ */
/* Task assignment (per-person independent progress)                   */
/* ------------------------------------------------------------------ */

export interface TaskAssignmentDoc {
  _id: OID
  taskId: OID
  assigneeId: OID
  assigneeType: AssigneeType
  assigneeName: string
  assigneeDepartment?: HrDepartment
  assignedBy?: ActorRef
  status: TaskStatus
  completionPercent: number
  completedAt?: Date
  removedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskAssignmentSchema = new Schema<TaskAssignmentDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true, index: true },
    assigneeType: { type: String, enum: ['employee', 'freelancer'], default: 'employee' },
    assigneeName: { type: String, required: true },
    assigneeDepartment: String,
    assignedBy: ActorRefSchema,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'review', 'completed', 'cancelled', 'overdue'],
      default: 'pending',
    },
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    completedAt: Date,
    removedAt: { type: Date, default: null },
  },
  { timestamps: true }
)
TaskAssignmentSchema.index({ taskId: 1, assigneeId: 1 }, { unique: true })
TaskAssignmentSchema.index({ assigneeId: 1, removedAt: 1 })

export const TaskAssignment = makeModel<TaskAssignmentDoc>('TaskAssignment', TaskAssignmentSchema)

/* ------------------------------------------------------------------ */
/* Daily plan                                                          */
/* ------------------------------------------------------------------ */

export interface TaskDailyPlanDoc {
  _id: OID
  taskId: OID
  dayNumber: number
  title: string
  description?: string
  dueDate?: string
  order: number
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskDailyPlanSchema = new Schema<TaskDailyPlanDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    dayNumber: { type: Number, default: 1 },
    title: { type: String, required: true, trim: true },
    description: String,
    dueDate: String,
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const TaskDailyPlan = makeModel<TaskDailyPlanDoc>('TaskDailyPlan', TaskDailyPlanSchema)

/* ------------------------------------------------------------------ */
/* Checklist                                                           */
/* ------------------------------------------------------------------ */

export interface TaskChecklistDoc {
  _id: OID
  taskId: OID
  dailyPlanId?: OID
  title: string
  description?: string
  assignedToId?: OID
  assignedToName?: string
  completed: boolean
  completionPercent: number
  completedAt?: Date
  completedBy?: ActorRef
  remarks?: string
  proofFileId?: string
  proofFileName?: string
  order: number
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskChecklistSchema = new Schema<TaskChecklistDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    dailyPlanId: { type: Schema.Types.ObjectId, ref: 'TaskDailyPlan', index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    assignedToId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', index: true },
    assignedToName: String,
    completed: { type: Boolean, default: false },
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    completedAt: Date,
    completedBy: ActorRefSchema,
    remarks: String,
    proofFileId: String,
    proofFileName: String,
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const TaskChecklist = makeModel<TaskChecklistDoc>('TaskChecklist', TaskChecklistSchema)

/* ------------------------------------------------------------------ */
/* Comments + comment files                                            */
/* ------------------------------------------------------------------ */

export interface TaskCommentDoc {
  _id: OID
  taskId: OID
  parentId?: OID
  author: ActorRef
  body: string
  mentions: { id: OID; name: string }[]
  editedAt?: Date
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MentionSchema = new Schema(
  { id: { type: Schema.Types.ObjectId, ref: 'HrEmployee' }, name: String },
  { _id: false }
)

const TaskCommentSchema = new Schema<TaskCommentDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'TaskComment', index: true },
    author: { type: ActorRefSchema, required: true },
    body: { type: String, default: '' },
    mentions: { type: [MentionSchema], default: [] },
    editedAt: Date,
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const TaskComment = makeModel<TaskCommentDoc>('TaskComment', TaskCommentSchema)

export interface TaskCommentFileDoc {
  _id: OID
  commentId: OID
  taskId: OID
  fileId: string
  fileName: string
  contentType?: string
  size?: number
  uploadedBy?: ActorRef
  createdAt: Date
  updatedAt: Date
}

const TaskCommentFileSchema = new Schema<TaskCommentFileDoc>(
  {
    commentId: { type: Schema.Types.ObjectId, ref: 'TaskComment', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    contentType: String,
    size: Number,
    uploadedBy: ActorRefSchema,
  },
  { timestamps: true }
)

export const TaskCommentFile = makeModel<TaskCommentFileDoc>('TaskCommentFile', TaskCommentFileSchema)

/* ------------------------------------------------------------------ */
/* Attachments                                                         */
/* ------------------------------------------------------------------ */

export interface TaskAttachmentDoc {
  _id: OID
  taskId: OID
  title?: string
  description?: string
  fileId: string
  fileName: string
  contentType?: string
  size?: number
  uploadedBy: ActorRef
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskAttachmentSchema = new Schema<TaskAttachmentDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    title: String,
    description: String,
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    contentType: String,
    size: Number,
    uploadedBy: { type: ActorRefSchema, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const TaskAttachment = makeModel<TaskAttachmentDoc>('TaskAttachment', TaskAttachmentSchema)

/* ------------------------------------------------------------------ */
/* Activity history (append-only, never deleted)                       */
/* ------------------------------------------------------------------ */

export interface TaskHistoryDoc {
  _id: OID
  taskId: OID
  action: TaskHistoryAction
  actor: ActorRef
  message: string
  meta?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const TaskHistorySchema = new Schema<TaskHistoryDoc>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    action: { type: String, required: true },
    actor: { type: ActorRefSchema, required: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

export const TaskHistory = makeModel<TaskHistoryDoc>('TaskHistory', TaskHistorySchema)

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export interface NotificationDoc {
  _id: OID
  userId: OID
  type: NotificationType
  title: string
  body?: string
  taskId?: OID
  link?: string
  read: boolean
  readAt?: Date
  meta?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<NotificationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: String,
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
    link: String,
    read: { type: Boolean, default: false, index: true },
    readAt: Date,
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 })

export const Notification = makeModel<NotificationDoc>('Notification', NotificationSchema)
