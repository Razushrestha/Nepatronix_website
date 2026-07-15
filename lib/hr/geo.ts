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
