import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrEmployee, HrHoliday, sanitizeEmployee } from '@/lib/hr/models'
import { createEmployeeWithDefaults } from '@/lib/hr/service'
import { employeeMonthlyWorkload } from '@/lib/hr/attendance-utils'
import { EMPLOYMENT_TYPES, HR_DEPARTMENTS, HR_ROLES, TUTOR_CHOICE_OFF_DAYS, usesFlexibleSchedule, type EmploymentType, type HrDepartment, type HrRole, type Weekday } from '@/lib/hr/constants'

export const runtime = 'nodejs'

function formatCreateError(err: unknown): { message: string; status: number } {
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    const key = (err as { keyPattern?: Record<string, number> }).keyPattern || {}
    if (key.email) return { message: 'Email already registered', status: 409 }
    if (key.employeeCode) return { message: 'Employee code already exists — try again', status: 409 }
    return { message: 'Duplicate record — email or employee code may already exist', status: 409 }
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ')
    return { message: msg || 'Validation failed', status: 400 }
  }
  if (err instanceof mongoose.Error.CastError) {
    return { message: `Invalid ${err.path}: ${err.value}`, status: 400 }
  }
  if (err instanceof Error && err.message) {
    return { message: err.message, status: 500 }
  }
  return { message: 'Failed to create employee', status: 500 }
}

function parseManagerId(value: unknown): mongoose.Types.ObjectId | undefined {
  if (!value || value === '') return undefined
  const id = String(value)
  if (!mongoose.Types.ObjectId.isValid(id)) return undefined
  return new mongoose.Types.ObjectId(id)
}

export async function GET(req: NextRequest) {
  const session = await requireHrAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const department = searchParams.get('department')
  const q = searchParams.get('q')

  const filter: Record<string, unknown> = {}
  if (searchParams.get('includeInactive') !== 'true') {
    filter.active = true
    filter.status = 'active'
  }
  if (department) filter.department = department
  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { employeeCode: { $regex: q, $options: 'i' } },
    ]
  }

  const employees = await HrEmployee.find(filter).sort({ createdAt: -1 }).limit(200).lean()

  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
  const holidaySet = new Set(holidays.map((h) => h.date))

  return NextResponse.json({
    month: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    employees: employees.map((e) => {
      const workload = employeeMonthlyWorkload(e, holidaySet, now)
      return {
        ...sanitizeEmployee(e, true),
        totalWorkingDays: workload.totalWorkingDays,
        totalWorkingHours: workload.totalWorkingHours,
        hoursPerDay: workload.hoursPerDay,
      }
    }),
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
      return NextResponse.json({ error: 'Missing required fields (name, email, password, department, position)' }, { status: 400 })
    }

    if (!HR_DEPARTMENTS.some((d) => d.value === department)) {
      return NextResponse.json({ error: 'Invalid department' }, { status: 400 })
    }

    const role = String(body.role || 'employee') as HrRole
    if (!HR_ROLES.some((r) => r.value === role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (!EMPLOYMENT_TYPES.some((t) => t.value === employmentType)) {
      return NextResponse.json({ error: 'Invalid employment type' }, { status: 400 })
    }

    let weeklyOffDay: Weekday | undefined
    if (employmentType === 'tutor') {
      weeklyOffDay = String(body.weeklyOffDay || '').trim() as Weekday
      if (!weeklyOffDay || !TUTOR_CHOICE_OFF_DAYS.includes(weeklyOffDay)) {
        return NextResponse.json(
          { error: 'STEM tutors must pick a weekly off day (Sunday–Friday). Saturday is always off.' },
          { status: 400 }
        )
      }
    }

    if (usesFlexibleSchedule(employmentType)) {
      const days = Array.isArray(body.scheduledDays) ? body.scheduledDays.filter(Boolean) : []
      if (!days.length) {
        return NextResponse.json({ error: 'Select at least one work day for this employment type' }, { status: 400 })
      }
    }

    const existing = await HrEmployee.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const managerId = parseManagerId(body.managerId)

    const emp = await createEmployeeWithDefaults({
      fullName,
      fullNameNepali: body.fullNameNepali,
      email,
      password,
      department,
      position,
      employmentType,
      monthlyPay,
      role,
      phone: body.phone || undefined,
      citizenshipNumber: body.citizenshipNumber || undefined,
      nidNumber: body.nidNumber || undefined,
      panNumber: body.panNumber || undefined,
      joinDate: body.joinDate ? new Date(body.joinDate) : undefined,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
      managerId,
      scheduledDays: body.scheduledDays,
      weeklyOffDay,
      scheduledStart: body.scheduledStart,
      scheduledEnd: body.scheduledEnd,
      scheduledHoursPerDay: body.scheduledHoursPerDay,
      bankName: body.bankName || undefined,
      bankAccount: body.bankAccount || undefined,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: body.gender,
      permanentAddress: body.permanentAddress,
      currentAddress: body.currentAddress,
      emergencyContact: body.emergencyContact,
      paidLeaveEligible: body.paidLeaveEligible,
      allowRemoteAttendance: !!body.allowRemoteAttendance,
    })

    return NextResponse.json({
      success: true,
      employee: sanitizeEmployee(emp, true),
    }, { status: 201 })
  } catch (err) {
    console.error('[hr/employees POST]', err)
    const { message, status } = formatCreateError(err)
    return NextResponse.json({ error: message }, { status })
  }
}
