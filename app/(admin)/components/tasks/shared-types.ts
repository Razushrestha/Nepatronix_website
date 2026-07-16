export type {
  ActorDTO,
  AssignmentDTO,
  AttachmentDTO,
  ChecklistDTO,
  CommentDTO,
  CommentFileDTO,
  DailyPlanDTO,
  HistoryDTO,
  NotificationDTO,
  TaskDetailResponse,
  TaskDTO,
  TaskListResponse,
} from '@/lib/tasks/types'

export interface AssignableEmployee {
  id: string
  name: string
  type: 'employee' | 'freelancer'
  department?: string
  position?: string
  role?: string
  employeeCode?: string
}
