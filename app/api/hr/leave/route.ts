import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee, HrLeaveBalance, HrLeaveRequest } from '@/lib/hr/models'
import { countLeaveDays } from '@/lib/hr/service'
import type { LeaveType } from '@/lib/hr/constants'
import { isHrAdminRole, isHrManagerRole } from '@/lib/hr/constants'

export const runtime = 'nodejs'

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseMonthParam(month: string | null): { monthPrefix: string; monthLabel: string; isCurrentMonth: boolean } {
  const now = new Date()
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 1, 1)
    const isCurrentMonth = y === now.getFullYear() && m - 1 === now.getMonth()
    return {
      monthPrefix: month,
      monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      isCurrentMonth,
    }
  }
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return {
    monthPrefix,
    monthLabel: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    isCurrentMonth: true,
  }
}

function statusFilterClause(status: string | null): Record<string, unknown> | null {
  if (!status) return null
  if (status === 'pending') {
    return { status: { $in: ['pending_manager', 'pending_hr'] } }
  }
  if (['pending_manager', 'pending_hr', 'approved', 'rejected', 'cancelled'].includes(status)) {
    return { status }
  }
  return null
}

async function buildLeaveFilter(
  department: string | null,
  type: string | null,
  status: string | null,
  q: string | null,
  monthPrefix: string | null
) {
  const clauses: Record<string, unknown>[] = []

  if (department) clauses.push({ department })
  if (type && ['annual', 'sick', 'casual', 'unpaid'].includes(type)) {
    clauses.push({ leaveType: type })
  }

  const statusClause = statusFilterClause(status)
  if (statusClause) clauses.push(statusClause)

  if (monthPrefix) {
    clauses.push({ fromDate: { $regex: `^${escapeRegex(monthPrefix)}` } })
  }

  const query = q?.trim()
  if (query) {
    const rx = escapeRegex(query)
    const matchingEmpIds = await HrEmployee.find({
      $or: [
        { fullName: { $regex: rx, $options: 'i' } },
        { employeeCode: { $regex: rx, $options: 'i' } },
        { email: { $regex: rx, $options: 'i' } },
      ],
    }).distinct('_id')

    clauses.push({
      $or: [
        { employeeId: { $in: matchingEmpIds } },
        { reason: { $regex: rx, $options: 'i' } },
        { leaveType: { $regex: rx, $options: 'i' } },
      ],
    })
  }

  if (!clauses.length) return {}
  if (clauses.length === 1) return clauses[0]
  return { $and: clauses }
}

function summarizeRequests(
  rows: { status: string; leaveType: string; totalDays?: number; department?: string }[]
) {
  const byType: Record<string, number> = { annual: 0, sick: 0, casual: 0, unpaid: 0 }
  const byDept: Record<string, number> = {}
  let pending = 0
  let approved = 0
  let rejected = 0
  let cancelled = 0
  let approvedDays = 0

  for (const r of rows) {
    byType[r.leaveType] = (byType[r.leaveType] || 0) + 1
    if (r.department) byDept[r.department] = (byDept[r.department] || 0) + 1
    if (r.status === 'pending_manager' || r.status === 'pending_hr') pending++
    else if (r.status === 'approved') {
      approved++
      approvedDays += r.totalDays || 0
    } else if (r.status === 'rejected') rejected++
    else if (r.status === 'cancelled') cancelled++
  }

  return {
    total: rows.length,
    pending,
    approved,
    rejected,
    cancelled,
    approvedDays,
    byType,
    byDept,
  }
}

async function buildLeaveTimeline(monthsBack = 12) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)
  const startKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`

  const agg = await HrLeaveRequest.aggregate([
    { $match: { fromDate: { $gte: startKey } } },
    {
      $group: {
        _id: { $substr: ['$fromDate', 0, 7] },
        total: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        pending: {
          $sum: {
            $cond: [{ $in: ['$status', ['pending_manager', 'pending_hr']] }, 1, 0],
          },
        },
        approvedDays: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$totalDays', 0] },
        },
      },
    },
  ])

  const byMonth = Object.fromEntries(
    agg.map((r) => [
      r._id as string,
      {
        total: r.total as number,
        approved: r.approved as number,
        pending: r.pending as number,
        approvedDays: r.approvedDays as number,
      },
    ])
  )

  const history: {
    monthKey: string
    monthLabel: string
    shortLabel: string
    total: number
    approved: number
    pending: number
    approvedDays: number
  }[] = []

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const stats = byMonth[key] || { total: 0, approved: 0, pending: 0, approvedDays: 0 }
    history.push({
      monthKey: key,
      monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      shortLabel: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      ...stats,
    })
  }

  return history
}

export async function GET(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const scope = searchParams.get('scope')

  let filter: Record<string, unknown> = {}

  if (scope === 'team' && isHrManagerRole(session.role)) {
    const teamIds = await HrEmployee.find({ managerId: session.id }).distinct('_id')
    filter = { employeeId: { $in: teamIds } }
  } else if (scope === 'hr-queue' && isHrAdminRole(session.role)) {
    filter = { status: 'pending_hr' }
  } else if (scope === 'manager-queue' && isHrManagerRole(session.role)) {
    const teamIds = await HrEmployee.find({ managerId: session.id }).distinct('_id')
    filter = { employeeId: { $in: teamIds }, status: 'pending_manager' }
  } else if (scope === 'all' && isHrAdminRole(session.role)) {
    const department = searchParams.get('department')?.trim() || null
    const type = searchParams.get('type')?.trim() || null
    const status = searchParams.get('status')?.trim() || null
    const q = searchParams.get('q')?.trim() || null
    const { monthPrefix, monthLabel, isCurrentMonth } = parseMonthParam(searchParams.get('month'))

    const useMonthFilter = searchParams.has('month')
    filter = await buildLeaveFilter(
      department,
      type,
      status,
      q,
      useMonthFilter ? monthPrefix : null
    )

    const [requests, allForSummary, deptAgg, leaveTimeline] = await Promise.all([
      HrLeaveRequest.find(filter).sort({ createdAt: -1 }).limit(500).lean(),
      HrLeaveRequest.find({}).select('status leaveType totalDays department fromDate').lean(),
      HrLeaveRequest.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
      buildLeaveTimeline(12),
    ])

    const empIds = [...new Set(requests.map((r) => String(r.employeeId)))]
    const employees = await HrEmployee.find({ _id: { $in: empIds } })
      .select('fullName employeeCode department')
      .lean()
    const empMap = Object.fromEntries(employees.map((e) => [String(e._id), e]))

    const departmentCounts = Object.fromEntries(
      deptAgg.map((d) => [d._id as string, d.count as number])
    )

    const summary = summarizeRequests(allForSummary)
    const filteredSummary = summarizeRequests(requests)
    const monthStats = leaveTimeline.find((m) => m.monthKey === monthPrefix)

    return NextResponse.json({
      requests: requests.map((r) => ({
        ...r,
        id: String(r._id),
        employee: empMap[String(r.employeeId)],
      })),
      filters: {
        department,
        type,
        status,
        q,
        month: useMonthFilter ? monthPrefix : null,
      },
      month: monthLabel,
      monthKey: monthPrefix,
      isCurrentMonth,
      totalUnfiltered: allForSummary.length,
      departmentCounts,
      summary,
      filteredSummary,
      monthStats,
      leaveTimeline,
    })
  } else if (scope === 'all') {
    return NextResponse.json({ error: 'HR admin only' }, { status: 403 })
  } else {
    filter = { employeeId: session.id }
  }

  const requests = await HrLeaveRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean()
  const empIds = [...new Set(requests.map((r) => String(r.employeeId)))]
  const employees = await HrEmployee.find({ _id: { $in: empIds } })
    .select('fullName employeeCode department')
    .lean()
  const empMap = Object.fromEntries(employees.map((e) => [String(e._id), e]))

  const year = new Date().getFullYear()
  const balance = await HrLeaveBalance.findOne({ employeeId: session.id, year }).lean()

  return NextResponse.json({
    requests: requests.map((r) => ({
      ...r,
      id: String(r._id),
      employee: empMap[String(r.employeeId)],
    })),
    balance,
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()
    const leaveType = String(body.leaveType || '') as LeaveType
    const fromDate = String(body.fromDate || '')
    const toDate = String(body.toDate || body.fromDate || '')
    const reason = String(body.reason || '').trim()
    const halfDay = body.halfDay as 'am' | 'pm' | undefined

    if (!leaveType || !fromDate || !reason) {
      return NextResponse.json({ error: 'Leave type, dates, and reason are required' }, { status: 400 })
    }

    const emp = await HrEmployee.findById(session.id).lean()
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    if (!emp.managerId && emp.role === 'employee') {
      return NextResponse.json({ error: 'No manager assigned — contact HR' }, { status: 400 })
    }

    const totalDays = countLeaveDays(fromDate, toDate, halfDay)
    const year = new Date(fromDate).getFullYear() || new Date().getFullYear()

    if (leaveType !== 'unpaid' && emp.paidLeaveEligible) {
      const bal = await HrLeaveBalance.findOne({ employeeId: emp._id, year })
      if (bal) {
        const remaining =
          leaveType === 'annual'
            ? bal.annual - bal.annualUsed
            : leaveType === 'sick'
            ? bal.sick - bal.sickUsed
            : leaveType === 'casual'
            ? bal.casual - bal.casualUsed
            : 999
        if (remaining < totalDays) {
          return NextResponse.json({ error: `Insufficient ${leaveType} leave balance` }, { status: 400 })
        }
      }
    }

    const created = await HrLeaveRequest.create({
      employeeId: emp._id,
      department: emp.department,
      leaveType,
      fromDate,
      toDate,
      halfDay,
      reason,
      status: 'pending_manager',
      totalDays,
    })

    return NextResponse.json({ success: true, id: String(created._id) })
  } catch (err) {
    console.error('[hr/leave POST]', err)
    return NextResponse.json({ error: 'Failed to submit leave' }, { status: 500 })
  }
}
