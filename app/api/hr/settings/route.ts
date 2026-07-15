import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrAdmin, requireHrSession } from '@/lib/hr/auth'
import { getOfficeSettings, HrOfficeSettings } from '@/lib/hr/models'
import { getEffectiveAllowedIps, getEffectiveOfficeCoords } from '@/lib/hr/service'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const settings = await getOfficeSettings()
  const office = getEffectiveOfficeCoords(settings)
  const ips = getEffectiveAllowedIps(settings)
  const isAdmin = session.role === 'hr_staff' || session.role === 'super_hr_admin'

  return NextResponse.json({
    officeName: settings.officeName,
    startTime: settings.startTime,
    endTime: settings.endTime,
    graceMinutes: settings.graceMinutes,
    latitude: office.latitude,
    longitude: office.longitude,
    radiusMeters: office.radiusMeters,
    allowedIpCount: ips.length,
    allowedIps: isAdmin ? ips : undefined,
    canEdit: isAdmin,
  })
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireHrAdmin()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()
    const body = await req.json()
    let doc = await HrOfficeSettings.findOne()
    if (!doc) doc = await HrOfficeSettings.create({})

    const updates: Record<string, unknown> = {}
    if (body.startTime != null) updates.startTime = String(body.startTime)
    if (body.endTime != null) updates.endTime = String(body.endTime)
    if (body.graceMinutes != null) updates.graceMinutes = Number(body.graceMinutes)
    if (body.latitude != null) updates.latitude = Number(body.latitude)
    if (body.longitude != null) updates.longitude = Number(body.longitude)
    if (body.radiusMeters != null) updates.radiusMeters = Number(body.radiusMeters)
    if (body.officeName != null) updates.officeName = String(body.officeName)
    if (Array.isArray(body.allowedIps)) {
      updates.allowedIps = body.allowedIps.map((s: string) => s.trim()).filter(Boolean)
    }

    Object.assign(doc, updates)
    await doc.save()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[hr/settings]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
