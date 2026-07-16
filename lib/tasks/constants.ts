import type { HrRole } from '@/lib/hr/constants'

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: '#16a34a' },
  { value: 'medium', label: 'Medium', color: '#ca8a04' },
  { value: 'high', label: 'High', color: '#ea580c' },
  { value: 'critical', label: 'Critical', color: '#dc2626' },
] as const

export type TaskPriority = (typeof TASK_PRIORITIES)[number]['value']

export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#64748b' },
  { value: 'in_progress', label: 'In Progress', color: '#2563eb' },
  { value: 'review', label: 'Review', color: '#7c3aed' },
  { value: 'completed', label: 'Completed', color: '#16a34a' },
  { value: 'cancelled', label: 'Cancelled', color: '#94a3b8' },
  { value: 'overdue', label: 'Overdue', color: '#dc2626' },
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]['value']

/** Statuses an assignee/board can move a task through (excludes derived "overdue"). */
export const ASSIGNABLE_STATUSES: TaskStatus[] = [
  'pending',
  'in_progress',
  'review',
  'completed',
  'cancelled',
]

export const TASK_VISIBILITIES = [
  { value: 'private', label: 'Private' },
  { value: 'team', label: 'Team' },
  { value: 'company', label: 'Company' },
] as const

export type TaskVisibility = (typeof TASK_VISIBILITIES)[number]['value']

export const TASK_CATEGORIES = [
  'development',
  'design',
  'marketing',
  'research',
  'operations',
  'support',
  'documentation',
  'meeting',
  'other',
] as const

export type TaskCategory = (typeof TASK_CATEGORIES)[number]

export type AssigneeType = 'employee' | 'freelancer'

export const TASK_HISTORY_ACTIONS = [
  'task_created',
  'task_updated',
  'task_assigned',
  'task_unassigned',
  'assignee_status_changed',
  'daily_plan_added',
  'daily_plan_updated',
  'daily_plan_removed',
  'checklist_added',
  'checklist_updated',
  'checklist_completed',
  'checklist_reopened',
  'checklist_removed',
  'attachment_uploaded',
  'attachment_removed',
  'comment_added',
  'comment_edited',
  'comment_deleted',
  'status_changed',
  'task_approved',
  'task_archived',
  'task_restored',
  'task_closed',
  'task_deleted',
] as const

export type TaskHistoryAction = (typeof TASK_HISTORY_ACTIONS)[number]

export const NOTIFICATION_TYPES = [
  'task_assigned',
  'task_updated',
  'comment_added',
  'comment_mention',
  'checklist_assigned',
  'checklist_completed',
  'task_due_tomorrow',
  'task_overdue',
  'task_completed',
  'task_approved',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

/* ------------------------------------------------------------------ */
/* Role-based access control                                           */
/* ------------------------------------------------------------------ */

/** Full-control roles (CMS admin maps to super_hr_admin). */
export function isTaskAdmin(role: HrRole | string): boolean {
  return role === 'super_hr_admin' || role === 'hr_staff'
}

export function isCeo(role: HrRole | string): boolean {
  return role === 'ceo'
}

export function isManager(role: HrRole | string): boolean {
  return role === 'manager'
}

/** Who can create & assign tasks. */
export function canCreateTask(role: HrRole | string): boolean {
  return isTaskAdmin(role) || isCeo(role) || isManager(role)
}

/** Who can permanently delete tasks. Admin only. */
export function canHardDeleteTask(role: HrRole | string): boolean {
  return isTaskAdmin(role)
}

/** Who can approve / archive / restore / close any task. Admin only. */
export function canApproveTask(role: HrRole | string): boolean {
  return isTaskAdmin(role)
}

/** Who can view every task regardless of assignment. */
export function canViewAllTasks(role: HrRole | string): boolean {
  return isTaskAdmin(role) || isCeo(role)
}

export function priorityColor(p: string): string {
  return TASK_PRIORITIES.find((x) => x.value === p)?.color || '#64748b'
}

export function statusColor(s: string): string {
  return TASK_STATUSES.find((x) => x.value === s)?.color || '#64748b'
}

export function progressColor(percent: number): 'green' | 'yellow' | 'red' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'yellow'
  return 'red'
}
