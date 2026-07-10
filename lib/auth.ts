import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'insecure-dev-secret-change-me'
const COOKIE_NAME = 'admin_token'
const MAX_AGE = 60 * 60 * 12 // 12 hours

export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: MAX_AGE })
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & SessionUser
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch {
    return null
  }
}

export const authCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE,
}

/** Read the current admin session from the request cookies (server components / route handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

/** Throw-style guard for API routes. Returns the user or null. */
export async function requireRole(
  roles: Array<SessionUser['role']> = ['admin', 'editor', 'viewer']
): Promise<SessionUser | null> {
  const user = await getSession()
  if (!user) return null
  if (!roles.includes(user.role)) return null
  return user
}
