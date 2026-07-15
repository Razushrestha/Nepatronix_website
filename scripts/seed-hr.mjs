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
    latitude: { type: Number, default: 27.6869 },
    longitude: { type: Number, default: 85.3462 },
    radiusMeters: { type: Number, default: 150 },
    allowedIps: { type: [String], default: ['127.0.0.1', '::1'] },
    officeName: String,
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

async function main() {
  await mongoose.connect(URI)
  const HrEmployee = mongoose.models.HrEmployee || mongoose.model('HrEmployee', HrEmployeeSchema)
  const HrOfficeSettings =
    mongoose.models.HrOfficeSettings || mongoose.model('HrOfficeSettings', HrOfficeSettingsSchema)
  const HrLeaveBalance =
    mongoose.models.HrLeaveBalance || mongoose.model('HrLeaveBalance', HrLeaveBalanceSchema)

  if (!(await HrOfficeSettings.findOne())) {
    await HrOfficeSettings.create({
      officeName: 'Nepatronix Office — Tinkune, Kathmandu',
      graceMinutes: 0,
      allowedIps: ['127.0.0.1', '::1'],
    })
    console.log('✓ Office settings created')
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
    console.log(`· HR admin already exists: ${hrEmail}`)
  }

  const mgrEmail = process.env.HR_MANAGER_EMAIL || 'manager@nepatronix.org'
  let manager = await HrEmployee.findOne({ email: mgrEmail })
  if (!manager) {
    manager = await HrEmployee.create({
      employeeCode: 'NPT-MGR001',
      department: 'nepatronix',
      fullName: 'Sample Manager',
      email: mgrEmail,
      passwordHash: await bcrypt.hash(process.env.HR_MANAGER_PASSWORD || 'managernepatronix', 10),
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
  }

  const empEmail = process.env.HR_SAMPLE_EMAIL || 'employee@nepatronix.org'
  const existingEmp = await HrEmployee.findOne({ email: empEmail })
  if (!existingEmp) {
    const emp = await HrEmployee.create({
      employeeCode: 'NPT-EMP001',
      department: 'nepatronix',
      fullName: 'Sample Employee',
      email: empEmail,
      passwordHash: await bcrypt.hash(process.env.HR_SAMPLE_PASSWORD || 'employeenepatronix', 10),
      role: 'employee',
      position: 'STEM Trainer',
      employmentType: 'full_time',
      managerId: manager?._id,
      monthlyPay: 35000,
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    })
    await HrLeaveBalance.create({
      employeeId: emp._id,
      year: new Date().getFullYear(),
      annual: 18,
      sick: 12,
      casual: 6,
    })
    console.log(`✓ Sample employee: ${empEmail}`)
  } else if (manager) {
    await HrEmployee.updateOne({ email: empEmail }, { $set: { managerId: manager._id } })
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

  console.log('\nHR portal: http://localhost:3000/hr/login')
  console.log('Department: Nepatronix for all seed users')
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
