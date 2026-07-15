import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession, requireHrAdmin } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday } from '@/lib/hr/models'
import { dateKey, isScheduledWorkday, isWeekend } from '@/lib/hr/attendance-utils'
import type { Weekday } from '@/lib/hr/constants'

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

  const today = dateKey(now)
  let todayRecord = records.find((r) => r.date === today)
  if (!todayRecord && prefix === today.slice(0, 7)) {
    const d = now
    let status: 'weekly_off' | 'holiday' | 'absent' = 'absent'
    if (isWeekend(d)) status = 'weekly_off'
    else if (holidaySet.has(today)) status = 'holiday'
    else if (!isScheduledWorkday(d, emp.employmentType, emp.scheduledDays as Weekday[])) {
      status = 'weekly_off'
    }
    todayRecord = {
      date: today,
      status,
      lateMinutes: 0,
      lateDeduction: 0,
      scheduledStart: emp.scheduledStart,
      scheduledEnd: emp.scheduledEnd,
    } as (typeof records)[0]
  }

  const summary = {
    present: records.filter((r) => r.status === 'present').length,
    lateMinutes: records.reduce((s, r) => s + (r.lateMinutes || 0), 0),
    lateDeduction: records.reduce((s, r) => s + (r.lateDeduction || 0), 0),
    absent: records.filter((r) => r.status === 'absent').length,
  }

  return NextResponse.json({
    employee: { id: String(emp._id), fullName: emp.fullName, employeeCode: emp.employeeCode },
    month: prefix,
    today: todayRecord || null,
    records,
    summary,
  })
}
