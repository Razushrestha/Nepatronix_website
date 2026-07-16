import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee } from '@/lib/hr/models'
import { dateKey } from '@/lib/hr/attendance-utils'
import { getClientIpFromHeaders, validateAttendanceLocation } from '@/lib/hr/geo'
import { departmentRequiresGps } from '@/lib/hr/constants'
import { getEffectiveAllowedIps, getEffectiveOfficeCoords } from '@/lib/hr/service'
import { getOfficeSettings } from '@/lib/hr/models'

export const runtime = 'nodejs'

function getRequestIp(req: NextRequest): string {
  return getClientIpFromHeaders(req.headers)
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()
    const lat = body.latitude != null ? Number(body.latitude) : undefined
    const lng = body.longitude != null ? Number(body.longitude) : undefined
    const accuracy = body.accuracy != null ? Number(body.accuracy) : undefined

    const emp = await HrEmployee.findById(session.id).lean()
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })

    const settings = await getOfficeSettings()
    const office = getEffectiveOfficeCoords(settings)
    const requireGps = departmentRequiresGps(emp.department)
    const loc = validateAttendanceLocation({
      clientIp: getRequestIp(req),
      allowedIps: getEffectiveAllowedIps(settings),
      latitude: lat ?? NaN,
      longitude: lng ?? NaN,
      accuracy,
      officeLat: office.latitude,
      officeLng: office.longitude,
      radiusMeters: office.radiusMeters,
      requireGps,
    })
    if (!loc.ok) {
      return NextResponse.json({ error: loc.error }, { status: 403 })
    }

    const today = dateKey(new Date())
    const record = await HrAttendance.findOne({ employeeId: emp._id, date: today })
    if (!record?.checkIn) {
      return NextResponse.json({ error: 'Check in first before checking out' }, { status: 400 })
    }
    if (record.checkOut) {
      return NextResponse.json({ error: 'Already checked out today' }, { status: 400 })
    }

    const ip = getRequestIp(req)
    record.checkOut = new Date()
    record.checkOutIp = ip
    record.checkOutLat = lat
    record.checkOutLng = lng
    await record.save()

    return NextResponse.json({ success: true, checkOut: record.checkOut })
  } catch (err) {
    console.error('[hr/check-out]', err)
    return NextResponse.json({ error: 'Check-out failed' }, { status: 500 })
  }
}
