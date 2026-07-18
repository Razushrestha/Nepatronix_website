import type { EmploymentType, Weekday } from './constants'
import {
  OFFICE_TIMEZONE,
  STANDARD_WEEKLY_OFF,
  TUTOR_CHOICE_OFF_DAYS,
  TUTOR_FIXED_WEEKLY_OFF,
} from './constants'

const DAY_INDEX: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

export type EmployeeSchedule = {
  employmentType: EmploymentType
  scheduledDays?: Weekday[]
  weeklyOffDay?: Weekday | null
}

export function toEmployeeSchedule(emp: {
  employmentType: EmploymentType
  scheduledDays?: Weekday[] | string[]
  weeklyOffDay?: Weekday | string | null
}): EmployeeSchedule {
  return {
    employmentType: emp.employmentType,
    scheduledDays: emp.scheduledDays as Weekday[] | undefined,
    weeklyOffDay: (emp.weeklyOffDay as Weekday | undefined) || undefined,
  }
}

export function officeLocalParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: OFFICE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value || 0)
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hours: get('hour'),
    minutes: get('minute'),
    seconds: get('second'),
  }
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function isWeekend(date: Date): boolean {
  const d = date.getDay()
  return d === 0 || d === 6
}

export function weekdayKey(date: Date): Weekday {
  const short = new Intl.DateTimeFormat('en-US', {
    timeZone: OFFICE_TIMEZONE,
    weekday: 'short',
  })
    .format(date)
    .slice(0, 3)
    .toLowerCase()
  const map: Record<string, Weekday> = {
    sun: 'sun',
    mon: 'mon',
    tue: 'tue',
    wed: 'wed',
    thu: 'thu',
    fri: 'fri',
    sat: 'sat',
  }
  return map[short] || 'mon'
}

export function dateKey(date: Date): string {
  const p = officeLocalParts(date)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** Scheduled weekly off (Sat+Sun for office; Sat + chosen day for STEM tutors). */
export function isEmployeeWeeklyOff(date: Date, schedule: EmployeeSchedule): boolean {
  const wd = weekdayKey(date)
  if (schedule.employmentType === 'tutor') {
    if (wd === TUTOR_FIXED_WEEKLY_OFF) return true
    if (schedule.weeklyOffDay && wd === schedule.weeklyOffDay) return true
    return false
  }
  return STANDARD_WEEKLY_OFF.includes(wd)
}

export function isScheduledWorkday(date: Date, schedule: EmployeeSchedule): boolean {
  if (isEmployeeWeeklyOff(date, schedule)) return false

  if (schedule.employmentType === 'tutor') {
    return TUTOR_CHOICE_OFF_DAYS.includes(weekdayKey(date))
  }

  if (
    schedule.employmentType === 'full_time' ||
    schedule.employmentType === 'intern' ||
    schedule.employmentType === 'trainee'
  ) {
    const wd = weekdayKey(date)
    return wd === 'mon' || wd === 'tue' || wd === 'wed' || wd === 'thu' || wd === 'fri'
  }

  const days = schedule.scheduledDays?.length
    ? schedule.scheduledDays
    : defaultScheduledDays(schedule.employmentType)
  return days.includes(weekdayKey(date))
}

export function countWorkingDaysInMonth(
  year: number,
  month: number,
  schedule: EmployeeSchedule,
  holidayDates: Set<string>,
  fromDateKey?: string | null
): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let count = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const key = dateKey(date)
    if (fromDateKey && key < fromDateKey) continue
    if (holidayDates.has(key)) continue
    if (isScheduledWorkday(date, schedule)) count++
  }
  return count
}

/** Working days in a month that count for attendance/payroll (respects official start date). */
export function workingDaysFromStartInMonth(
  year: number,
  month: number,
  schedule: EmployeeSchedule,
  holidayDates: Set<string>,
  attendanceStartDate: string
): number {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const startMonth = attendanceStartDate.slice(0, 7)
  if (monthPrefix < startMonth) return 0
  const fromKey = monthPrefix === startMonth ? attendanceStartDate : undefined
  return countWorkingDaysInMonth(year, month, schedule, holidayDates, fromKey)
}

/** Only dates on or after the official start date affect salary / deductions. */
export function isCountableAttendanceDate(date: string, startDate: string): boolean {
  return !startDate || date >= startDate
}

export function filterCountableRecords<T extends { date: string }>(records: T[], startDate: string): T[] {
  return records.filter((r) => isCountableAttendanceDate(r.date, startDate))
}

export function calcLateMinutes(checkIn: Date, scheduledStart: string, graceMinutes = 0): number {
  const startMins = parseTimeToMinutes(scheduledStart) + graceMinutes
  const { hours, minutes } = officeLocalParts(checkIn)
  const checkMins = hours * 60 + minutes
  return Math.max(0, checkMins - startMins)
}

export type LateCalcContext = {
  officeStart: string
  graceMinutes: number
  monthlyPay: number
  workingDays: number
  hoursPerDay: number
}

/** Recompute late fields from check-in time (fixes records saved under UTC server time). */
export function resolveAttendanceLate(
  record: {
    checkIn?: Date | string | null
    lateMinutes?: number
    lateDeduction?: number
    scheduledStart?: string | null
    status?: string
  },
  ctx: LateCalcContext
): { lateMinutes: number; lateDeduction: number } {
  if (!record.checkIn) {
    return { lateMinutes: record.lateMinutes || 0, lateDeduction: record.lateDeduction || 0 }
  }
  if (record.status && !['present', 'half_day'].includes(record.status)) {
    return { lateMinutes: 0, lateDeduction: 0 }
  }

  const checkIn = typeof record.checkIn === 'string' ? new Date(record.checkIn) : record.checkIn
  if (Number.isNaN(checkIn.getTime())) {
    return { lateMinutes: record.lateMinutes || 0, lateDeduction: record.lateDeduction || 0 }
  }

  const lateMinutes = calcLateMinutes(
    checkIn,
    record.scheduledStart || ctx.officeStart,
    ctx.graceMinutes
  )
  const lateDeduction = calcLateDeduction(
    lateMinutes,
    ctx.monthlyPay,
    ctx.workingDays,
    ctx.hoursPerDay
  )
  return { lateMinutes, lateDeduction }
}

export function buildLateCalcContext(
  emp: {
    scheduledStart?: string
    monthlyPay?: number
    employmentType: EmploymentType
    scheduledHoursPerDay?: number
    scheduledDays?: Weekday[] | string[]
    weeklyOffDay?: Weekday | string | null
  },
  settings: { startTime?: string; graceMinutes?: number },
  holidaySet: Set<string>,
  refDate: Date,
  attendanceStartDate: string
): LateCalcContext {
  const workload = employeeMonthlyWorkload(emp, holidaySet, refDate, attendanceStartDate)
  return {
    officeStart: emp.scheduledStart || settings.startTime || '10:00',
    graceMinutes: settings.graceMinutes || 0,
    monthlyPay: emp.monthlyPay || 0,
    workingDays: workload.totalWorkingDays,
    hoursPerDay: workload.hoursPerDay,
  }
}

export function calcLateDeduction(
  lateMinutes: number,
  monthlyPay: number,
  workingDays: number,
  hoursPerDay: number
): number {
  if (lateMinutes <= 0 || workingDays <= 0 || hoursPerDay <= 0) return 0
  const hourlyRate = monthlyPay / (workingDays * hoursPerDay)
  return Math.round((lateMinutes / 60) * hourlyRate * 100) / 100
}

export function scheduledHoursForType(
  employmentType: EmploymentType,
  scheduledHoursPerDay: number
): number {
  if (
    employmentType === 'part_time' ||
    employmentType === 'tutor' ||
    employmentType === 'freelance' ||
    employmentType === 'project_basis'
  ) {
    return scheduledHoursPerDay || 4
  }
  return 8
}

export function defaultScheduledDays(employmentType: EmploymentType): Weekday[] {
  if (employmentType === 'part_time') return ['mon', 'wed', 'fri']
  if (employmentType === 'freelance') return ['mon', 'tue', 'wed', 'thu', 'fri']
  if (employmentType === 'project_basis') return ['mon', 'tue', 'wed', 'thu', 'fri']
  if (employmentType === 'tutor') {
    return ['sun', 'mon', 'tue', 'wed', 'thu']
  }
  return ['mon', 'tue', 'wed', 'thu', 'fri']
}

export function tutorScheduledDays(weeklyOffDay: Weekday): Weekday[] {
  return TUTOR_CHOICE_OFF_DAYS.filter((d) => d !== weeklyOffDay)
}

export function hoursPerDayFromSchedule(
  scheduledStart?: string,
  scheduledEnd?: string,
  scheduledHoursPerDay?: number
): number {
  if (scheduledHoursPerDay && scheduledHoursPerDay > 0) return scheduledHoursPerDay
  if (scheduledStart && scheduledEnd) {
    const mins = parseTimeToMinutes(scheduledEnd) - parseTimeToMinutes(scheduledStart)
    if (mins > 0) return mins / 60
  }
  return 8
}

export function employeeMonthlyWorkload(
  emp: {
    employmentType: EmploymentType
    scheduledDays?: Weekday[]
    weeklyOffDay?: Weekday | null
    scheduledStart?: string
    scheduledEnd?: string
    scheduledHoursPerDay?: number
  },
  holidayDates: Set<string>,
  refDate = new Date(),
  attendanceStartDate?: string
): { totalWorkingDays: number; totalWorkingHours: number; hoursPerDay: number } {
  const schedule = toEmployeeSchedule(emp)
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const totalWorkingDays = attendanceStartDate
    ? workingDaysFromStartInMonth(year, month, schedule, holidayDates, attendanceStartDate)
    : countWorkingDaysInMonth(year, month, schedule, holidayDates)
  const hoursPerDay = hoursPerDayFromSchedule(emp.scheduledStart, emp.scheduledEnd, emp.scheduledHoursPerDay)
  return {
    totalWorkingDays,
    totalWorkingHours: Math.round(totalWorkingDays * hoursPerDay * 10) / 10,
    hoursPerDay,
  }
}

export function resolveDayAttendanceStatus(
  date: Date,
  schedule: EmployeeSchedule,
  holidayDates: Set<string>
): 'weekly_off' | 'holiday' | 'absent' {
  if (holidayDates.has(dateKey(date))) return 'holiday'
  if (isEmployeeWeeklyOff(date, schedule) || !isScheduledWorkday(date, schedule)) return 'weekly_off'
  return 'absent'
}
