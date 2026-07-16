import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { requireHrSession } from '@/lib/hr/auth'
import { Task, TaskAssignment, TaskChecklist } from '@/lib/tasks/models'
import type { TaskAssignmentDoc, TaskChecklistDoc, TaskDoc } from '@/lib/tasks/models'
import {
  buildTaskAccessFilter,
  getAssignedTaskIds,
  isValidObjectId,
  serializeTask,
  toObjectId,
} from '@/lib/tasks/service'
import { canViewAllTasks } from '@/lib/tasks/constants'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireHrSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const today = new Date().toISOString().slice(0, 10)
  const isAdminView = canViewAllTasks(session.role)

  const access = await buildTaskAccessFilter(session)
  const base = { $and: [access, { deletedAt: null }, { archived: false }] }

  const tasks = await Task.find(base).sort({ updatedAt: -1 }).limit(200).lean<TaskDoc[]>()
  const byStatus = isAdminView
    ? await Task.aggregate<{ _id: string; count: number }>([
        { $match: { deletedAt: null, archived: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
    : []

  const total = tasks.length
  const count = (s: string) => tasks.filter((t) => t.status === s).length
  const overdue = tasks.filter(
    (t) => t.dueDate && t.dueDate < today && t.status !== 'completed' && t.status !== 'cancelled'
  ).length
  const completed = count('completed')
  const completionRate = total ? Math.round((completed / total) * 100) : 0

  const stats: Record<string, unknown> = {
    role: session.role,
    total,
    pending: count('pending'),
    inProgress: count('in_progress'),
    review: count('review'),
    completed,
    cancelled: count('cancelled'),
    overdue,
    completionRate,
    byStatus: Object.fromEntries(byStatus.map((b) => [b._id, b.count])),
  }

  if (isAdminView) {
    const working = await TaskAssignment.aggregate<{ _id: string; ids: mongoose.Types.ObjectId[] }>([
      { $match: { removedAt: null, status: { $in: ['pending', 'in_progress', 'review'] } } },
      { $group: { _id: '$assigneeType', ids: { $addToSet: '$assigneeId' } } },
    ])
    const emp = working.find((w) => w._id === 'employee')?.ids.length || 0
    const free = working.find((w) => w._id === 'freelancer')?.ids.length || 0
    stats.employeesWorking = emp
    stats.freelancersWorking = free
    if (session.role === 'ceo' && isValidObjectId(session.id)) {
      stats.myCreated = await Task.countDocuments({
        'createdBy.id': toObjectId(session.id),
        deletedAt: null,
      })
    }
  } else {
    // Employee / freelancer personal view.
    const assignedIds = await getAssignedTaskIds(session.id)
    const dueToday = tasks.filter((t) => t.dueDate === today).length
    const upcoming = tasks.filter((t) => t.dueDate && t.dueDate > today).length
    let checklistTotal = 0
    let checklistDone = 0
    let pendingChecklist = 0
    if (assignedIds.length && isValidObjectId(session.id)) {
      const items = await TaskChecklist.find({
        taskId: { $in: assignedIds },
        deletedAt: null,
        assignedToId: toObjectId(session.id),
      }).lean<TaskChecklistDoc[]>()
      checklistTotal = items.length
      checklistDone = items.filter((i) => i.completed).length
      pendingChecklist = checklistTotal - checklistDone
    }
    const myAssignments = await TaskAssignment.find({
      assigneeId: isValidObjectId(session.id) ? toObjectId(session.id) : new mongoose.Types.ObjectId(),
      removedAt: null,
    }).lean<TaskAssignmentDoc[]>()
    const avgProgress = myAssignments.length
      ? Math.round(myAssignments.reduce((s, a) => s + (a.completionPercent || 0), 0) / myAssignments.length)
      : 0
    stats.dueToday = dueToday
    stats.upcoming = upcoming
    stats.checklistTotal = checklistTotal
    stats.checklistDone = checklistDone
    stats.pendingChecklist = pendingChecklist
    stats.myProgress = avgProgress
  }

  const recent = tasks.slice(0, 8).map((t) => serializeTask(t))
  const dueSoon = tasks
    .filter((t) => t.dueDate && t.dueDate >= today && t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 8)
    .map((t) => serializeTask(t))

  return NextResponse.json({ stats, recent, dueSoon })
}
