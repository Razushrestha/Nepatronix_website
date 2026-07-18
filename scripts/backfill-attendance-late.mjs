/**
 * Recompute lateMinutes / lateDeduction for all check-ins using Asia/Kathmandu office time.
 * Usage: node scripts/backfill-attendance-late.mjs
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
const OFFICE_TIMEZONE = 'Asia/Kathmandu'

function officeLocalParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: OFFICE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type) => Number(parts.find((p) => p.type === type)?.value || 0)
  return { hours: get('hour'), minutes: get('minute') }
}

function parseTimeToMinutes(time) {
  const [h, m] = String(time || '10:00').split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function calcLateMinutes(checkIn, scheduledStart, graceMinutes = 0) {
  const startMins = parseTimeToMinutes(scheduledStart) + graceMinutes
  const { hours, minutes } = officeLocalParts(checkIn)
  return Math.max(0, hours * 60 + minutes - startMins)
}

function calcLateDeduction(lateMinutes, monthlyPay, workingDays, hoursPerDay) {
  if (lateMinutes <= 0 || workingDays <= 0 || hoursPerDay <= 0) return 0
  const hourlyRate = monthlyPay / (workingDays * hoursPerDay)
  return Math.round((lateMinutes / 60) * hourlyRate * 100) / 100
}

await mongoose.connect(URI)
const attendance = mongoose.connection.db.collection('hrattendances')
const employees = mongoose.connection.db.collection('hremployees')
const settingsCol = mongoose.connection.db.collection('hrofficesettings')

const settings = (await settingsCol.findOne({})) || { startTime: '10:00', graceMinutes: 0 }

const rows = await attendance.find({ checkIn: { $exists: true, $ne: null } }).toArray()
let updated = 0

for (const row of rows) {
  const emp = await employees.findOne({ _id: row.employeeId })
  if (!emp) continue

  const checkIn = row.checkIn instanceof Date ? row.checkIn : new Date(row.checkIn)
  const scheduledStart = row.scheduledStart || emp.scheduledStart || settings.startTime || '10:00'
  const lateMinutes = calcLateMinutes(checkIn, scheduledStart, settings.graceMinutes || 0)
  const workingDays = 22
  const hours = emp.scheduledHoursPerDay || 8
  const lateDeduction = calcLateDeduction(lateMinutes, emp.monthlyPay || 0, workingDays, hours)
  const status =
    row.status === 'leave'
      ? row.status
      : lateMinutes > 120
        ? 'half_day'
        : 'present'

  if (row.lateMinutes === lateMinutes && row.lateDeduction === lateDeduction && row.status === status) continue

  await attendance.updateOne({ _id: row._id }, { $set: { lateMinutes, lateDeduction, status } })
  updated++
  console.log(`✓ ${emp.fullName} ${row.date}: ${lateMinutes} min late, NPR ${lateDeduction}`)
}

console.log(`\nDone. Updated ${updated}/${rows.length} attendance record(s).`)
await mongoose.disconnect()
