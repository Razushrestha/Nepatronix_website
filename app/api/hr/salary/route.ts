import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday } from '@/lib/hr/models'
import { employeeMonthlyWorkload } from '@/lib/hr/attendance-utils'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const emp = await HrEmployee.findById(session.id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthLabel = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const records = await HrAttendance.find({
    employeeId: emp._id,
    date: { $regex: `^${monthPrefix}` },
  }).lean()

  const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
  const holidaySet = new Set(holidays.map((h) => h.date))
  const workload = employeeMonthlyWorkload(emp, holidaySet, now)

  const lateDeduction = records.reduce((s, r) => s + (r.lateDeduction || 0), 0)
  const lateMinutes = records.reduce((s, r) => s + (r.lateMinutes || 0), 0)
  const presentDays = records.filter((r) => r.status === 'present').length
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
  })
}
