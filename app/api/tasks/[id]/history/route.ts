import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { TaskHistory } from '@/lib/tasks/models'
import type { TaskHistoryDoc } from '@/lib/tasks/models'
import { loadTaskContext, serializeHistory } from '@/lib/tasks/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireHrSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const { id } = await params
  const ctx = await loadTaskContext(session, id)
  if (!ctx) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const rows = await TaskHistory.find({ taskId: ctx.task._id }).sort({ createdAt: -1 }).lean<TaskHistoryDoc[]>()
  return NextResponse.json({ history: rows.map(serializeHistory) })
}
