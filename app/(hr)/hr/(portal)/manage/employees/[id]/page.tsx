'use client'

import { useEffect, useState, use } from 'react'
import { EMPLOYMENT_TYPES, HR_DEPARTMENTS, HR_ROLES } from '@/lib/hr/constants'

export default function HrEditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/hr/employees/${id}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setForm(d.employee || {}))
  }, [id])

  function set(key: string, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch(`/api/hr/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error || 'Failed')
    else setSaved(true)
  }

  if (!form.id) return <div className="p-8 text-slate-500">Loading…</div>

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit {String(form.fullName)}</h1>
      <p className="text-sm text-slate-500 mb-6 font-mono">{String(form.employeeCode)}</p>
      <form onSubmit={save} className="hr-card space-y-4">
        <input className="hr-input" value={String(form.fullName || '')} onChange={(e) => set('fullName', e.target.value)} />
        <input className="hr-input" value={String(form.position || '')} onChange={(e) => set('position', e.target.value)} />
        <select className="hr-input" value={String(form.department || '')} onChange={(e) => set('department', e.target.value)}>
          {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <select className="hr-input" value={String(form.employmentType || '')} onChange={(e) => set('employmentType', e.target.value)}>
          {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="hr-input" value={String(form.role || '')} onChange={(e) => set('role', e.target.value)}>
          {HR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <input className="hr-input" type="number" placeholder="Monthly pay" value={String(form.monthlyPay ?? '')} onChange={(e) => set('monthlyPay', Number(e.target.value))} />
        <input className="hr-input" placeholder="Citizenship" value={String(form.citizenshipNumber || '')} onChange={(e) => set('citizenshipNumber', e.target.value)} />
        <input className="hr-input" placeholder="NID" value={String(form.nidNumber || '')} onChange={(e) => set('nidNumber', e.target.value)} />
        <input className="hr-input" placeholder="PAN" value={String(form.panNumber || '')} onChange={(e) => set('panNumber', e.target.value)} />
        <input className="hr-input" type="password" placeholder="New password (leave blank to keep)" onChange={(e) => set('password', e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {saved && <p className="text-green-700 text-sm">Saved.</p>}
        <button type="submit" className="hr-btn">Save changes</button>
      </form>
    </div>
  )
}
