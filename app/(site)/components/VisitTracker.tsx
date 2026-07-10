'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Fire-and-forget; failures are ignored.
    const controller = new AbortController()
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {})
    return () => controller.abort()
  }, [pathname])

  return null
}
