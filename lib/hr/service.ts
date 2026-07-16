import { connectToDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import {
  HrEmployee,
  HrLeaveBalance,
  getOfficeSettings,
  type HrEmployeeDoc,
} from './models'
import {
  DEFAULT_OFFICE,
  departmentCode,
  LEAVE_TYPES,
  type EmploymentType,
  type HrDepartment,
  type Weekday,
} from './constants'
import { defaultScheduledDays, scheduledHoursForType } from './attendance-utils'

export async function nextEmployeeCode(department: HrDepartment): Promise<string> {
  await connectToDatabase()
  const prefix = departmentCode(department)
  const existing = await HrEmployee.find({
    employeeCode: { $regex: `^${prefix}-`, $options: 'i' },
  })
    .select('employeeCode')
    .lean()

  let maxNum = 0
  for (const row of existing) {
    const code = row.employeeCode || ''
    const tail = code.slice(prefix.length + 1)
    const digits = tail.match(/\d+/)?.[0]
    if (digits) maxNum = Math.max(maxNum, parseInt(digits, 10))
  }

  for (let n = maxNum + 1; n < maxNum + 50; n++) {
    const candidate = `${prefix}-${String(n).padStart(3, '0')}`
    const taken = await HrEmployee.findOne({ employeeCode: candidate }).select('_id').lean()
    if (!taken) return candidate
  }

  return `${prefix}-${Date.now().toString(36).toUpperCase()}`
}

export async function ensureOfficeSettings() {
  await connectToDatabase()
  const envIps = process.env.HR_ALLOWED_IPS?.split(',').map((s) => s.trim()).filter(Boolean)
  const existing = await getOfficeSettings()
  if (!existing._id) {
    await getOfficeSettings()
  }
  if (envIps?.length) {
    const doc = await getOfficeSettings()
    // env override applied on read in validateAttendanceLocation
    return doc
  }
  return existing
}

export function getEffectiveAllowedIps(settings: { allowedIps: string[] }): string[] {
  const envIps = process.env.HR_ALLOWED_IPS?.split(',').map((s) => s.trim()).filter(Boolean)
  if (envIps?.length) return envIps
  return settings.allowedIps?.length ? settings.allowedIps : DEFAULT_OFFICE.allowedIps
}

export function getEffectiveOfficeCoords(settings: { latitude: number; longitude: number; radiusMeters: number }) {
  return {
    latitude: Number(process.env.HR_OFFICE_LAT) || settings.latitude || DEFAULT_OFFICE.latitude,
    longitude: Number(process.env.HR_OFFICE_LNG) || settings.longitude || DEFAULT_OFFICE.longitude,
    radiusMeters: Number(process.env.HR_OFFICE_RADIUS_M) || settings.radiusMeters || DEFAULT_OFFICE.radiusMeters,
  }
}

export async function createEmployeeWithDefaults(
  input: Partial<HrEmployeeDoc> & {
    fullName: string
    email: string
    password: string
    department: HrDepartment
    position: string
    employmentType: EmploymentType
    monthlyPay: number
  }
): Promise<HrEmployeeDoc> {
  await connectToDatabase()
  const settings = await getOfficeSettings()
  const employmentType = input.employmentType || 'full_time'
  const scheduledDays = (input.scheduledDays?.length
    ? input.scheduledDays
    : defaultScheduledDays(employmentType)) as Weekday[]
  const isStipend = employmentType === 'intern' || employmentType === 'trainee'
  const code = input.employeeCode || (await nextEmployeeCode(input.department))

  const emp = await HrEmployee.create({
    employeeCode: code,
    department: input.department,
    fullName: input.fullName,
    fullNameNepali: input.fullNameNepali,
    email: input.email.toLowerCase().trim(),
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    role: input.role || 'employee',
    position: input.position,
    employmentType,
    joinDate: input.joinDate || new Date(),
    contractEndDate: input.contractEndDate,
    managerId: input.managerId,
    status: 'active',
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    citizenshipNumber: input.citizenshipNumber,
    nidNumber: input.nidNumber,
    panNumber: input.panNumber,
    permanentAddress: input.permanentAddress,
    currentAddress: input.currentAddress,
    emergencyContact: input.emergencyContact,
    scheduledDays,
    scheduledStart: input.scheduledStart || settings.startTime || '10:00',
    scheduledEnd: input.scheduledEnd || settings.endTime || '18:00',
    scheduledHoursPerDay:
      input.scheduledHoursPerDay ||
      scheduledHoursForType(employmentType, input.scheduledHoursPerDay || 4),
    monthlyPay: input.monthlyPay || 0,
    isStipend,
    bankName: input.bankName,
    bankAccount: input.bankAccount,
    paidLeaveEligible:
      input.paidLeaveEligible ?? (employmentType === 'full_time' || employmentType === 'part_time'),
    active: true,
  })

  const year = new Date().getFullYear()
  const annual = LEAVE_TYPES.find((t) => t.value === 'annual')?.defaultDays || 18
  const sick = LEAVE_TYPES.find((t) => t.value === 'sick')?.defaultDays || 12
  const casual = LEAVE_TYPES.find((t) => t.value === 'casual')?.defaultDays || 6
  const paid = emp.paidLeaveEligible
  await HrLeaveBalance.create({
    employeeId: emp._id,
    year,
    annual: paid ? annual : 0,
    sick: paid ? sick : 2,
    casual: paid ? casual : 0,
  })

  return emp.toObject() as HrEmployeeDoc
}

export function countLeaveDays(fromDate: string, toDate: string, halfDay?: string): number {
  if (halfDay) return 0.5
  const start = new Date(fromDate)
  const end = new Date(toDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0
  let days = 0
  const cur = new Date(start)
  while (cur <= end) {
    const wd = cur.getDay()
    if (wd !== 0 && wd !== 6) days++
    cur.setDate(cur.getDate() + 1)
  }
  return days || 1
}
