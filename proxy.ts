import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') ?? ''

  // Staff HR portal: /hr/login is public; other /hr routes need hr_token or admin_token
  if (pathname.startsWith('/hr') && !pathname.startsWith('/hr/login')) {
    const hrToken = request.cookies.get('hr_token')
    const adminToken = request.cookies.get('admin_token')
    if (!hrToken && !adminToken) {
      const login = new URL('/hr/login', request.url)
      login.searchParams.set('next', pathname)
      return NextResponse.redirect(login)
    }
  }

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
  matcher: ['/admin/:path*', '/hr/:path*'],
}
