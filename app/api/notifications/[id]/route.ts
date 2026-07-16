import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { Notification } from '@/lib/tasks/models'
import { isValidObjectId, toObjectId } from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  if (!isValidObjectId(id) || !isValidObjectId(session.id)) {
    return NextResponse.json({ error: 'Invalid notification' }, { status: 400 })
  }

  await Notification.updateOne(
    { _id: toObjectId(id), userId: toObjectId(session.id) },
    { $set: { read: true, readAt: new Date() } }
  )
  return NextResponse.json({ ok: true })
}
