import { NextRequest, NextResponse } from 'next/server'

function shouldUseSecureCookie(req: NextRequest) {
  const proto = req.nextUrl.protocol
  const forwardedProto = req.headers.get('x-forwarded-proto')
  return (
    process.env.NODE_ENV === 'production' &&
    (proto === 'https:' || forwardedProto === 'https' || forwardedProto?.startsWith('https'))
  )
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', process.env.ADMIN_SECRET!, {
    path: '/',
    httpOnly: true,
    secure: shouldUseSecureCookie(req),
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete({ name: 'admin_session', path: '/' })
  return response
}
