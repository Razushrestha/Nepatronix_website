export const HR_DEPARTMENTS = [
  { value: 'nepatronix', label: 'Nepatronix', code: 'NPT' },
  { value: 'stem-innovation-nepal', label: 'STEM Innovation Nepal', code: 'SIN' },
  { value: 'metatronix', label: 'Metatronix', code: 'MTX' },
] as const

export type HrDepartment = (typeof HR_DEPARTMENTS)[number]['value']

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full-time (Mon–Fri)' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'tutor', label: 'STEM Tutor (5 days/week)' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'project_basis', label: 'Project basis' },
  { value: 'intern', label: 'Intern' },
  { value: 'trainee', label: 'Trainee' },
] as const

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]['value']

export const HR_ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'ceo', label: 'CEO' },
  { value: 'hr_staff', label: 'HR Staff' },
  { value: 'super_hr_admin', label: 'Super HR Admin' },
] as const

export type HrRole = (typeof HR_ROLES)[number]['value']

export const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
export type Weekday = (typeof WEEKDAYS)[number]

/** Office staff: Saturday + Sunday off (~8 days/month). */
export const STANDARD_WEEKLY_OFF: Weekday[] = ['sat', 'sun']

/** STEM tutors: Saturday fixed off + one chosen weekday. */
export const TUTOR_FIXED_WEEKLY_OFF: Weekday = 'sat'
export const TUTOR_CHOICE_OFF_DAYS: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri']

/** Company public holidays per year (weekends excluded), managed in HrHoliday. */
export const ANNUAL_PUBLIC_HOLIDAY_DAYS = 8

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave', defaultDays: 18 },
  { value: 'sick', label: 'Sick Leave', defaultDays: 12 },
  { value: 'casual', label: 'Casual Leave', defaultDays: 6 },
  { value: 'unpaid', label: 'Unpaid Leave', defaultDays: 0 },
] as const

export type LeaveType = (typeof LEAVE_TYPES)[number]['value']

export const LEAVE_STATUSES = [
  'pending_manager',
  'pending_hr',
  'approved',
  'rejected',
  'cancelled',
] as const

export type LeaveStatus = (typeof LEAVE_STATUSES)[number]

/** All attendance dates/times use Nepal office local time (not server UTC). */
export const OFFICE_TIMEZONE = 'Asia/Kathmandu'

export const DEFAULT_OFFICE = {
  startTime: '10:00',
  endTime: '18:00',
  graceMinutes: 0,
  latitude: 27.6858125,
  longitude: 85.3165781,
  radiusMeters: 150,
  allowedIps: [
    '127.0.0.1',
    '::1',
    '192.168.2.*',
    '192.168.2.254',
    '2400:1a00:4b2b:*',
    '2400:1a00:4b2b:6bc9:e551:175:f19c:bc16',
  ],
}

/** Official attendance / payroll start — Shrawan 1 (17 Jul 2026). Days before this are ignored. */
export const DEFAULT_ATTENDANCE_START_DATE = '2026-07-17'

/** Departments that only need office Wi‑Fi — no GPS / geofence. */
export const GPS_EXEMPT_DEPARTMENTS: readonly HrDepartment[] = ['stem-innovation-nepal']

export function departmentRequiresGps(department: string): boolean {
  return !GPS_EXEMPT_DEPARTMENTS.includes(department as HrDepartment)
}

export function departmentLabel(slug: string): string {
  return HR_DEPARTMENTS.find((d) => d.value === slug)?.label || slug
}

export function departmentCode(slug: string): string {
  return HR_DEPARTMENTS.find((d) => d.value === slug)?.code || 'EMP'
}

export function isHrManagerRole(role: string): boolean {
  return (
    role === 'manager' ||
    role === 'ceo' ||
    role === 'hr_staff' ||
    role === 'super_hr_admin'
  )
}

export function isHrAdminRole(role: string): boolean {
  return role === 'hr_staff' || role === 'super_hr_admin'
}

export function isCeoRole(role: string): boolean {
  return role === 'ceo'
}

/** Check-in always requires office location/network rules; CEO may check out from anywhere. */
export function attendanceActionRequiresLocation(
  role: string,
  action: 'check_in' | 'check_out',
  department: string
): boolean {
  if (action === 'check_out' && isCeoRole(role)) return false
  if (!departmentRequiresGps(department)) return true // STEM etc. still need office Wi‑Fi on check-in
  return true
}

/** Employment types that use custom work-day selection (Sat/Sun always off). */
export function usesFlexibleSchedule(type: string): boolean {
  return type === 'part_time' || type === 'freelance' || type === 'project_basis'
}
