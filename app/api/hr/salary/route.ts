import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday, getOfficeSettings } from '@/lib/hr/models'
import { employeeMonthlyWorkload, filterCountableRecords, dateKey, buildLateCalcContext, resolveAttendanceLate } from '@/lib/hr/attendance-utils'
import { getEffectiveAttendanceStartDate, formatAttendanceStartLabel } from '@/lib/hr/service'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const emp = await HrEmployee.findById(session.id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const settings = await getOfficeSettings()
  const attendanceStartDate = getEffectiveAttendanceStartDate(settings)

  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthLabel = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'Asia/Kathmandu' })
  const todayKey = dateKey(now)

  const records = await HrAttendance.find({
    employeeId: emp._id,
    date: { $regex: `^${monthPrefix}` },
  }).lean()

  const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
  const holidaySet = new Set(holidays.map((h) => h.date))
  const workload = employeeMonthlyWorkload(emp, holidaySet, now, attendanceStartDate)
  const lateCtx = buildLateCalcContext(emp, settings, holidaySet, now, attendanceStartDate)

  const countable = filterCountableRecords(records, attendanceStartDate).map((r) => {
    const late = resolveAttendanceLate(r, lateCtx)
    return { ...r, ...late }
  })
  const lateDeduction = countable.reduce((s, r) => s + (r.lateDeduction || 0), 0)
  const lateMinutes = countable.reduce((s, r) => s + (r.lateMinutes || 0), 0)
  const presentDays = countable.filter((r) => r.status === 'present' || r.status === 'half_day').length
  const monthlyPay = emp.monthlyPay || 0
  const estimatedNet = Math.max(0, monthlyPay - lateDeduction)

  return NextResponse.json({
    month: monthLabel,
    monthKey: monthPrefix,
    monthlyPay,
    isStipend: emp.isStipend,
    lateDeduction,
    lateMinutes,
    presentDays,
    estimatedNet,
    scheduledStart: emp.scheduledStart,
    scheduledEnd: emp.scheduledEnd,
    scheduledHoursPerDay: emp.scheduledHoursPerDay,
    totalWorkingDays: workload.totalWorkingDays,
    totalWorkingHours: workload.totalWorkingHours,
    bankName: emp.bankName,
    bankAccount: emp.bankAccount,
    attendanceStartDate,
    attendanceStartLabel: formatAttendanceStartLabel(attendanceStartDate),
    trackingActive: todayKey >= attendanceStartDate,
  })
}
