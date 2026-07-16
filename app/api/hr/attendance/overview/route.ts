import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday, getOfficeSettings } from '@/lib/hr/models'
import { dateKey, employeeMonthlyWorkload, isCountableAttendanceDate } from '@/lib/hr/attendance-utils'
import { getEffectiveAttendanceStartDate, formatAttendanceStartLabel } from '@/lib/hr/service'
import type { HrDepartment } from '@/lib/hr/constants'

export const runtime = 'nodejs'

function parseMonthParam(month: string | null): { refDate: Date; monthPrefix: string; isCurrentMonth: boolean } {
  const now = new Date()
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number)
    const refDate = new Date(y, m - 1, 15)
    const isCurrentMonth = y === now.getFullYear() && m - 1 === now.getMonth()
    return { refDate, monthPrefix: month, isCurrentMonth }
  }
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return { refDate: now, monthPrefix, isCurrentMonth: true }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildEmployeeFilter(department: string | null, q: string | null) {
  const clauses: Record<string, unknown>[] = [{ active: true }, { status: 'active' }]

  if (department) {
    clauses.push({ department })
  }

  const query = q?.trim()
  if (query) {
    const rx = escapeRegex(query)
    clauses.push({
      $or: [
        { fullName: { $regex: rx, $options: 'i' } },
        { email: { $regex: rx, $options: 'i' } },
        { employeeCode: { $regex: rx, $options: 'i' } },
        { position: { $regex: rx, $options: 'i' } },
        { phone: { $regex: rx, $options: 'i' } },
      ],
    })
  }

  return clauses.length === 2 && !department && !query ? { active: true, status: 'active' } : { $and: clauses }
}

async function buildPayrollHistory(
  employees: { monthlyPay?: number }[],
  empIds: unknown[],
  attendanceStartDate: string,
  monthsBack = 12
) {
  const now = new Date()
  const grossBase = employees.reduce((s, e) => s + (e.monthlyPay || 0), 0)

  const history: {
    monthKey: string
    monthLabel: string
    shortLabel: string
    grossPay: number
    deductions: number
    netPay: number
    presentDays: number
    employeeCount: number
  }[] = []

  if (!empIds.length) {
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      history.push({
        monthKey: key,
        monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        shortLabel: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        grossPay: 0,
        deductions: 0,
        netPay: 0,
        presentDays: 0,
        employeeCount: 0,
      })
    }
    return history
  }

  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)
  const startKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`

  const agg = await HrAttendance.aggregate([
    { $match: { employeeId: { $in: empIds }, date: { $gte: startKey } } },
    {
      $group: {
        _id: { $substr: ['$date', 0, 7] },
        deductions: {
          $sum: {
            $cond: [{ $gte: ['$date', attendanceStartDate] }, '$lateDeduction', 0],
          },
        },
        presentDays: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ['$date', attendanceStartDate] }, { $eq: ['$status', 'present'] }] },
              1,
              0,
            ],
          },
        },
      },
    },
  ])

  const byMonth = Object.fromEntries(
    agg.map((r) => [r._id as string, { deductions: r.deductions as number, presentDays: r.presentDays as number }])
  )

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const stats = byMonth[key] || { deductions: 0, presentDays: 0 }
    history.push({
      monthKey: key,
      monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      shortLabel: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      grossPay: grossBase,
      deductions: stats.deductions,
      netPay: Math.max(0, grossBase - stats.deductions),
      presentDays: stats.presentDays,
      employeeCount: employees.length,
    })
  }

  return history
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const settings = await getOfficeSettings()
    const attendanceStartDate = getEffectiveAttendanceStartDate(settings)
    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')?.trim() || null
    const q = searchParams.get('q')?.trim() || null
    const { refDate, monthPrefix, isCurrentMonth } = parseMonthParam(searchParams.get('month'))

    const [allEmployees, filteredEmployees, deptAgg] = await Promise.all([
      HrEmployee.find({ active: true, status: 'active' }).sort({ fullName: 1 }).limit(500).lean(),
      HrEmployee.find(buildEmployeeFilter(department, q)).sort({ fullName: 1 }).limit(200).lean(),
      HrEmployee.aggregate([
        { $match: { active: true, status: 'active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
    ])

    const departmentCounts = Object.fromEntries(
      deptAgg.map((d) => [d._id as string, d.count as number])
    ) as Record<HrDepartment, number>

    const employees = filteredEmployees
    const today = isCurrentMonth ? dateKey(new Date()) : null

    const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
    const holidaySet = new Set(holidays.map((h) => h.date))

    const empIds = employees.map((e) => e._id)
    const records = empIds.length
      ? await HrAttendance.find({
          employeeId: { $in: empIds },
          date: { $regex: `^${monthPrefix}` },
        }).lean()
      : []

    type Summary = {
      present: number
      absent: number
      lateMinutes: number
      lateDeduction: number
      leave: number
      todayStatus: string | null
    }

    const summaryByEmp = new Map<string, Summary>()

    for (const emp of employees) {
      summaryByEmp.set(String(emp._id), {
        present: 0,
        absent: 0,
        lateMinutes: 0,
        lateDeduction: 0,
        leave: 0,
        todayStatus: null,
      })
    }

    for (const r of records) {
      if (!isCountableAttendanceDate(r.date, attendanceStartDate)) continue
      const id = String(r.employeeId)
      const s = summaryByEmp.get(id)
      if (!s) continue
      if (r.status === 'present') s.present++
      if (r.status === 'absent') s.absent++
      if (r.status === 'leave') s.leave++
      s.lateMinutes += r.lateMinutes || 0
      s.lateDeduction += r.lateDeduction || 0
      if (today && r.date === today) s.todayStatus = r.status
    }

    if (today && today < attendanceStartDate) {
      for (const s of summaryByEmp.values()) {
        if (s.todayStatus === 'absent') s.todayStatus = 'not_started'
      }
    }

    let presentToday = 0
    let absentToday = 0
    let onLeaveToday = 0
    let monthLateDeduction = 0
    let totalGrossPayroll = 0
    let totalNetPayroll = 0

    const rows = employees.map((e) => {
      const id = String(e._id)
      const att = summaryByEmp.get(id)!
      const workload = employeeMonthlyWorkload(e, holidaySet, refDate, attendanceStartDate)
      const monthlyPay = e.monthlyPay || 0
      const finalSalary = Math.max(0, monthlyPay - att.lateDeduction)

      if (att.todayStatus === 'present') presentToday++
      else if (att.todayStatus === 'absent') absentToday++
      else if (att.todayStatus === 'leave') onLeaveToday++

      monthLateDeduction += att.lateDeduction
      totalGrossPayroll += monthlyPay
      totalNetPayroll += finalSalary

      const attendanceRate =
        workload.totalWorkingDays > 0
          ? Math.round((att.present / workload.totalWorkingDays) * 100)
          : 0

      return {
        id,
        fullName: e.fullName,
        employeeCode: e.employeeCode,
        department: e.department,
        position: e.position,
        isStipend: e.isStipend,
        monthlyPay,
        finalSalary,
        totalWorkingDays: workload.totalWorkingDays,
        totalWorkingHours: workload.totalWorkingHours,
        present: att.present,
        absent: att.absent,
        leave: att.leave,
        lateMinutes: att.lateMinutes,
        lateDeduction: att.lateDeduction,
        todayStatus: att.todayStatus,
        attendanceRate,
      }
    })

    const monthPresentTotal = rows.reduce((s, r) => s + r.present, 0)

    const [payrollHistory, filteredPayrollHistory] = await Promise.all([
      buildPayrollHistory(allEmployees, allEmployees.map((e) => e._id), attendanceStartDate),
      buildPayrollHistory(employees, empIds, attendanceStartDate),
    ])

    return NextResponse.json({
      month: refDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      monthKey: monthPrefix,
      today,
      isCurrentMonth,
      attendanceStartDate,
      attendanceStartLabel: formatAttendanceStartLabel(attendanceStartDate),
      trackingActive: today ? today >= attendanceStartDate : false,
      filters: { department, q, month: monthPrefix },
      totalEmployeesUnfiltered: allEmployees.length,
      departmentCounts,
      kpis: {
        totalEmployees: employees.length,
        presentToday: isCurrentMonth ? presentToday : null,
        absentToday: isCurrentMonth ? absentToday : null,
        onLeaveToday: isCurrentMonth ? onLeaveToday : null,
        monthPresentTotal,
        monthLateDeduction,
        totalGrossPayroll,
        totalNetPayroll,
      },
      payrollHistory,
      filteredPayrollHistory,
      employees: rows,
    })
  } catch (err) {
    console.error('[hr/attendance/overview]', err)
    return NextResponse.json({ error: 'Failed to load attendance overview' }, { status: 500 })
  }
}
