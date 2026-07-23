'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EMPLOYMENT_TYPES, HR_DEPARTMENTS, HR_ROLES, TUTOR_CHOICE_OFF_DAYS, usesFlexibleSchedule } from '@/lib/hr/constants'
import { useHrPaths } from '@/lib/hr/ui-context'

const WEEKDAYS = [
  { v: 'mon', l: 'Mon' }, { v: 'tue', l: 'Tue' }, { v: 'wed', l: 'Wed' },
  { v: 'thu', l: 'Thu' }, { v: 'fri', l: 'Fri' },
]

const FLEX_SCHEDULE_LABEL: Record<string, string> = {
  part_time: 'Fixed work days',
  freelance: 'Freelance work days',
  project_basis: 'Project work days',
}

const TUTOR_OFF_OPTIONS = [
  { v: 'sun', l: 'Sunday' }, { v: 'mon', l: 'Monday' }, { v: 'tue', l: 'Tuesday' },
  { v: 'wed', l: 'Wednesday' }, { v: 'thu', l: 'Thursday' }, { v: 'fri', l: 'Friday' },
]

export default function HrNewEmployeePage() {
  const router = useRouter()
  const paths = useHrPaths()
  const [managers, setManagers] = useState<{ id: string; fullName: string; employeeCode: string }[]>([])
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', department: 'nepatronix',
    position: '', employmentType: 'full_time', role: 'employee', monthlyPay: '',
    citizenshipNumber: '', nidNumber: '', panNumber: '',
    managerId: '', scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'] as string[],
    weeklyOffDay: 'fri',
    scheduledHoursPerDay: '8', bankName: '', bankAccount: '',
    allowRemoteAttendance: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/hr/employees', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setManagers((d.employees || []).filter((e: { role: string }) => e.role === 'manager' || e.role === 'hr_staff' || e.role === 'super_hr_admin')))
  }, [])

  function set(key: string, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function toggleDay(day: string) {
    setForm((f) => ({
      ...f,
      scheduledDays: f.scheduledDays.includes(day)
        ? f.scheduledDays.filter((d) => d !== day)
        : [...f.scheduledDays, day],
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/hr/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        department: form.department,
        position: form.position.trim(),
        employmentType: form.employmentType,
        role: form.role,
        allowRemoteAttendance: !!form.allowRemoteAttendance,
        monthlyPay: Number(form.monthlyPay) || 0,
        scheduledDays: form.scheduledDays,
        weeklyOffDay: form.employmentType === 'tutor' ? form.weeklyOffDay : undefined,
        scheduledHoursPerDay: Number(form.scheduledHoursPerDay) || 8,
        citizenshipNumber: form.citizenshipNumber.trim() || undefined,
        nidNumber: form.nidNumber.trim() || undefined,
        panNumber: form.panNumber.trim() || undefined,
        bankName: form.bankName.trim() || undefined,
        bankAccount: form.bankAccount.trim() || undefined,
        managerId: form.managerId || undefined,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || `Failed (${res.status})`)
      setLoading(false)
      return
    }
    router.push(paths.employees)
    setLoading(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New employee</h1>
      <form onSubmit={submit} className="space-y-6">
        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold">Basic</h2>
          <input className="hr-input" placeholder="Full name *" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
          <input className="hr-input" type="email" placeholder="Email *" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          <input className="hr-input" type="password" placeholder="Login password *" value={form.password} onChange={(e) => set('password', e.target.value)} required />
          <input className="hr-input" placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <select className="hr-input" value={form.department} onChange={(e) => {
            const dept = e.target.value
            setForm((f) => ({
              ...f,
              department: dept,
              employmentType: dept === 'stem-innovation-nepal' && f.employmentType === 'full_time' ? 'tutor' : f.employmentType,
            }))
          }}>
            {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <input className="hr-input" placeholder="Position *" value={form.position} onChange={(e) => set('position', e.target.value)} required />
          <select className="hr-input" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
            {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select className="hr-input" value={form.role} onChange={(e) => set('role', e.target.value)}>
            {HR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={!!form.allowRemoteAttendance}
              onChange={(e) => set('allowRemoteAttendance', e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-slate-900">Allow remote attendance</span>
              <span className="block text-xs text-slate-500 mt-0.5">
                Check in / out from any location (no office GPS or Wi‑Fi). Use for the CEO.
              </span>
            </span>
          </label>
          <select className="hr-input" value={form.managerId} onChange={(e) => set('managerId', e.target.value)}>
            <option value="">Reporting manager</option>
            {managers.map((m) => <option key={m.id} value={m.id}>{m.fullName} ({m.employeeCode})</option>)}
          </select>
        </section>

        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold">Identity (Nepal)</h2>
          <input className="hr-input" placeholder="Citizenship number" value={form.citizenshipNumber} onChange={(e) => set('citizenshipNumber', e.target.value)} />
          <input className="hr-input" placeholder="NID number" value={form.nidNumber} onChange={(e) => set('nidNumber', e.target.value)} />
          <input className="hr-input" placeholder="PAN number" value={form.panNumber} onChange={(e) => set('panNumber', e.target.value)} />
        </section>

        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold">Pay &amp; schedule</h2>
          <input className="hr-input" type="number" placeholder="Monthly salary / stipend (NPR)" value={form.monthlyPay} onChange={(e) => set('monthlyPay', e.target.value)} />
          <input className="hr-input" placeholder="Bank name" value={form.bankName} onChange={(e) => set('bankName', e.target.value)} />
          <input className="hr-input sm:col-span-2" placeholder="Bank account" value={form.bankAccount} onChange={(e) => set('bankAccount', e.target.value)} />
          {form.employmentType === 'tutor' && (
            <>
              <div className="sm:col-span-2 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-sm text-sky-900">
                STEM tutors work <strong>5 days/week</strong>. <strong>Saturday</strong> is always off. Pick one more weekly off day below.
              </div>
              <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                Tutor weekly off (besides Saturday)
                <select className="hr-input mt-1" value={form.weeklyOffDay} onChange={(e) => set('weeklyOffDay', e.target.value)} required>
                  {TUTOR_OFF_OPTIONS.map((d) => (
                    <option key={d.v} value={d.v}>{d.l}</option>
                  ))}
                </select>
              </label>
              <input className="hr-input" type="number" placeholder="Hours per day" value={form.scheduledHoursPerDay} onChange={(e) => set('scheduledHoursPerDay', e.target.value)} />
            </>
          )}
          {usesFlexibleSchedule(form.employmentType) && (
            <>
              <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600">
                Saturday &amp; Sunday are always off. Pick which weekdays they work.
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium mb-2">{FLEX_SCHEDULE_LABEL[form.employmentType] || 'Work days'}</p>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((d) => (
                    <button
                      key={d.v}
                      type="button"
                      onClick={() => toggleDay(d.v)}
                      className={`px-3 py-1 rounded-lg text-sm border ${form.scheduledDays.includes(d.v) ? 'bg-[#C1121F] text-white border-[#C1121F]' : 'border-slate-300'}`}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
              </div>
              <input className="hr-input" type="number" placeholder="Hours per day" value={form.scheduledHoursPerDay} onChange={(e) => set('scheduledHoursPerDay', e.target.value)} />
              {form.employmentType === 'project_basis' && (
                <p className="sm:col-span-2 text-xs text-slate-500">Set contract end date after creating the employee if the project has a fixed duration.</p>
              )}
            </>
          )}
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="hr-btn" disabled={loading}>{loading ? 'Creating…' : 'Create employee'}</button>
      </form>
    </div>
  )
}
