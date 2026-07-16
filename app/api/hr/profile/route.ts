import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee, sanitizeEmployee } from '@/lib/hr/models'

export const runtime = 'nodejs'

const SELF_EDIT_FIELDS = [
  'phone',
  'fullNameNepali',
  'gender',
  'dateOfBirth',
  'citizenshipNumber',
  'nidNumber',
  'panNumber',
  'permanentAddress',
  'currentAddress',
  'emergencyContact',
  'bankName',
  'bankAccount',
] as const

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const emp = await HrEmployee.findById(session.id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ profile: sanitizeEmployee(emp, true) })
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()
    const update: Record<string, unknown> = {}

    for (const key of SELF_EDIT_FIELDS) {
      if (body[key] !== undefined && key !== 'dateOfBirth') update[key] = body[key]
    }

    if (body.password) {
      update.passwordHash = await hashPassword(String(body.password))
    }

    if (body.dateOfBirth) {
      update.dateOfBirth = new Date(String(body.dateOfBirth))
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const emp = await HrEmployee.findByIdAndUpdate(session.id, update, { new: true }).lean()
    if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ profile: sanitizeEmployee(emp, true) })
  } catch (err) {
    console.error('[hr/profile PATCH]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
