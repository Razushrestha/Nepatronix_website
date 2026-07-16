import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrEmployee, HrHoliday, sanitizeEmployee } from '@/lib/hr/models'
import { employeeMonthlyWorkload } from '@/lib/hr/attendance-utils'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteCtx) {
  const session = await requireHrAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectToDatabase()
  const emp = await HrEmployee.findById(id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const holidays = await HrHoliday.find({ date: { $regex: `^${monthPrefix}` } }).lean()
  const holidaySet = new Set(holidays.map((h) => h.date))
  const workload = employeeMonthlyWorkload(emp, holidaySet, now)

  return NextResponse.json({
    month: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    employee: {
      ...sanitizeEmployee(emp, true),
      totalWorkingDays: workload.totalWorkingDays,
      totalWorkingHours: workload.totalWorkingHours,
      hoursPerDay: workload.hoursPerDay,
    },
  })
}

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectToDatabase()
    const body = await req.json()
    delete body._id
    delete body.passwordHash

    if (body.password) {
      body.passwordHash = await hashPassword(String(body.password))
      delete body.password
    }

    const emp = await HrEmployee.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ employee: sanitizeEmployee(emp, true) })
  } catch (err) {
    console.error('[hr/employees PATCH]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectToDatabase()

    const emp = await HrEmployee.findById(id)
    if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const permanent = new URL(req.url).searchParams.get('permanent') === 'true'

    if (permanent) {
      await HrEmployee.findByIdAndDelete(id)
      return NextResponse.json({ success: true, deleted: true })
    }

    emp.active = false
    emp.status = 'terminated'
    await emp.save()
    return NextResponse.json({ success: true, deactivated: true })
  } catch (err) {
    console.error('[hr/employees DELETE]', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
