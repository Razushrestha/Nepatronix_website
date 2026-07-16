'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'
import { useHrPaths } from '@/lib/hr/ui-context'

type Employee = {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone?: string
  department: string
  position: string
  employmentType: string
  role: string
  monthlyPay?: number
  isStipend?: boolean
  citizenshipNumber?: string
  nidNumber?: string
  panNumber?: string
  bankName?: string
  bankAccount?: string
  scheduledHoursPerDay?: number
  scheduledStart?: string
  scheduledEnd?: string
  scheduledDays?: string[]
  totalWorkingDays?: number
  totalWorkingHours?: number
  hoursPerDay?: number
  active?: boolean
  status?: string
}

function Detail({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="py-2">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-slate-900 mt-0.5">{value != null && value !== '' ? String(value) : '—'}</p>
    </div>
  )
}

export default function HrViewEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const paths = useHrPaths()
  const [emp, setEmp] = useState<Employee | null>(null)
  const [monthLabel, setMonthLabel] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/hr/employees/${id}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        setEmp(d.employee || null)
        setMonthLabel(d.month || '')
      })
  }, [id])

  async function remove() {
    if (!emp || !confirm(`Remove ${emp.fullName}? They will be deactivated and hidden from the active list.`)) return
    setDeleting(true)
    const res = await fetch(`/api/hr/employees/${id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (res.ok) router.push(paths.employees)
    else setDeleting(false)
  }

  if (!emp) return <div className="p-8 text-slate-500">Loading…</div>

  const dept = HR_DEPARTMENTS.find((d) => d.value === emp.department)?.label || emp.department

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={paths.employees} className="text-sm text-[#C1121F] hover:underline">← All employees</Link>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-red-900/20">
              {emp.fullName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{emp.fullName}</h1>
              <p className="text-sm text-slate-500">{emp.position} · <span className="font-mono">{emp.employeeCode}</span></p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={paths.employeeEdit(id)} className="hr-btn">Edit</Link>
          <Link href={paths.attendanceEmployee(id)} className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
            Attendance
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Removing…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['Salary', emp.monthlyPay && emp.monthlyPay > 0 ? `NPR ${emp.monthlyPay.toLocaleString('en-NP')}` : '—'],
          ['Work days', emp.totalWorkingDays != null ? `${emp.totalWorkingDays} (${monthLabel || 'this month'})` : '—'],
          ['Work hours', emp.totalWorkingHours != null ? `${emp.totalWorkingHours} hrs` : '—'],
          ['Per day', emp.hoursPerDay ? `${emp.hoursPerDay}h` : '—'],
        ].map(([label, val]) => (
          <div key={String(label)} className="hr-card py-3">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">{label}</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="hr-card">
          <h2 className="font-semibold text-slate-900 mb-3">Work details</h2>
          <Detail label="Department" value={dept} />
          <Detail label="Employment type" value={emp.employmentType?.replace(/_/g, ' ')} />
          <Detail label="Role" value={emp.role?.replace(/_/g, ' ')} />
          <Detail label="Schedule" value={emp.scheduledStart && emp.scheduledEnd ? `${emp.scheduledStart} – ${emp.scheduledEnd}` : undefined} />
          <Detail label="Status" value={emp.status} />
        </div>
        <div className="hr-card">
          <h2 className="font-semibold text-slate-900 mb-3">Contact</h2>
          <Detail label="Email" value={emp.email} />
          <Detail label="Phone" value={emp.phone} />
        </div>
        <div className="hr-card">
          <h2 className="font-semibold text-slate-900 mb-3">Identity</h2>
          <Detail label="Citizenship" value={emp.citizenshipNumber} />
          <Detail label="NID" value={emp.nidNumber} />
          <Detail label="PAN" value={emp.panNumber} />
        </div>
        <div className="hr-card">
          <h2 className="font-semibold text-slate-900 mb-3">Payroll</h2>
          <Detail label="Bank" value={emp.bankName} />
          <Detail label="Account" value={emp.bankAccount} />
          <Detail label="Pay type" value={emp.isStipend ? 'Stipend' : 'Salary'} />
        </div>
      </div>
    </div>
  )
}
