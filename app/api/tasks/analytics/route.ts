import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { Task, TaskAssignment } from '@/lib/tasks/models'
import { canViewAllTasks } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!canViewAllTasks(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectToDatabase()
  const today = new Date().toISOString().slice(0, 10)

  const [byStatus, byPriority, byDepartment, byProject, perEmployee] = await Promise.all([
    Task.aggregate<{ _id: string; count: number }>([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate<{ _id: string; count: number }>([
      { $match: { deletedAt: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate<{ _id: string; count: number }>([
      { $match: { deletedAt: null } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]),
    Task.aggregate<{ _id: string; count: number }>([
      { $match: { deletedAt: null, project: { $ne: null } } },
      { $group: { _id: '$project', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    TaskAssignment.aggregate<{
      _id: mongoose.Types.ObjectId
      name: string
      type: string
      total: number
      completed: number
      avgProgress: number
    }>([
      { $match: { removedAt: null } },
      {
        $group: {
          _id: '$assigneeId',
          name: { $first: '$assigneeName' },
          type: { $first: '$assigneeType' },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avgProgress: { $avg: '$completionPercent' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 50 },
    ]),
  ])

  const overdue = await Task.countDocuments({
    deletedAt: null,
    dueDate: { $lt: today, $ne: null },
    status: { $nin: ['completed', 'cancelled'] },
  })

  return NextResponse.json({
    byStatus: Object.fromEntries(byStatus.map((b) => [b._id, b.count])),
    byPriority: Object.fromEntries(byPriority.map((b) => [b._id, b.count])),
    byDepartment: byDepartment.map((b) => ({ department: b._id || 'unassigned', count: b.count })),
    byProject: byProject.map((b) => ({ project: b._id, count: b.count })),
    overdue,
    perEmployee: perEmployee.map((e) => ({
      id: String(e._id),
      name: e.name,
      type: e.type,
      total: e.total,
      completed: e.completed,
      completionRate: e.total ? Math.round((e.completed / e.total) * 100) : 0,
      avgProgress: Math.round(e.avgProgress || 0),
    })),
  })
}
