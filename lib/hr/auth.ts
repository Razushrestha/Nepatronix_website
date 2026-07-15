import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { HrDepartment, HrRole } from './constants'
import { isHrAdminRole, isHrManagerRole } from './constants'

const JWT_SECRET = process.env.JWT_SECRET || process.env.HR_JWT_SECRET || 'insecure-dev-secret-change-me'
export const HR_COOKIE_NAME = 'hr_token'
const MAX_AGE = 60 * 60 * 10 // 10 hours

export interface HrSessionUser {
  id: string
  email: string
  fullName: string
  department: HrDepartment
  role: HrRole
  employeeCode: string
}

export function signHrToken(user: HrSessionUser): string {
  return jwt.sign({ ...user, userType: 'hr' }, JWT_SECRET, { expiresIn: MAX_AGE })
}

export function verifyHrToken(token: string): HrSessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & HrSessionUser & { userType?: string }
    if (decoded.userType !== 'hr') return null
    return {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      department: decoded.department,
      role: decoded.role,
      employeeCode: decoded.employeeCode,
    }
  } catch {
    return null
  }
}

export const hrAuthCookie = {
  name: HR_COOKIE_NAME,
  maxAge: MAX_AGE,
}

export async function getHrSession(): Promise<HrSessionUser | null> {
  const store = await cookies()
  const token = store.get(HR_COOKIE_NAME)?.value
  if (!token) return null
  return verifyHrToken(token)
}

export async function requireHrSession(): Promise<HrSessionUser | null> {
  return getHrSession()
}

export async function requireHrManager(): Promise<HrSessionUser | null> {
  const user = await getHrSession()
  if (!user || !isHrManagerRole(user.role)) return null
  return user
}

export async function requireHrAdmin(): Promise<HrSessionUser | null> {
  const user = await getHrSession()
  if (!user || !isHrAdminRole(user.role)) return null
  return user
}
