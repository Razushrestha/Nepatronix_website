import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee, HrHoliday, HrLeaveRequest, HrTask, getOfficeSettings } from '@/lib/hr/models'
import { dateKey, filterCountableRecords, isCountableAttendanceDate, buildLateCalcContext, resolveAttendanceLate } from '@/lib/hr/attendance-utils'
import { getEffectiveAttendanceStartDate } from '@/lib/hr/service'

export const runtime = 'nodejs'

function parseMonth(month: string | null) {
  const now = new Date()
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number)
    return {
      refDate: new Date(y, m - 1, 15),
      monthPrefix: month,
      isCurrentMonth: y === now.getFullYear() && m - 1 === now.getMonth(),
    }
  }
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return { refDate: now, monthPrefix, isCurrentMonth: true }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const { refDate, monthPrefix, isCurrentMonth } = parseMonth(searchParams.get('month'))
    const today = isCurrentMonth ? dateKey(new Date()) : null

    const activeEmployees = await HrEmployee.find({ active: true, status: 'active' }).lean()
    const grossPayroll = activeEmployees.reduce((s, e) => s + (e.monthlyPay || 0), 0)
    const empIds = activeEmployees.map((e) => e._id)

    const [
      totalEmployees,
      activeCount,
      pendingLeave,
      presentToday,
      absentToday,
      onLeaveToday,
      deptAgg,
      officeSettings,
      recentLeave,
      recentEmployees,
      monthRecords,
      openTasks,
    ] = await Promise.all([
      HrEmployee.countDocuments({}),
      HrEmployee.countDocuments({ active: true, status: 'active' }),
      HrLeaveRequest.countDocuments({ status: { $in: ['pending_manager', 'pending_hr'] } }),
      isCurrentMonth && today
        ? HrAttendance.countDocuments({ date: today, status: 'present' })
        : Promise.resolve(0),
      isCurrentMonth && today
        ? HrAttendance.countDocuments({ date: today, status: 'absent' })
        : Promise.resolve(0),
      isCurrentMonth && today
        ? HrAttendance.countDocuments({ date: today, status: 'leave' })
        : Promise.resolve(0),
      HrEmployee.aggregate([
        { $match: { active: true, status: 'active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      getOfficeSettings(),
      HrLeaveRequest.find({}).sort({ createdAt: -1 }).limit(6).lean(),
      HrEmployee.find({ active: true, status: 'active' })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('fullName employeeCode department position createdAt')
        .lean(),
      HrAttendance.find({
        employeeId: { $in: empIds },
        date: { $regex: `^${monthPrefix}` },
      }).lean(),
      HrTask.countDocuments({ status: { $in: ['pending', 'in_progress'] } }),
    ])

    const attendanceStartDate = getEffectiveAttendanceStartDate(officeSettings)

    const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
    const holidaySet = new Set(holidays.map((h) => h.date))
    const lateCtxByEmp = new Map(
      activeEmployees.map((e) => [
        String(e._id),
        buildLateCalcContext(e, officeSettings, holidaySet, refDate, attendanceStartDate),
      ])
    )

    const monthPresent = monthRecords.filter(
      (r) =>
        (r.status === 'present' || r.status === 'half_day') &&
        isCountableAttendanceDate(r.date, attendanceStartDate)
    ).length
    const countableMonth = filterCountableRecords(monthRecords, attendanceStartDate).map((r) => {
      const lateCtx = lateCtxByEmp.get(String(r.employeeId))
      if (!lateCtx) return r
      return { ...r, ...resolveAttendanceLate(r, lateCtx) }
    })
    const monthLateDeduction = countableMonth.reduce((s, r) => s + (r.lateDeduction || 0), 0)
    const monthLateMinutes = countableMonth.reduce((s, r) => s + (r.lateMinutes || 0), 0)
    const netPayroll = Math.max(0, grossPayroll - monthLateDeduction)

    const leaveEmpIds = [...new Set(recentLeave.map((r) => String(r.employeeId)))]
    const leaveEmps = await HrEmployee.find({ _id: { $in: leaveEmpIds } })
      .select('fullName employeeCode')
      .lean()
    const empMap = Object.fromEntries(leaveEmps.map((e) => [String(e._id), e]))

    const now = new Date()
    const payrollHistory: {
      monthKey: string
      shortLabel: string
      grossPay: number
      deductions: number
      netPay: number
      presentDays: number
    }[] = []

    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const startKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`

    const payrollAgg = empIds.length
      ? await HrAttendance.aggregate([
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
      : []

    const payrollByMonth = Object.fromEntries(
      payrollAgg.map((r) => [r._id as string, r as { deductions: number; presentDays: number }])
    )

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const stats = payrollByMonth[key] || { deductions: 0, presentDays: 0 }
      payrollHistory.push({
        monthKey: key,
        shortLabel: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        grossPay: grossPayroll,
        deductions: stats.deductions,
        netPay: Math.max(0, grossPayroll - stats.deductions),
        presentDays: stats.presentDays,
      })
    }

    return NextResponse.json({
      month: refDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      monthKey: monthPrefix,
      isCurrentMonth,
      today,
      kpis: {
        totalEmployees,
        activeEmployees: activeCount,
        pendingLeave,
        presentToday: isCurrentMonth ? presentToday : null,
        absentToday: isCurrentMonth ? absentToday : null,
        onLeaveToday: isCurrentMonth ? onLeaveToday : null,
        monthPresent,
        monthLateDeduction,
        monthLateMinutes,
        grossPayroll,
        netPayroll,
        openTasks,
      },
      payrollHistory,
      departments: deptAgg.map((d) => ({ department: d._id || 'unknown', count: d.count })),
      office: {
        name: officeSettings.officeName,
        startTime: officeSettings.startTime,
        endTime: officeSettings.endTime,
        graceMinutes: officeSettings.graceMinutes,
        attendanceStartDate,
      },
      recentLeave: recentLeave.map((r) => ({
        id: String(r._id),
        leaveType: r.leaveType,
        status: r.status,
        fromDate: r.fromDate,
        toDate: r.toDate,
        createdAt: r.createdAt,
        employee: empMap[String(r.employeeId)],
      })),
      recentEmployees: recentEmployees.map((e) => ({
        id: String(e._id),
        fullName: e.fullName,
        employeeCode: e.employeeCode,
        department: e.department,
        position: e.position,
        createdAt: e.createdAt,
      })),
    })
  } catch (err) {
    console.error('[hr/stats]', err)
    return NextResponse.json({ error: 'Failed to load HR stats' }, { status: 500 })
  }
}
