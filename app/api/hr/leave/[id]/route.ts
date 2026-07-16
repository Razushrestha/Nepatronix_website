import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee, HrLeaveBalance, HrLeaveRequest } from '@/lib/hr/models'
import { isHrAdminRole } from '@/lib/hr/constants'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const action = String(body.action || '')

    await connectToDatabase()
    const leave = await HrLeaveRequest.findById(id)
    if (!leave) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const emp = await HrEmployee.findById(leave.employeeId).lean()
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })

    const comment = String(body.comment || '').trim()

    if (action === 'manager_approve') {
      const isManager =
        String(emp.managerId) === session.id ||
        session.role === 'hr_staff' ||
        session.role === 'super_hr_admin'
      if (!isManager) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      if (leave.status !== 'pending_manager') {
        return NextResponse.json({ error: 'Not awaiting manager approval' }, { status: 400 })
      }
      leave.status = 'pending_hr'
      leave.managerApprovedAt = new Date()
      leave.managerApprovedBy = session.id as unknown as typeof leave.managerApprovedBy
      leave.managerComment = comment
      await leave.save()
      return NextResponse.json({ success: true, status: leave.status })
    }

    if (action === 'hr_approve') {
      if (!isHrAdminRole(session.role)) {
        return NextResponse.json({ error: 'HR approval only' }, { status: 403 })
      }
      if (leave.status !== 'pending_hr') {
        return NextResponse.json({ error: 'Not awaiting HR approval' }, { status: 400 })
      }
      leave.status = 'approved'
      leave.hrApprovedAt = new Date()
      leave.hrApprovedBy = session.id as unknown as typeof leave.hrApprovedBy
      leave.hrComment = comment
      await leave.save()

      if (leave.leaveType !== 'unpaid' && emp.paidLeaveEligible) {
        const year = new Date(leave.fromDate).getFullYear()
        const bal = await HrLeaveBalance.findOne({ employeeId: emp._id, year })
        if (bal) {
          const field =
            leave.leaveType === 'annual'
              ? 'annualUsed'
              : leave.leaveType === 'sick'
              ? 'sickUsed'
              : leave.leaveType === 'casual'
              ? 'casualUsed'
              : null
          if (field) {
            bal[field] = (bal[field] as number) + leave.totalDays
            await bal.save()
          }
        }
      }
      return NextResponse.json({ success: true, status: leave.status })
    }

    if (action === 'reject') {
      const canReject =
        (leave.status === 'pending_manager' &&
          (String(emp.managerId) === session.id || isHrAdminRole(session.role))) ||
        (leave.status === 'pending_hr' && isHrAdminRole(session.role))
      if (!canReject) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      leave.status = 'rejected'
      leave.rejectedBy = session.id as unknown as typeof leave.rejectedBy
      leave.rejectionReason = comment || 'Rejected'
      await leave.save()
      return NextResponse.json({ success: true, status: leave.status })
    }

    if (action === 'cancel') {
      if (String(leave.employeeId) !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (!['pending_manager', 'pending_hr'].includes(leave.status)) {
        return NextResponse.json({ error: 'Cannot cancel this request' }, { status: 400 })
      }
      leave.status = 'cancelled'
      await leave.save()
      return NextResponse.json({ success: true })
    }

    if (action === 'set_status') {
      if (!isHrAdminRole(session.role)) {
        return NextResponse.json({ error: 'HR admin only' }, { status: 403 })
      }
      const next = String(body.status || '')
      if (!['approved', 'cancelled', 'pending_hr'].includes(next)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }

      const prev = leave.status
      if (prev === next) {
        return NextResponse.json({ success: true, status: leave.status })
      }

      async function adjustBalance(direction: 'apply' | 'revert') {
        if (leave.leaveType === 'unpaid' || !emp.paidLeaveEligible) return
        const year = new Date(leave.fromDate).getFullYear()
        const bal = await HrLeaveBalance.findOne({ employeeId: emp._id, year })
        if (!bal) return
        const field =
          leave.leaveType === 'annual'
            ? 'annualUsed'
            : leave.leaveType === 'sick'
            ? 'sickUsed'
            : leave.leaveType === 'casual'
            ? 'casualUsed'
            : null
        if (!field) return
        const delta = direction === 'apply' ? leave.totalDays : -leave.totalDays
        bal[field] = Math.max(0, (bal[field] as number) + delta)
        await bal.save()
      }

      if (prev === 'approved' && next !== 'approved') await adjustBalance('revert')
      if (next === 'approved' && prev !== 'approved') await adjustBalance('apply')

      leave.status = next as typeof leave.status
      if (next === 'approved') {
        leave.hrApprovedAt = new Date()
        leave.hrApprovedBy = session.id as unknown as typeof leave.hrApprovedBy
        leave.rejectionReason = undefined
        leave.rejectedBy = undefined
      } else if (next === 'cancelled') {
        leave.rejectionReason = comment || 'Cancelled by HR'
        leave.rejectedBy = session.id as unknown as typeof leave.rejectedBy
      } else {
        leave.hrApprovedAt = undefined
        leave.hrApprovedBy = undefined
        leave.rejectionReason = undefined
        leave.rejectedBy = undefined
      }

      await leave.save()
      return NextResponse.json({ success: true, status: leave.status })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('[hr/leave PATCH]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
