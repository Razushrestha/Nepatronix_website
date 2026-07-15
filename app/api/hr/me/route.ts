import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrEmployee, sanitizeEmployee } from '@/lib/hr/models'
import { isHrAdminRole } from '@/lib/hr/constants'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const emp = await HrEmployee.findById(session.id).lean()
  if (!emp) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    user: session,
    profile: sanitizeEmployee(emp, isHrAdminRole(session.role)),
  })
}
