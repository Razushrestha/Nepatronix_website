import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrAttendance, HrEmployee } from '@/lib/hr/models'
import { dateKey } from '@/lib/hr/attendance-utils'
import { distanceMeters, isIpAllowed, normalizeClientIp } from '@/lib/hr/geo'
import { getEffectiveAllowedIps, getEffectiveOfficeCoords } from '@/lib/hr/service'
import { getOfficeSettings } from '@/lib/hr/models'

export const runtime = 'nodejs'

function getRequestIp(req: NextRequest): string {
  return normalizeClientIp(
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  )
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()
    const lat = Number(body.latitude)
    const lng = Number(body.longitude)
    const accuracy = body.accuracy != null ? Number(body.accuracy) : undefined

    const settings = await getOfficeSettings()
    const ips = getEffectiveAllowedIps(settings)
    const ip = getRequestIp(req)
    if (!isIpAllowed(ip, ips)) {
      return NextResponse.json({ error: `Not on office network (IP: ${ip || 'unknown'})` }, { status: 403 })
    }
    const office = getEffectiveOfficeCoords(settings)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'GPS location is required' }, { status: 400 })
    }
    const dist = distanceMeters(lat, lng, office.latitude, office.longitude)
    if (dist > office.radiusMeters) {
      return NextResponse.json({ error: `You are ${Math.round(dist)}m from office` }, { status: 403 })
    }

    const emp = await HrEmployee.findById(session.id).lean()
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })

    const today = dateKey(new Date())
    const record = await HrAttendance.findOne({ employeeId: emp._id, date: today })
    if (!record?.checkIn) {
      return NextResponse.json({ error: 'Check in first before checking out' }, { status: 400 })
    }
    if (record.checkOut) {
      return NextResponse.json({ error: 'Already checked out today' }, { status: 400 })
    }

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
