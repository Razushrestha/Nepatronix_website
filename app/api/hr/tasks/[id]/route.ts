import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { HrTask } from '@/lib/hr/models'

export const runtime = 'nodejs'

type RouteCtx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  try {
    const session = await requireHrSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectToDatabase()
    const task = await HrTask.findById(id)
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (String(task.employeeId) !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const status = body.status as string | undefined
    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    task.status = status as 'pending' | 'in_progress' | 'completed'
    task.completedAt = status === 'completed' ? new Date() : undefined
    await task.save()

    return NextResponse.json({
      task: {
        id: String(task._id),
        title: task.title,
        status: task.status,
        completedAt: task.completedAt,
      },
    })
  } catch (err) {
    console.error('[hr/tasks PATCH]', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
