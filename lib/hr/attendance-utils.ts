import type { EmploymentType, Weekday } from './constants'

const DAY_INDEX: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
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
  const keys: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return keys[date.getDay()]
}

export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isScheduledWorkday(
  date: Date,
  employmentType: EmploymentType,
  scheduledDays: Weekday[]
): boolean {
  if (isWeekend(date)) return false
  if (employmentType === 'full_time' || employmentType === 'intern' || employmentType === 'trainee') {
    const wd = date.getDay()
    return wd >= 1 && wd <= 5
  }
  return scheduledDays.includes(weekdayKey(date))
}

export function countWorkingDaysInMonth(
  year: number,
  month: number,
  employmentType: EmploymentType,
  scheduledDays: Weekday[],
  holidayDates: Set<string>
): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let count = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const key = dateKey(date)
    if (holidayDates.has(key)) continue
    if (isScheduledWorkday(date, employmentType, scheduledDays)) count++
  }
  return count
}

export function calcLateMinutes(checkIn: Date, scheduledStart: string, graceMinutes = 0): number {
  const startMins = parseTimeToMinutes(scheduledStart) + graceMinutes
  const checkMins = checkIn.getHours() * 60 + checkIn.getMinutes()
  return Math.max(0, checkMins - startMins)
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
  if (employmentType === 'part_time') return scheduledHoursPerDay || 4
  return 8
}

export function defaultScheduledDays(employmentType: EmploymentType): Weekday[] {
  if (employmentType === 'part_time') return ['mon', 'wed', 'fri']
  return ['mon', 'tue', 'wed', 'thu', 'fri']
}
