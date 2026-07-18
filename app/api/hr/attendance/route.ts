import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession, requireHrAdmin } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday, getOfficeSettings } from '@/lib/hr/models'
import { dateKey, filterCountableRecords, resolveDayAttendanceStatus, toEmployeeSchedule, buildLateCalcContext, resolveAttendanceLate } from '@/lib/hr/attendance-utils'
import { getEffectiveAttendanceStartDate, formatAttendanceStartLabel } from '@/lib/hr/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const employeeId = searchParams.get('employeeId')

  const targetId = employeeId && (session.role === 'hr_staff' || session.role === 'super_hr_admin')
    ? employeeId
    : session.id

  const emp = await HrEmployee.findById(targetId).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const settings = await getOfficeSettings()
  const attendanceStartDate = getEffectiveAttendanceStartDate(settings)

  const schedule = toEmployeeSchedule(emp)

  const now = new Date()
  const [y, m] = month
    ? month.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1]
  const prefix = `${y}-${String(m).padStart(2, '0')}`

  const records = await HrAttendance.find({
    employeeId: emp._id,
    date: { $regex: `^${prefix}` },
  })
    .sort({ date: 1 })
    .lean()

  const holidays = await HrHoliday.find({ date: { $regex: `^${prefix}` } }).lean()
  const holidaySet = new Set(holidays.map((h) => h.date))
  const refDate = new Date(y, m - 1, 15)
  const lateCtx = buildLateCalcContext(emp, settings, holidaySet, refDate, attendanceStartDate)

  const enrichedRecords = records.map((r) => {
    const late = resolveAttendanceLate(r, lateCtx)
    return {
      ...r,
      lateMinutes: late.lateMinutes,
      lateDeduction: late.lateDeduction,
    }
  })

  const today = dateKey(now)
  let todayRecord = enrichedRecords.find((r) => r.date === today)
  if (!todayRecord && prefix === today.slice(0, 7)) {
    const d = now
    if (today < attendanceStartDate) {
      todayRecord = {
        date: today,
        status: 'not_started',
        lateMinutes: 0,
        lateDeduction: 0,
        scheduledStart: emp.scheduledStart,
        scheduledEnd: emp.scheduledEnd,
      } as (typeof records)[0]
    } else {
      todayRecord = {
        date: today,
        status: resolveDayAttendanceStatus(d, schedule, holidaySet),
        lateMinutes: 0,
        lateDeduction: 0,
        scheduledStart: emp.scheduledStart,
        scheduledEnd: emp.scheduledEnd,
      } as (typeof records)[0]
    }
  }

  const countable = filterCountableRecords(enrichedRecords, attendanceStartDate)
  const summary = {
    present: countable.filter((r) => r.status === 'present' || r.status === 'half_day').length,
    lateMinutes: countable.reduce((s, r) => s + (r.lateMinutes || 0), 0),
    lateDeduction: countable.reduce((s, r) => s + (r.lateDeduction || 0), 0),
    absent: countable.filter((r) => r.status === 'absent').length,
  }

  return NextResponse.json({
    employee: { id: String(emp._id), fullName: emp.fullName, employeeCode: emp.employeeCode },
    month: prefix,
    today: todayRecord || null,
    records: enrichedRecords,
    summary,
    attendanceStartDate,
    attendanceStartLabel: formatAttendanceStartLabel(attendanceStartDate),
    trackingActive: today >= attendanceStartDate,
  })
}
