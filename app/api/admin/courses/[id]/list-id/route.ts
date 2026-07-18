import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { canView } from '@/lib/admin-collections'
import { getCourseListIdById } from '@/lib/course-list-order'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canView('courses', user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const listId = await getCourseListIdById(id)
  if (!listId) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ listId })
}
