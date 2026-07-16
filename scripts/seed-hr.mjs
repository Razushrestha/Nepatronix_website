/**
 * Seed HR portal: office settings + super HR admin + sample manager.
 * Usage: npm run seed:hr
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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

const HrEmployeeSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, unique: true },
    department: String,
    fullName: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: String,
    position: String,
    managerId: mongoose.Schema.Types.ObjectId,
    employmentType: { type: String, default: 'full_time' },
    scheduledDays: [String],
    scheduledStart: { type: String, default: '10:00' },
    scheduledEnd: { type: String, default: '18:00' },
    scheduledHoursPerDay: { type: Number, default: 8 },
    monthlyPay: { type: Number, default: 0 },
    isStipend: Boolean,
    paidLeaveEligible: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
)

const HrOfficeSettingsSchema = new mongoose.Schema(
  {
    startTime: { type: String, default: '10:00' },
    endTime: { type: String, default: '18:00' },
    graceMinutes: { type: Number, default: 0 },
    latitude: { type: Number, default: 27.6858125 },
    longitude: { type: Number, default: 85.3165781 },
    radiusMeters: { type: Number, default: 150 },
    allowedIps: {
      type: [String],
      default: [
        '127.0.0.1',
        '::1',
        '192.168.2.*',
        '192.168.2.254',
        '2400:1a00:4b2b:*',
        '2400:1a00:4b2b:6bc9:e551:175:f19c:bc16',
      ],
    },
    officeName: String,
    attendanceStartDate: { type: String, default: '2026-07-17' },
  },
  { timestamps: true }
)

const HrLeaveBalanceSchema = new mongoose.Schema({
  employeeId: mongoose.Schema.Types.ObjectId,
  year: Number,
  annual: Number,
  sick: Number,
  casual: Number,
  annualUsed: { type: Number, default: 0 },
  sickUsed: { type: Number, default: 0 },
  casualUsed: { type: Number, default: 0 },
})

const HrTaskSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'HrEmployee', index: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    dueDate: String,
    assignedBy: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
  },
  { timestamps: true }
)

async function main() {
  await mongoose.connect(URI)
  const HrEmployee = mongoose.models.HrEmployee || mongoose.model('HrEmployee', HrEmployeeSchema)
  const HrOfficeSettings =
    mongoose.models.HrOfficeSettings || mongoose.model('HrOfficeSettings', HrOfficeSettingsSchema)
  const HrLeaveBalance =
    mongoose.models.HrLeaveBalance || mongoose.model('HrLeaveBalance', HrLeaveBalanceSchema)
  const HrTask = mongoose.models.HrTask || mongoose.model('HrTask', HrTaskSchema)
  const HrAttendance =
    mongoose.models.HrAttendance ||
    mongoose.model(
      'HrAttendance',
      new mongoose.Schema({
        employeeId: mongoose.Schema.Types.ObjectId,
        date: String,
        status: String,
        lateDeduction: Number,
      })
    )

  const attendanceStartDate = process.env.HR_ATTENDANCE_START_DATE || '2026-07-17'

  await HrOfficeSettings.findOneAndUpdate(
    {},
    {
      $set: {
        officeName: 'Nepatronix Office — Tinkune, Kathmandu',
        graceMinutes: 0,
        latitude: 27.6858125,
        longitude: 85.3165781,
        radiusMeters: 150,
        attendanceStartDate,
        allowedIps: [
          '127.0.0.1',
          '::1',
          '192.168.2.*',
          '192.168.2.254',
          '2400:1a00:4b2b:*',
          '2400:1a00:4b2b:6bc9:e551:175:f19c:bc16',
        ],
      },
    },
    { upsert: true }
  )
  console.log(`✓ Office settings synced (attendance starts ${attendanceStartDate})`)

  const removed = await HrAttendance.deleteMany({ date: { $lt: attendanceStartDate } })
  if (removed.deletedCount) {
    console.log(`✓ Cleared ${removed.deletedCount} pre-start attendance record(s)`)
  }

  const hrEmail = process.env.HR_ADMIN_EMAIL || 'hr@nepatronix.org'
  const hrPassword = process.env.HR_ADMIN_PASSWORD || 'hradminnepatronix'
  const hash = await bcrypt.hash(hrPassword, 10)

  let hrAdmin = await HrEmployee.findOne({ email: hrEmail })
  if (!hrAdmin) {
    hrAdmin = await HrEmployee.create({
      employeeCode: 'NPT-HR001',
      department: 'nepatronix',
      fullName: 'Nepatronix HR Admin',
      email: hrEmail,
      passwordHash: hash,
      role: 'super_hr_admin',
      position: 'HR Administrator',
      employmentType: 'full_time',
      monthlyPay: 0,
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      paidLeaveEligible: true,
    })
    await HrLeaveBalance.create({
      employeeId: hrAdmin._id,
      year: new Date().getFullYear(),
      annual: 18,
      sick: 12,
      casual: 6,
    })
    console.log(`✓ HR admin created: ${hrEmail} / ${hrPassword}`)
  } else {
    await HrEmployee.updateOne({ _id: hrAdmin._id }, { $set: { passwordHash: hash, active: true, status: 'active' } })
    console.log(`· HR admin already exists — password synced: ${hrEmail}`)
  }

  const mgrEmail = process.env.HR_MANAGER_EMAIL || 'manager@nepatronix.org'
  const mgrPassword = process.env.HR_MANAGER_PASSWORD || 'managernepatronix'
  let manager = await HrEmployee.findOne({ email: mgrEmail })
  if (!manager) {
    manager = await HrEmployee.create({
      employeeCode: 'NPT-MGR001',
      department: 'nepatronix',
      fullName: 'Sample Manager',
      email: mgrEmail,
      passwordHash: await bcrypt.hash(mgrPassword, 10),
      role: 'manager',
      position: 'Operations Manager',
      employmentType: 'full_time',
      monthlyPay: 50000,
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    })
    await HrLeaveBalance.create({
      employeeId: manager._id,
      year: new Date().getFullYear(),
      annual: 18,
      sick: 12,
      casual: 6,
    })
    console.log(`✓ Manager created: ${mgrEmail}`)
  } else {
    await HrEmployee.updateOne(
      { _id: manager._id },
      { $set: { passwordHash: await bcrypt.hash(mgrPassword, 10), active: true, status: 'active' } }
    )
    console.log(`· Manager already exists — password synced: ${mgrEmail}`)
  }

  const empEmail = process.env.HR_SAMPLE_EMAIL || 'employee@nepatronix.org'
  const empPassword = process.env.HR_SAMPLE_PASSWORD || 'employeenepatronix'
  const existingEmp = await HrEmployee.findOne({ email: empEmail })
  let sampleEmployee = existingEmp
  if (!existingEmp) {
    sampleEmployee = await HrEmployee.create({
      employeeCode: 'NPT-EMP001',
      department: 'nepatronix',
      fullName: 'Sample Employee',
      email: empEmail,
      passwordHash: await bcrypt.hash(empPassword, 10),
      role: 'employee',
      position: 'STEM Trainer',
      employmentType: 'full_time',
      managerId: manager?._id,
      monthlyPay: 35000,
      phone: '9800000001',
      bankName: 'Nepal Bank',
      bankAccount: '00123456789',
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    })
    await HrLeaveBalance.create({
      employeeId: sampleEmployee._id,
      year: new Date().getFullYear(),
      annual: 18,
      sick: 12,
      casual: 6,
    })
    console.log(`✓ Sample employee: ${empEmail}`)
  } else if (manager) {
    await HrEmployee.updateOne(
      { email: empEmail },
      {
        $set: {
          managerId: manager._id,
          phone: existingEmp.phone || '9800000001',
          bankName: existingEmp.bankName || 'Nepal Bank',
          bankAccount: existingEmp.bankAccount || '00123456789',
          passwordHash: await bcrypt.hash(empPassword, 10),
          active: true,
          status: 'active',
        },
      }
    )
    sampleEmployee = await HrEmployee.findOne({ email: empEmail })
    console.log(`✓ Sample employee manager link ensured`)
    const bal = await HrLeaveBalance.findOne({ employeeId: existingEmp._id, year: new Date().getFullYear() })
    if (!bal) {
      await HrLeaveBalance.create({
        employeeId: existingEmp._id,
        year: new Date().getFullYear(),
        annual: 18,
        sick: 12,
        casual: 6,
      })
      console.log(`✓ Leave balance created for sample employee`)
    }
  }

  if (sampleEmployee && manager) {
    const taskCount = await HrTask.countDocuments({ employeeId: sampleEmployee._id })
    if (taskCount === 0) {
      const due = new Date()
      due.setDate(due.getDate() + 7)
      const dueStr = due.toISOString().slice(0, 10)
      await HrTask.insertMany([
        {
          employeeId: sampleEmployee._id,
          title: 'Complete onboarding checklist',
          description: 'Review handbook, sign policies, and submit ID copies to HR.',
          status: 'pending',
          dueDate: dueStr,
          assignedBy: manager._id,
        },
        {
          employeeId: sampleEmployee._id,
          title: 'Prepare weekly class report',
          description: 'Submit attendance and progress summary every Friday.',
          status: 'in_progress',
          dueDate: dueStr,
          assignedBy: manager._id,
        },
      ])
      console.log('✓ Sample tasks created for employee')
    } else {
      console.log(`· Sample tasks already exist (${taskCount})`)
    }
  }

  const stemEmail = process.env.HR_STEM_EMAIL || 'deepakstha00000@gmail.com'
  const stemPassword = process.env.HR_STEM_PASSWORD || 'stememployeenepatronix'
  let stemEmployee = await HrEmployee.findOne({ email: stemEmail })
  if (!stemEmployee) {
    const sinCount = await HrEmployee.countDocuments({ department: 'stem-innovation-nepal' })
    stemEmployee = await HrEmployee.create({
      employeeCode: `SIN-${String(sinCount + 1).padStart(3, '0')}`,
      department: 'stem-innovation-nepal',
      fullName: 'Deepak Shrestha',
      email: stemEmail,
      passwordHash: await bcrypt.hash(stemPassword, 10),
      role: 'employee',
      position: 'STEM Innovation Staff',
      employmentType: 'full_time',
      managerId: manager?._id,
      monthlyPay: 35000,
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      paidLeaveEligible: true,
      active: true,
      status: 'active',
    })
    await HrLeaveBalance.create({
      employeeId: stemEmployee._id,
      year: new Date().getFullYear(),
      annual: 18,
      sick: 12,
      casual: 6,
    })
    console.log(`✓ STEM employee created: ${stemEmail} (no GPS required)`)
  } else {
    await HrEmployee.updateOne(
      { _id: stemEmployee._id },
      {
        $set: {
          department: 'stem-innovation-nepal',
          fullName: stemEmployee.fullName || 'Deepak Shrestha',
          managerId: manager?._id,
          passwordHash: await bcrypt.hash(stemPassword, 10),
          active: true,
          status: 'active',
        },
      }
    )
    console.log(`✓ STEM employee synced: ${stemEmail} → stem-innovation-nepal (no GPS)`)
  }

  console.log('\nHR portal: http://localhost:3000/hr/login')
  console.log('Attendance: http://localhost:3000/attendance')
  console.log('STEM Innovation Nepal staff: office Wi‑Fi only — no GPS')
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
