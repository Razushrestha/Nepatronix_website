import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrEmployee, sanitizeEmployee } from '@/lib/hr/models'
import { createEmployeeWithDefaults } from '@/lib/hr/service'
import type { EmploymentType, HrDepartment, HrRole } from '@/lib/hr/constants'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await requireHrAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const department = searchParams.get('department')
  const q = searchParams.get('q')

  const filter: Record<string, unknown> = {}
  if (department) filter.department = department
  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { employeeCode: { $regex: q, $options: 'i' } },
    ]
  }

  const employees = await HrEmployee.find(filter).sort({ createdAt: -1 }).limit(200).lean()
  return NextResponse.json({
    employees: employees.map((e) => sanitizeEmployee(e, true)),
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()

    const fullName = String(body.fullName || '').trim()
    const email = String(body.email || '').trim()
    const password = String(body.password || '')
    const department = String(body.department || '') as HrDepartment
    const position = String(body.position || '').trim()
    const employmentType = String(body.employmentType || 'full_time') as EmploymentType
    const monthlyPay = Number(body.monthlyPay) || 0

    if (!fullName || !email || !password || !department || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await HrEmployee.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const emp = await createEmployeeWithDefaults({
      fullName,
      fullNameNepali: body.fullNameNepali,
      email,
      password,
      department,
      position,
      employmentType,
      monthlyPay,
      role: (body.role || 'employee') as HrRole,
      phone: body.phone,
      citizenshipNumber: body.citizenshipNumber,
      nidNumber: body.nidNumber,
      panNumber: body.panNumber,
      joinDate: body.joinDate ? new Date(body.joinDate) : undefined,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
      managerId: body.managerId || undefined,
      scheduledDays: body.scheduledDays,
      scheduledStart: body.scheduledStart,
      scheduledEnd: body.scheduledEnd,
      scheduledHoursPerDay: body.scheduledHoursPerDay,
      bankName: body.bankName,
      bankAccount: body.bankAccount,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: body.gender,
      permanentAddress: body.permanentAddress,
      currentAddress: body.currentAddress,
      emergencyContact: body.emergencyContact,
      paidLeaveEligible: body.paidLeaveEligible,
    })

    return NextResponse.json({
      success: true,
      employee: sanitizeEmployee(emp, true),
    })
  } catch (err) {
    console.error('[hr/employees POST]', err)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}
