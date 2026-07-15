import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import {
  HrAttendance,
  HrEmployee,
  HrHoliday,
  HrLeaveRequest,
  getOfficeSettings,
} from '@/lib/hr/models'
import {
  calcLateDeduction,
  calcLateMinutes,
  countWorkingDaysInMonth,
  dateKey,
  isScheduledWorkday,
  scheduledHoursForType,
} from '@/lib/hr/attendance-utils'
import { distanceMeters, isIpAllowed, normalizeClientIp } from '@/lib/hr/geo'
import { getEffectiveAllowedIps, getEffectiveOfficeCoords } from '@/lib/hr/service'
import type { Weekday } from '@/lib/hr/constants'

export const runtime = 'nodejs'

function getRequestIp(req: NextRequest): string {
  return normalizeClientIp(
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  )
}

async function validateLocation(
  req: NextRequest,
  lat: number,
  lng: number,
  accuracy?: number
): Promise<{ ok: boolean; error?: string }> {
  const settings = await getOfficeSettings()
  const ips = getEffectiveAllowedIps(settings)
  const ip = getRequestIp(req)
  if (!isIpAllowed(ip, ips)) {
    return { ok: false, error: `Not on office network (IP: ${ip || 'unknown'})` }
  }
  const office = getEffectiveOfficeCoords(settings)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: 'GPS location is required' }
  }
  if (accuracy && accuracy > 100) {
    return { ok: false, error: 'GPS accuracy too low — move closer to a window and retry' }
  }
  const dist = distanceMeters(lat, lng, office.latitude, office.longitude)
  if (dist > office.radiusMeters) {
    return {
      ok: false,
      error: `You are ${Math.round(dist)}m from office (max ${office.radiusMeters}m)`,
    }
  }
  return { ok: true }
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

    const loc = await validateLocation(req, lat, lng, accuracy)
    if (!loc.ok) return NextResponse.json({ error: loc.error }, { status: 403 })

    const emp = await HrEmployee.findById(session.id).lean()
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })

    const now = new Date()
    const today = dateKey(now)
    const settings = await getOfficeSettings()

    if (!isScheduledWorkday(now, emp.employmentType, emp.scheduledDays as Weekday[])) {
      return NextResponse.json({ error: 'Today is not a scheduled work day for you' }, { status: 400 })
    }

    const holiday = await HrHoliday.findOne({ date: today }).lean()
    if (holiday) {
      return NextResponse.json({ error: 'Today is a public holiday' }, { status: 400 })
    }

    const approvedLeave = await HrLeaveRequest.findOne({
      employeeId: emp._id,
      status: 'approved',
      fromDate: { $lte: today },
      toDate: { $gte: today },
    }).lean()
    if (approvedLeave) {
      return NextResponse.json({ error: 'You are on approved leave today' }, { status: 400 })
    }

    let record = await HrAttendance.findOne({ employeeId: emp._id, date: today })
    if (record?.checkIn) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
    }

    const scheduledStart = emp.scheduledStart || settings.startTime || '10:00'
    const lateMinutes = calcLateMinutes(now, scheduledStart, settings.graceMinutes || 0)
    const year = now.getFullYear()
    const month = now.getMonth()
    const holidays = await HrHoliday.find({
      date: { $regex: `^${year}-${String(month + 1).padStart(2, '0')}` },
    }).lean()
    const holidaySet = new Set(holidays.map((h) => h.date))
    const workingDays = countWorkingDaysInMonth(
      year,
      month,
      emp.employmentType,
      emp.scheduledDays as Weekday[],
      holidaySet
    )
    const hours = scheduledHoursForType(emp.employmentType, emp.scheduledHoursPerDay)
    const lateDeduction = calcLateDeduction(lateMinutes, emp.monthlyPay, workingDays, hours)

    const ip = getRequestIp(req)
    const payload = {
      employeeId: emp._id,
      department: emp.department,
      date: today,
      status: lateMinutes > 120 ? 'half_day' : 'present',
      scheduledStart: emp.scheduledStart,
      scheduledEnd: emp.scheduledEnd,
      checkIn: now,
      lateMinutes,
      lateDeduction,
      checkInIp: ip,
      checkInLat: lat,
      checkInLng: lng,
      checkInAccuracy: accuracy,
    }

    if (record) {
      Object.assign(record, payload)
      await record.save()
    } else {
      record = await HrAttendance.create(payload)
    }

    return NextResponse.json({
      success: true,
      checkIn: record.checkIn,
      lateMinutes: record.lateMinutes,
      lateDeduction: record.lateDeduction,
      message:
        lateMinutes > 0
          ? `Checked in ${lateMinutes} min late. Deduction: NPR ${lateDeduction}`
          : 'Checked in on time',
    })
  } catch (err) {
    console.error('[hr/check-in]', err)
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}
