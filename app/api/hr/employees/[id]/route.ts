import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import { requireHrAdmin } from '@/lib/hr/auth'
import { HrEmployee, sanitizeEmployee } from '@/lib/hr/models'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteCtx) {
  const session = await requireHrAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectToDatabase()
  const emp = await HrEmployee.findById(id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ employee: sanitizeEmployee(emp, true) })
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
