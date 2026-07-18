/**
 * Create a simple task-module task assigned to the sample employee (local testing).
 * Usage: npm run seed:sample-task
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const [k, ...rest] = line.split('=')
    const key = k.trim()
    if (!process.env[key]) {
      process.env[key] = rest.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
}

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'
const TASK_TITLE = 'Local test — complete checklist items'
const EMP_EMAIL = process.env.HR_SAMPLE_EMAIL || 'employee@nepatronix.org'
const MGR_EMAIL = process.env.HR_MANAGER_EMAIL || 'manager@nepatronix.org'

const CHECKLIST = [
  'Review task description',
  'Tick first checklist item',
  'Update status to In Progress',
  'Mark all items done',
]

async function main() {
  await mongoose.connect(URI)

  const HrEmployee =
    mongoose.models.HrEmployee ||
    mongoose.model(
      'HrEmployee',
      new mongoose.Schema({
        fullName: String,
        email: String,
        department: String,
        role: String,
      })
    )

  const Task =
    mongoose.models.Task ||
    mongoose.model(
      'Task',
      new mongoose.Schema({
        title: String,
        description: String,
        status: String,
        priority: String,
        department: String,
        visibility: String,
        dueDate: String,
        completionPercent: Number,
        createdBy: mongoose.Schema.Types.Mixed,
        deletedAt: Date,
      })
    )

  const TaskAssignment =
    mongoose.models.TaskAssignment ||
    mongoose.model(
      'TaskAssignment',
      new mongoose.Schema({
        taskId: mongoose.Schema.Types.ObjectId,
        assigneeId: mongoose.Schema.Types.ObjectId,
        assigneeName: String,
        assigneeType: String,
        status: String,
        completionPercent: Number,
        removedAt: Date,
      })
    )

  const TaskChecklist =
    mongoose.models.TaskChecklist ||
    mongoose.model(
      'TaskChecklist',
      new mongoose.Schema({
        taskId: mongoose.Schema.Types.ObjectId,
        title: String,
        completed: Boolean,
        order: Number,
        deletedAt: Date,
      })
    )

  const employee = await HrEmployee.findOne({ email: EMP_EMAIL }).lean()
  const manager = await HrEmployee.findOne({ email: MGR_EMAIL }).lean()
  if (!employee) {
    console.error(`Employee not found (${EMP_EMAIL}). Run: npm run seed:hr`)
    process.exit(1)
  }
  if (!manager) {
    console.error(`Manager not found (${MGR_EMAIL}). Run: npm run seed:hr`)
    process.exit(1)
  }

  let task = await Task.findOne({ title: TASK_TITLE, deletedAt: null }).lean()
  if (!task) {
    const due = new Date()
    due.setDate(due.getDate() + 7)
    const created = await Task.create({
      title: TASK_TITLE,
      description:
        '<p>Simple local test task. Go to <strong>Plan &amp; Checklist</strong> and tick items to update progress.</p><ol><li>Review task description</li><li>Tick first checklist item</li><li>Update status to In Progress</li><li>Mark all items done</li></ol>',
      status: 'pending',
      priority: 'medium',
      department: 'nepatronix',
      visibility: 'team',
      dueDate: due.toISOString().slice(0, 10),
      completionPercent: 0,
      createdBy: { id: manager._id, name: manager.fullName, role: manager.role },
    })
    task = created.toObject()

    await TaskAssignment.create({
      taskId: task._id,
      assigneeId: employee._id,
      assigneeName: employee.fullName,
      assigneeType: 'employee',
      status: 'pending',
      completionPercent: 0,
    })

    for (let i = 0; i < CHECKLIST.length; i++) {
      await TaskChecklist.create({
        taskId: task._id,
        title: CHECKLIST[i],
        completed: false,
        order: i,
      })
    }
    console.log(`✓ Created task: ${TASK_TITLE}`)
  } else {
    const assignment = await TaskAssignment.findOne({
      taskId: task._id,
      assigneeId: employee._id,
      removedAt: null,
    })
    if (!assignment) {
      await TaskAssignment.create({
        taskId: task._id,
        assigneeId: employee._id,
        assigneeName: employee.fullName,
        assigneeType: 'employee',
        status: 'pending',
        completionPercent: 0,
      })
      console.log('✓ Re-assigned existing task to sample employee')
    } else {
      console.log(`· Task already exists: ${TASK_TITLE}`)
    }
  }

  const empPassword = process.env.HR_SAMPLE_PASSWORD || 'employeenepatronix'
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  console.log('\n── Employee login (localhost) ──')
  console.log(`URL:        ${base}/hr/login`)
  console.log('Department: Nepatronix')
  console.log(`Email:      ${EMP_EMAIL}`)
  console.log(`Password:   ${empPassword}`)
  console.log('\n── Assigned task ──')
  console.log(`Open:       ${base}/hr/tasks?task=${task._id}`)
  console.log('Steps:      Login → Tasks → open task → Plan & Checklist → tick items')

  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
