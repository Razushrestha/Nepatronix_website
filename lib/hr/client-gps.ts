export type GpsReading = { latitude: number; longitude: number; accuracy: number }

/**
 * Collect the best GPS fix over several attempts (desktop browsers often start with poor accuracy).
 */
export function getBestGpsReading(maxWaitMs = 18000): Promise<GpsReading> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('GPS is not supported on this device'))
      return
    }

    let best: GpsReading | null = null
    let settled = false
    const started = Date.now()

    const finish = (err?: GeolocationPositionError | Error) => {
      if (settled) return
      settled = true
      if (watchId != null) navigator.geolocation.clearWatch(watchId)
      clearTimeout(timer)
      if (best) resolve(best)
      else reject(new Error((err as GeolocationPositionError)?.message || 'Could not get location'))
    }

    const consider = (pos: GeolocationPosition) => {
      const reading: GpsReading = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      }
      if (!best || reading.accuracy < best.accuracy) {
        best = reading
      }
      if (reading.accuracy <= 150 || Date.now() - started >= maxWaitMs) {
        finish()
      }
    }

    let watchId: number | null = null
    const timer = setTimeout(() => finish(), maxWaitMs)

    watchId = navigator.geolocation.watchPosition(
      consider,
      (err) => {
        if (best) finish()
        else finish(err)
      },
      { enableHighAccuracy: true, timeout: maxWaitMs, maximumAge: 0 }
    )

    navigator.geolocation.getCurrentPosition(consider, () => {}, {
      enableHighAccuracy: true,
      timeout: maxWaitMs,
      maximumAge: 0,
    })
  })
}
