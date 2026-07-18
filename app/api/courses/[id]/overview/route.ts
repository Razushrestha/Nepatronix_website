import { NextRequest, NextResponse } from 'next/server'
import { getCourseOverviewByListId } from '@/lib/course-overview'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const courseId = parseInt(id, 10)
  const overview = await getCourseOverviewByListId(courseId)
  if (!overview) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }
  return NextResponse.json({ course: overview })
}
