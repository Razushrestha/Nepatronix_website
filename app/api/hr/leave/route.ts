import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession, requireHrManager, requireHrAdmin } from '@/lib/hr/auth'
import { HrEmployee, HrLeaveBalance, HrLeaveRequest } from '@/lib/hr/models'
import { countLeaveDays } from '@/lib/hr/service'
import type { LeaveType } from '@/lib/hr/constants'
import { isHrAdminRole, isHrManagerRole } from '@/lib/hr/constants'

export const runtime = 'nodejs'

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
    filter = {}
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
