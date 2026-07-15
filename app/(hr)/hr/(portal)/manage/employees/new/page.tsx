'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EMPLOYMENT_TYPES, HR_DEPARTMENTS, HR_ROLES } from '@/lib/hr/constants'

const WEEKDAYS = [
  { v: 'mon', l: 'Mon' }, { v: 'tue', l: 'Tue' }, { v: 'wed', l: 'Wed' },
  { v: 'thu', l: 'Thu' }, { v: 'fri', l: 'Fri' },
]

export default function HrNewEmployeePage() {
  const router = useRouter()
  const [managers, setManagers] = useState<{ id: string; fullName: string; employeeCode: string }[]>([])
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', department: 'nepatronix',
    position: '', employmentType: 'full_time', role: 'employee', monthlyPay: '',
    citizenshipNumber: '', nidNumber: '', panNumber: '',
    managerId: '', scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri'] as string[],
    scheduledHoursPerDay: '8', bankName: '', bankAccount: '',
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
        ...form,
        monthlyPay: Number(form.monthlyPay) || 0,
        scheduledHoursPerDay: Number(form.scheduledHoursPerDay) || 8,
        managerId: form.managerId || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed')
      setLoading(false)
      return
    }
    router.push('/hr/manage/employees')
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
          <select className="hr-input" value={form.department} onChange={(e) => set('department', e.target.value)}>
            {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <input className="hr-input" placeholder="Position *" value={form.position} onChange={(e) => set('position', e.target.value)} required />
          <select className="hr-input" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
            {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select className="hr-input" value={form.role} onChange={(e) => set('role', e.target.value)}>
            {HR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
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
          {form.employmentType === 'part_time' && (
            <>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium mb-2">Fixed work days</p>
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
            </>
          )}
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="hr-btn" disabled={loading}>{loading ? 'Creating…' : 'Create employee'}</button>
      </form>
    </div>
  )
}
