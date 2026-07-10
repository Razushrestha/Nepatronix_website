import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') ?? ''

  // Protect all /admin routes except the login page. Presence check only —
  // full JWT verification happens in the admin layout (Node runtime).
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const res = NextResponse.next()

  if (host.endsWith('.vercel.app')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
