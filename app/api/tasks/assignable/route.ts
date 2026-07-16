import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee } from '@/lib/hr/models'
import type { EmploymentType, HrDepartment } from '@/lib/hr/constants'
import { assigneeTypeFromEmployment } from '@/lib/tasks/service'
import { canCreateTask } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

/** Lightweight list of employees/freelancers that a task creator can assign or mention. */
export async function GET(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canCreateTask(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectToDatabase()
  const department = req.nextUrl.searchParams.get('department')
  const q = req.nextUrl.searchParams.get('q')

  const filter: Record<string, unknown> = { active: true, status: 'active' }
  if (department) filter.department = department
  if (q) filter.fullName = { $regex: q, $options: 'i' }

  const emps = await HrEmployee.find(filter)
    .select('fullName employmentType department position role employeeCode')
    .sort({ fullName: 1 })
    .lean<
      {
        _id: { toString(): string }
        fullName: string
        employmentType: EmploymentType
        department: HrDepartment
        position?: string
        role: string
        employeeCode: string
      }[]
    >()

  return NextResponse.json({
    employees: emps.map((e) => ({
      id: String(e._id),
      name: e.fullName,
      type: assigneeTypeFromEmployment(e.employmentType),
      department: e.department,
      position: e.position,
      role: e.role,
      employeeCode: e.employeeCode,
    })),
  })
}
