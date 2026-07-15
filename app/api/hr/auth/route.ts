import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyPassword } from '@/lib/auth'
import { HrEmployee } from '@/lib/hr/models'
import { signHrToken, hrAuthCookie } from '@/lib/hr/auth'
import type { HrDepartment } from '@/lib/hr/constants'

export const runtime = 'nodejs'

function secureCookie(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto')
  return (
    process.env.NODE_ENV === 'production' &&
    (req.nextUrl.protocol === 'https:' || proto === 'https' || proto?.startsWith('https'))
  )
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const department = String(body.department || '').trim() as HrDepartment
    const email = String(body.email || '').toLowerCase().trim()
    const password = String(body.password || '')

    if (!department || !email || !password) {
      return NextResponse.json({ error: 'Department, email, and password are required' }, { status: 400 })
    }

    const emp = await HrEmployee.findOne({ email, department, active: true, status: 'active' }).lean()
    if (!emp || !(await verifyPassword(password, emp.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials for this department' }, { status: 401 })
    }

    await HrEmployee.findByIdAndUpdate(emp._id, { lastLoginAt: new Date() })

    const sessionUser = {
      id: String(emp._id),
      email: emp.email,
      fullName: emp.fullName,
      department: emp.department,
      role: emp.role,
      employeeCode: emp.employeeCode,
    }
    const token = signHrToken(sessionUser)
    const res = NextResponse.json({ success: true, user: sessionUser })
    res.cookies.set(hrAuthCookie.name, token, {
      path: '/',
      httpOnly: true,
      secure: secureCookie(req),
      sameSite: 'lax',
      maxAge: hrAuthCookie.maxAge,
    })
    return res
  } catch (err) {
    console.error('[hr/auth]', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete({ name: hrAuthCookie.name, path: '/' })
  return res
}
