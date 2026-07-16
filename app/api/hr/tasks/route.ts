import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession, requireHrManager } from '@/lib/hr/auth'
import { HrTask } from '@/lib/hr/models'

export const runtime = 'nodejs'

function serializeTask(t: {
  _id: { toString(): string }
  employeeId: { toString(): string }
  title: string
  description?: string
  status: string
  dueDate?: string
  assignedBy?: { toString(): string }
  completedAt?: Date
  createdAt?: Date
}) {
  return {
    id: String(t._id),
    employeeId: String(t.employeeId),
    title: t.title,
    description: t.description,
    status: t.status,
    dueDate: t.dueDate,
    assignedBy: t.assignedBy ? String(t.assignedBy) : undefined,
    completedAt: t.completedAt,
    createdAt: t.createdAt,
  }
}

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const tasks = await HrTask.find({ employeeId: session.id }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ tasks: tasks.map(serializeTask) })
}

export async function POST(req: NextRequest) {
  const session = await requireHrManager()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectToDatabase()
    const body = await req.json()
    const { employeeId, title, description, dueDate } = body

    if (!employeeId || !title?.trim()) {
      return NextResponse.json({ error: 'employeeId and title are required' }, { status: 400 })
    }

    const task = await HrTask.create({
      employeeId,
      title: String(title).trim(),
      description: description ? String(description) : undefined,
      dueDate: dueDate ? String(dueDate) : undefined,
      assignedBy: session.id,
      status: 'pending',
    })

    return NextResponse.json({ task: serializeTask(task) }, { status: 201 })
  } catch (err) {
    console.error('[hr/tasks POST]', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
