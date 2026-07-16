'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EMPLOYMENT_TYPES, HR_DEPARTMENTS, HR_ROLES } from '@/lib/hr/constants'
import { useHrPaths } from '@/lib/hr/ui-context'

const WEEKDAYS = [
  { v: 'mon', l: 'Mon' }, { v: 'tue', l: 'Tue' }, { v: 'wed', l: 'Wed' },
  { v: 'thu', l: 'Thu' }, { v: 'fri', l: 'Fri' },
]

const TUTOR_OFF_OPTIONS = [
  { v: 'sun', l: 'Sunday' }, { v: 'mon', l: 'Monday' }, { v: 'tue', l: 'Tuesday' },
  { v: 'wed', l: 'Wednesday' }, { v: 'thu', l: 'Thursday' }, { v: 'fri', l: 'Friday' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function HrEditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const paths = useHrPaths()
  const [managers, setManagers] = useState<{ id: string; fullName: string; employeeCode: string }[]>([])
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/hr/employees?includeInactive=true', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) =>
        setManagers(
          (d.employees || []).filter(
            (e: { id: string; role: string }) =>
              e.id !== id && (e.role === 'manager' || e.role === 'hr_staff' || e.role === 'super_hr_admin')
          )
        )
      )
    fetch(`/api/hr/employees/${id}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setForm(d.employee || {}))
  }, [id])

  function set(key: string, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }))
    setSaved(false)
  }

  function toggleDay(day: string) {
    const days = (form.scheduledDays as string[]) || []
    set(
      'scheduledDays',
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day]
    )
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = { ...form }
    delete payload.id
    delete payload.totalWorkingDays
    delete payload.totalWorkingHours
    delete payload.hoursPerDay
    const res = await fetch(`/api/hr/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || 'Failed')
    else {
      setSaved(true)
      setForm(data.employee || form)
    }
    setLoading(false)
  }

  async function remove() {
    if (!confirm(`Remove ${form.fullName}? They will be deactivated and hidden from the active list.`)) return
    setDeleting(true)
    const res = await fetch(`/api/hr/employees/${id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (res.ok) router.push(paths.employees)
    else {
      const data = await res.json()
      setError(data.error || 'Delete failed')
      setDeleting(false)
    }
  }

  if (!form.id) return <div className="p-8 text-slate-500">Loading…</div>

  const scheduledDays = (form.scheduledDays as string[]) || []

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={paths.employeeView(id)} className="text-sm text-[#C1121F] hover:underline">← Back to profile</Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit employee</h1>
          <p className="text-sm text-slate-500 font-mono">{String(form.employeeCode)}</p>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          {deleting ? 'Removing…' : 'Delete employee'}
        </button>
      </div>

      <form onSubmit={save} className="space-y-6">
        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold text-slate-900">Basic information</h2>
          <Field label="Full name">
            <input className="hr-input" value={String(form.fullName || '')} onChange={(e) => set('fullName', e.target.value)} required />
          </Field>
          <Field label="Email">
            <input className="hr-input" type="email" value={String(form.email || '')} onChange={(e) => set('email', e.target.value)} required />
          </Field>
          <Field label="Phone">
            <input className="hr-input" value={String(form.phone || '')} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Position">
            <input className="hr-input" value={String(form.position || '')} onChange={(e) => set('position', e.target.value)} required />
          </Field>
          <Field label="Department">
            <select className="hr-input" value={String(form.department || '')} onChange={(e) => set('department', e.target.value)}>
              {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="Employment type">
            <select className="hr-input" value={String(form.employmentType || '')} onChange={(e) => set('employmentType', e.target.value)}>
              {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="System role">
            <select className="hr-input" value={String(form.role || '')} onChange={(e) => set('role', e.target.value)}>
              {HR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>
          <Field label="Reporting manager">
            <select className="hr-input" value={String(form.managerId || '')} onChange={(e) => set('managerId', e.target.value || undefined)}>
              <option value="">None</option>
              {managers.map((m) => <option key={m.id} value={m.id}>{m.fullName} ({m.employeeCode})</option>)}
            </select>
          </Field>
        </section>

        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold text-slate-900">Identity (Nepal)</h2>
          <Field label="Citizenship">
            <input className="hr-input" value={String(form.citizenshipNumber || '')} onChange={(e) => set('citizenshipNumber', e.target.value)} />
          </Field>
          <Field label="NID">
            <input className="hr-input" value={String(form.nidNumber || '')} onChange={(e) => set('nidNumber', e.target.value)} />
          </Field>
          <Field label="PAN">
            <input className="hr-input" value={String(form.panNumber || '')} onChange={(e) => set('panNumber', e.target.value)} />
          </Field>
        </section>

        <section className="hr-card grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold text-slate-900">Pay &amp; schedule</h2>
          <Field label="Monthly salary / stipend (NPR)">
            <input className="hr-input" type="number" value={String(form.monthlyPay ?? '')} onChange={(e) => set('monthlyPay', Number(e.target.value))} />
          </Field>
          <Field label="Hours per day">
            <input className="hr-input" type="number" value={String(form.scheduledHoursPerDay ?? 8)} onChange={(e) => set('scheduledHoursPerDay', Number(e.target.value))} />
          </Field>
          <Field label="Bank name">
            <input className="hr-input" value={String(form.bankName || '')} onChange={(e) => set('bankName', e.target.value)} />
          </Field>
          <Field label="Bank account">
            <input className="hr-input" value={String(form.bankAccount || '')} onChange={(e) => set('bankAccount', e.target.value)} />
          </Field>
          {form.employmentType === 'tutor' && (
            <Field label="Tutor weekly off (Saturday is always off)">
              <select
                className="hr-input"
                value={String(form.weeklyOffDay || 'fri')}
                onChange={(e) => set('weeklyOffDay', e.target.value)}
              >
                {TUTOR_OFF_OPTIONS.map((d) => (
                  <option key={d.v} value={d.v}>{d.l}</option>
                ))}
              </select>
            </Field>
          )}
          {form.employmentType === 'part_time' && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-slate-500 mb-2">Fixed work days</p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d.v}
                    type="button"
                    onClick={() => toggleDay(d.v)}
                    className={`px-3 py-1 rounded-lg text-sm border ${scheduledDays.includes(d.v) ? 'bg-[#C1121F] text-white border-[#C1121F]' : 'border-slate-300'}`}
                  >
                    {d.l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="hr-card">
          <Field label="New password (leave blank to keep current)">
            <input className="hr-input" type="password" onChange={(e) => set('password', e.target.value)} />
          </Field>
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-700 text-sm">Changes saved successfully.</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="hr-btn" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
          <Link href={paths.employeeView(id)} className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
