import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { getModel } from '@/lib/admin-models'
import { canEdit } from '@/lib/admin-collections'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection } = await params
  const Model = getModel(collection)
  if (!Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canEdit(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()
  const { action, ids, status } = await req.json()

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No ids provided' }, { status: 400 })
  }

  if (action === 'delete') {
    const res = await Model.deleteMany({ _id: { $in: ids } })
    return NextResponse.json({ success: true, deleted: res.deletedCount })
  }

  if (action === 'status' && status) {
    const res = await Model.updateMany({ _id: { $in: ids } }, { $set: { status } })
    return NextResponse.json({ success: true, modified: res.modifiedCount })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
