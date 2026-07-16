import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { Notification } from '@/lib/tasks/models'
import type { NotificationDoc } from '@/lib/tasks/models'
import { isValidObjectId, serializeNotification, toObjectId } from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isValidObjectId(session.id)) {
    return NextResponse.json({ notifications: [], unread: 0 })
  }

  await connectToDatabase()
  const uid = toObjectId(session.id)
  const onlyUnread = req.nextUrl.searchParams.get('unread') === 'true'
  const limit = Math.min(50, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') || '20', 10) || 20))

  const filter: Record<string, unknown> = { userId: uid }
  if (onlyUnread) filter.read = false

  const [rows, unread] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean<NotificationDoc[]>(),
    Notification.countDocuments({ userId: uid, read: false }),
  ])

  return NextResponse.json({ notifications: rows.map(serializeNotification), unread })
}

/** Mark all notifications as read. */
export async function PATCH() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isValidObjectId(session.id)) return NextResponse.json({ ok: true })

  await connectToDatabase()
  await Notification.updateMany(
    { userId: toObjectId(session.id), read: false },
    { $set: { read: true, readAt: new Date() } }
  )
  return NextResponse.json({ ok: true })
}
