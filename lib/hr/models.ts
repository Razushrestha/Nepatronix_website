import mongoose, { Schema, model, models, type Model } from 'mongoose'
import type { EmploymentType, HrDepartment, HrRole, LeaveStatus, LeaveType, Weekday } from './constants'

function makeModel<T>(name: string, schema: Schema): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema)
}

const AddressSchema = new Schema(
  {
    line1: String,
    line2: String,
    city: String,
    district: String,
    province: String,
  },
  { _id: false }
)

const EmergencyContactSchema = new Schema(
  {
    name: String,
    relation: String,
    phone: String,
  },
  { _id: false }
)

export interface HrEmployeeDoc {
  _id: mongoose.Types.ObjectId
  employeeCode: string
  department: HrDepartment
  fullName: string
  fullNameNepali?: string
  email: string
  phone?: string
  passwordHash: string
  role: HrRole
  position: string
  employmentType: EmploymentType
  joinDate?: Date
  contractEndDate?: Date
  managerId?: mongoose.Types.ObjectId
  status: 'active' | 'resigned' | 'terminated'
  dateOfBirth?: Date
  gender?: string
  citizenshipNumber?: string
  nidNumber?: string
  panNumber?: string
  permanentAddress?: { line1?: string; line2?: string; city?: string; district?: string; province?: string }
  currentAddress?: { line1?: string; line2?: string; city?: string; district?: string; province?: string }
  emergencyContact?: { name?: string; relation?: string; phone?: string }
  scheduledDays: Weekday[]
  scheduledStart: string
  scheduledEnd: string
  scheduledHoursPerDay: number
  monthlyPay: number
  isStipend: boolean
  bankName?: string
  bankAccount?: string
  paidLeaveEligible: boolean
  lastLoginAt?: Date
  active: boolean
}

const HrEmployeeSchema = new Schema<HrEmployeeDoc>(
  {
    employeeCode: { type: String, required: true, unique: true, trim: true },
    department: {
      type: String,
      enum: ['nepatronix', 'stem-innovation-nepal', 'metatronix'],
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    fullNameNepali: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['employee', 'manager', 'hr_staff', 'super_hr_admin'],
      default: 'employee',
    },
    position: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'intern', 'trainee'],
      default: 'full_time',
    },
    joinDate: Date,
    contractEndDate: Date,
    managerId: { type: Schema.Types.ObjectId, ref: 'HrEmployee' },
    status: { type: String, enum: ['active', 'resigned', 'terminated'], default: 'active' },
    dateOfBirth: Date,
    gender: String,
    citizenshipNumber: String,
    nidNumber: String,
    panNumber: String,
    permanentAddress: { type: AddressSchema, default: undefined },
    currentAddress: { type: AddressSchema, default: undefined },
    emergencyContact: { type: EmergencyContactSchema, default: undefined },
    scheduledDays: {
      type: [String],
      default: ['mon', 'tue', 'wed', 'thu', 'fri'],
    },
    scheduledStart: { type: String, default: '10:00' },
    scheduledEnd: { type: String, default: '18:00' },
    scheduledHoursPerDay: { type: Number, default: 8 },
    monthlyPay: { type: Number, default: 0 },
    isStipend: { type: Boolean, default: false },
    bankName: String,
    bankAccount: String,
    paidLeaveEligible: { type: Boolean, default: true },
    lastLoginAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const HrEmployee = makeModel<HrEmployeeDoc>('HrEmployee', HrEmployeeSchema)

export interface HrOfficeSettingsDoc {
  _id: mongoose.Types.ObjectId
  startTime: string
  endTime: string
  graceMinutes: number
  latitude: number
  longitude: number
  radiusMeters: number
  allowedIps: string[]
  officeName: string
}

const HrOfficeSettingsSchema = new Schema<HrOfficeSettingsDoc>(
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
    officeName: { type: String, default: 'Nepatronix Office — Tinkune' },
  },
  { timestamps: true }
)

export const HrOfficeSettings = makeModel<HrOfficeSettingsDoc>(
  'HrOfficeSettings',
  HrOfficeSettingsSchema
)

export interface HrAttendanceDoc {
  _id: mongoose.Types.ObjectId
  employeeId: mongoose.Types.ObjectId
  department: HrDepartment
  date: string
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'weekly_off' | 'holiday'
  scheduledStart: string
  scheduledEnd: string
  checkIn?: Date
  checkOut?: Date
  lateMinutes: number
  lateDeduction: number
  checkInIp?: string
  checkInLat?: number
  checkInLng?: number
  checkInAccuracy?: number
  checkOutIp?: string
  checkOutLat?: number
  checkOutLng?: number
  manualOverride?: boolean
  overrideReason?: string
}

const HrAttendanceSchema = new Schema<HrAttendanceDoc>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true, index: true },
    department: { type: String, required: true },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'half_day', 'leave', 'weekly_off', 'holiday'],
      default: 'absent',
    },
    scheduledStart: { type: String, default: '10:00' },
    scheduledEnd: { type: String, default: '18:00' },
    checkIn: Date,
    checkOut: Date,
    lateMinutes: { type: Number, default: 0 },
    lateDeduction: { type: Number, default: 0 },
    checkInIp: String,
    checkInLat: Number,
    checkInLng: Number,
    checkInAccuracy: Number,
    checkOutIp: String,
    checkOutLat: Number,
    checkOutLng: Number,
    manualOverride: Boolean,
    overrideReason: String,
  },
  { timestamps: true }
)
HrAttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

export const HrAttendance = makeModel<HrAttendanceDoc>('HrAttendance', HrAttendanceSchema)

export interface HrLeaveRequestDoc {
  _id: mongoose.Types.ObjectId
  employeeId: mongoose.Types.ObjectId
  department: HrDepartment
  leaveType: LeaveType
  fromDate: string
  toDate: string
  halfDay?: 'am' | 'pm'
  reason: string
  attachmentUrl?: string
  status: LeaveStatus
  managerApprovedAt?: Date
  managerApprovedBy?: mongoose.Types.ObjectId
  managerComment?: string
  hrApprovedAt?: Date
  hrApprovedBy?: mongoose.Types.ObjectId
  hrComment?: string
  rejectedBy?: mongoose.Types.ObjectId
  rejectionReason?: string
  totalDays: number
}

const HrLeaveRequestSchema = new Schema<HrLeaveRequestDoc>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true, index: true },
    department: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ['annual', 'sick', 'casual', 'unpaid'],
      required: true,
    },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    halfDay: { type: String, enum: ['am', 'pm'] },
    reason: { type: String, required: true },
    attachmentUrl: String,
    status: {
      type: String,
      enum: ['pending_manager', 'pending_hr', 'approved', 'rejected', 'cancelled'],
      default: 'pending_manager',
    },
    managerApprovedAt: Date,
    managerApprovedBy: { type: Schema.Types.ObjectId, ref: 'HrEmployee' },
    managerComment: String,
    hrApprovedAt: Date,
    hrApprovedBy: { type: Schema.Types.ObjectId, ref: 'HrEmployee' },
    hrComment: String,
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'HrEmployee' },
    rejectionReason: String,
    totalDays: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export const HrLeaveRequest = makeModel<HrLeaveRequestDoc>('HrLeaveRequest', HrLeaveRequestSchema)

export interface HrLeaveBalanceDoc {
  _id: mongoose.Types.ObjectId
  employeeId: mongoose.Types.ObjectId
  year: number
  annual: number
  sick: number
  casual: number
  annualUsed: number
  sickUsed: number
  casualUsed: number
}

const HrLeaveBalanceSchema = new Schema<HrLeaveBalanceDoc>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true },
    year: { type: Number, required: true },
    annual: { type: Number, default: 18 },
    sick: { type: Number, default: 12 },
    casual: { type: Number, default: 6 },
    annualUsed: { type: Number, default: 0 },
    sickUsed: { type: Number, default: 0 },
    casualUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
)
HrLeaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true })

export const HrLeaveBalance = makeModel<HrLeaveBalanceDoc>('HrLeaveBalance', HrLeaveBalanceSchema)

export interface HrHolidayDoc {
  _id: mongoose.Types.ObjectId
  date: string
  name: string
  description?: string
}

const HrHolidaySchema = new Schema<HrHolidayDoc>(
  {
    date: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
)

export const HrHoliday = makeModel<HrHolidayDoc>('HrHoliday', HrHolidaySchema)

export type HrTaskStatus = 'pending' | 'in_progress' | 'completed'

export interface HrTaskDoc {
  _id: mongoose.Types.ObjectId
  employeeId: mongoose.Types.ObjectId
  title: string
  description?: string
  status: HrTaskStatus
  dueDate?: string
  assignedBy?: mongoose.Types.ObjectId
  completedAt?: Date
}

const HrTaskSchema = new Schema<HrTaskDoc>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'HrEmployee', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    dueDate: String,
    assignedBy: { type: Schema.Types.ObjectId, ref: 'HrEmployee' },
    completedAt: Date,
  },
  { timestamps: true }
)

export const HrTask = makeModel<HrTaskDoc>('HrTask', HrTaskSchema)

export async function getOfficeSettings(): Promise<HrOfficeSettingsDoc> {
  let doc = await HrOfficeSettings.findOne().lean<HrOfficeSettingsDoc>()
  if (!doc) {
    const created = await HrOfficeSettings.create({})
    doc = created.toObject() as HrOfficeSettingsDoc
  }
  return doc
}

export function sanitizeEmployee(emp: HrEmployeeDoc, includePay = false) {
  const base = {
    id: String(emp._id),
    employeeCode: emp.employeeCode,
    department: emp.department,
    fullName: emp.fullName,
    fullNameNepali: emp.fullNameNepali,
    email: emp.email,
    phone: emp.phone,
    role: emp.role,
    position: emp.position,
    employmentType: emp.employmentType,
    joinDate: emp.joinDate,
    contractEndDate: emp.contractEndDate,
    managerId: emp.managerId ? String(emp.managerId) : undefined,
    status: emp.status,
    scheduledDays: emp.scheduledDays,
    scheduledStart: emp.scheduledStart,
    scheduledEnd: emp.scheduledEnd,
    scheduledHoursPerDay: emp.scheduledHoursPerDay,
    paidLeaveEligible: emp.paidLeaveEligible,
    active: emp.active,
  }
  if (!includePay) return base
  return {
    ...base,
    monthlyPay: emp.monthlyPay,
    isStipend: emp.isStipend,
    bankName: emp.bankName,
    bankAccount: emp.bankAccount,
    citizenshipNumber: emp.citizenshipNumber,
    nidNumber: emp.nidNumber,
    panNumber: emp.panNumber,
    dateOfBirth: emp.dateOfBirth,
    gender: emp.gender,
    permanentAddress: emp.permanentAddress,
    currentAddress: emp.currentAddress,
    emergencyContact: emp.emergencyContact,
  }
}
