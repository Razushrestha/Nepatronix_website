/** Haversine distance in meters between two GPS points. */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function normalizeClientIp(raw: string | null): string {
  if (!raw) return ''
  const first = raw.split(',')[0]?.trim() || ''
  if (first.startsWith('::ffff:')) return first.slice(7)
  return first
}

export function isIpAllowed(clientIp: string, allowedIps: string[]): boolean {
  if (!clientIp) return false
  const normalized = normalizeClientIp(clientIp)
  for (const allowed of allowedIps) {
    const a = allowed.trim()
    if (!a) continue
    if (a === normalized) return true
    if (a.endsWith('*') && normalized.startsWith(a.slice(0, -1))) return true
  }
  return false
}

/** Max GPS uncertainty (m) before we reject — configurable via HR_GPS_MAX_ACCURACY_M */
export function maxGpsAccuracyMeters(): number {
  const env = Number(process.env.HR_GPS_MAX_ACCURACY_M)
  if (Number.isFinite(env) && env > 0) return env
  return process.env.NODE_ENV === 'development' ? 10000 : 2000
}

export type LocationValidation = { ok: true } | { ok: false; error: string }

/** Office IP + geofence check. Inside radius always passes; poor accuracy only blocks when outside. */
export function validateAttendanceLocation(input: {
  clientIp: string
  allowedIps: string[]
  latitude: number
  longitude: number
  accuracy?: number
  officeLat: number
  officeLng: number
  radiusMeters: number
  requireGps?: boolean
}): LocationValidation {
  const {
    clientIp,
    allowedIps,
    latitude,
    longitude,
    accuracy,
    officeLat,
    officeLng,
    radiusMeters,
    requireGps = true,
  } = input

  if (!isIpAllowed(clientIp, allowedIps)) {
    return { ok: false, error: `Not on office network (IP: ${clientIp || 'unknown'})` }
  }

  if (!requireGps) {
    return { ok: true }
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { ok: false, error: 'GPS location is required — allow location access in your browser' }
  }

  const dist = distanceMeters(latitude, longitude, officeLat, officeLng)
  const maxAcc = maxGpsAccuracyMeters()

  if (dist <= radiusMeters) {
    return { ok: true }
  }

  if (accuracy != null && accuracy > maxAcc) {
    return {
      ok: false,
      error: 'GPS signal is weak. Move closer to a window, wait a few seconds, and try again.',
    }
  }

  return {
    ok: false,
    error: `You are ${Math.round(dist)}m from the office (allowed within ${radiusMeters}m). Enable precise location if indoors.`,
  }
}
