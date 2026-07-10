import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { Visit } from '@/lib/models'

export const runtime = 'nodejs'

function detectDevice(ua: string): string {
  if (/mobile/i.test(ua) && !/ipad|tablet/i.test(ua)) return 'mobile'
  if (/ipad|tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const path = typeof body.path === 'string' ? body.path.slice(0, 300) : '/'

    // Never track admin or API traffic.
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const ua = req.headers.get('user-agent') || ''
    const referrer = req.headers.get('referer') || ''

    let visitorId = req.cookies.get('nx_vid')?.value
    let sessionId = req.cookies.get('nx_sess')?.value
    const newVisitor = !visitorId
    const newSession = !sessionId
    if (!visitorId) visitorId = randomUUID()
    if (!sessionId) sessionId = randomUUID()

    await connectToDatabase()
    await Visit.create({
      path,
      visitorId,
      sessionId,
      referrer,
      userAgent: ua.slice(0, 300),
      device: detectDevice(ua),
    })

    const res = NextResponse.json({ ok: true })
    if (newVisitor) {
      res.cookies.set('nx_vid', visitorId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      })
    }
    if (newSession) {
      res.cookies.set('nx_sess', sessionId, {
        path: '/',
        maxAge: 60 * 30, // 30 min session
        sameSite: 'lax',
      })
    }
    return res
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
