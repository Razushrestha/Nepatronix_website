import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { AdminUser } from '@/lib/models'
import { hashPassword, verifyPassword, signToken, authCookie } from '@/lib/auth'

export const runtime = 'nodejs'

function shouldUseSecureCookie(req: NextRequest) {
  const proto = req.nextUrl.protocol
  const forwardedProto = req.headers.get('x-forwarded-proto')
  return (
    process.env.NODE_ENV === 'production' &&
    (proto === 'https:' || forwardedProto === 'https' || forwardedProto?.startsWith('https'))
  )
}

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()
  const email = String(body.email || '').toLowerCase().trim()
  const password = String(body.password || '')

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const userCount = await AdminUser.countDocuments()

  // Bootstrap: if there are no admin users yet, allow the legacy ADMIN_SECRET
  // to create the first admin account so you're never locked out.
  if (userCount === 0) {
    if (process.env.ADMIN_SECRET && password === process.env.ADMIN_SECRET) {
      const bootstrapEmail = email || process.env.ADMIN_EMAIL || 'admin@nepatronix.org'
      const created = await AdminUser.create({
        name: 'Administrator',
        email: bootstrapEmail,
        passwordHash: await hashPassword(password),
        role: 'admin',
      })
      const sessionUser = {
        id: created._id.toString(),
        email: created.email,
        name: created.name,
        role: created.role as 'admin',
      }
      const token = signToken(sessionUser)
      const response = NextResponse.json({ success: true, user: sessionUser, bootstrapped: true })
      response.cookies.set(authCookie.name, token, {
        path: '/',
        httpOnly: true,
        secure: shouldUseSecureCookie(req),
        sameSite: 'lax',
        maxAge: authCookie.maxAge,
      })
      return response
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const user = await AdminUser.findOne({ email, active: true })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  user.lastLoginAt = new Date()
  await user.save()

  const sessionUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role as 'admin' | 'editor' | 'viewer',
  }
  const token = signToken(sessionUser)
  const response = NextResponse.json({ success: true, user: sessionUser })
  response.cookies.set(authCookie.name, token, {
    path: '/',
    httpOnly: true,
    secure: shouldUseSecureCookie(req),
    sameSite: 'lax',
    maxAge: authCookie.maxAge,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete({ name: authCookie.name, path: '/' })
  return response
}
