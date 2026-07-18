import type {
  AssigneeType,
  NotificationType,
  TaskCategory,
  TaskHistoryAction,
  TaskPriority,
  TaskStatus,
  TaskVisibility,
} from './constants'

export interface ActorDTO {
  id: string
  name: string
  role?: string
}

export interface AssignmentDTO {
  id: string
  taskId: string
  assigneeId: string
  assigneeType: AssigneeType
  assigneeName: string
  assigneeDepartment?: string
  assignedBy?: ActorDTO
  status: TaskStatus
  completionPercent: number
  completedAt?: string
  createdAt?: string
}

export interface TaskDTO {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  effectiveStatus: TaskStatus
  overdue: boolean
  category?: TaskCategory
  department?: string
  project?: string
  visibility: TaskVisibility
  startDate?: string
  dueDate?: string
  estimatedHours: number
  actualHours: number
  completionPercent: number
  createdBy?: ActorDTO
  assignedBy?: ActorDTO
  approvedBy?: ActorDTO
  approvedAt?: string
  archived: boolean
  closedAt?: string
  createdAt?: string
  updatedAt?: string
  assignees?: AssignmentDTO[]
  checklistTotal?: number
  checklistDone?: number
}

export interface DailyPlanDTO {
  id: string
  taskId: string
  dayNumber: number
  title: string
  description: string
  dueDate?: string
  order: number
}

export interface ChecklistDTO {
  id: string
  taskId: string
  dailyPlanId?: string
  title: string
  description: string
  assignedToId?: string
  assignedToName?: string
  completed: boolean
  completionPercent: number
  completedAt?: string
  completedBy?: ActorDTO
  remarks?: string
  proofFileId?: string
  proofFileName?: string
  proofUrl?: string
  order: number
}

export interface AttachmentDTO {
  id: string
  taskId: string
  title?: string
  description?: string
  fileId: string
  fileName: string
  contentType?: string
  size?: number
  url: string
  uploadedBy?: ActorDTO
  createdAt?: string
}

export interface CommentFileDTO {
  id: string
  fileId: string
  fileName: string
  contentType?: string
  url: string
}

export interface CommentDTO {
  id: string
  taskId: string
  parentId?: string
  author?: ActorDTO
  body: string
  mentions: { id: string; name: string }[]
  edited: boolean
  deleted: boolean
  files: CommentFileDTO[]
  createdAt?: string
  updatedAt?: string
}

export interface HistoryDTO {
  id: string
  taskId: string
  action: TaskHistoryAction
  actor?: ActorDTO
  message: string
  meta?: Record<string, unknown>
  createdAt?: string
}

export interface NotificationDTO {
  id: string
  type: NotificationType
  title: string
  body?: string
  taskId?: string
  link?: string
  read: boolean
  readAt?: string
  createdAt?: string
}

export interface TaskDetailResponse {
  task: TaskDTO
  assignments: AssignmentDTO[]
  dailyPlans: DailyPlanDTO[]
  checklists: ChecklistDTO[]
  attachments: AttachmentDTO[]
  comments: CommentDTO[]
  history: HistoryDTO[]
}

export interface TaskListResponse {
  tasks: TaskDTO[]
  total: number
  page: number
  limit: number
  pages: number
}
