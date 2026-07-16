'use client'

import { useEffect, useState } from 'react'

export default function HrManageSettingsPage() {
  const [form, setForm] = useState({
    officeName: '',
    startTime: '10:00',
    endTime: '18:00',
    graceMinutes: '0',
    latitude: '',
    longitude: '',
    radiusMeters: '150',
    allowedIps: '',
    attendanceStartDate: '2026-07-17',
  })
  const [msg, setMsg] = useState('')
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    fetch('/api/hr/settings', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        setCanEdit(!!d.canEdit)
        setForm({
          officeName: d.officeName || '',
          startTime: d.startTime || '10:00',
          endTime: d.endTime || '18:00',
          graceMinutes: String(d.graceMinutes ?? 0),
          latitude: String(d.latitude ?? ''),
          longitude: String(d.longitude ?? ''),
          radiusMeters: String(d.radiusMeters ?? 150),
          allowedIps: Array.isArray(d.allowedIps) ? d.allowedIps.join('\n') : '',
          attendanceStartDate: d.attendanceStartDate || '2026-07-17',
        })
      })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!canEdit) return
    const res = await fetch('/api/hr/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        officeName: form.officeName,
        startTime: form.startTime,
        endTime: form.endTime,
        graceMinutes: Number(form.graceMinutes),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radiusMeters: Number(form.radiusMeters),
        allowedIps: form.allowedIps.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
        attendanceStartDate: form.attendanceStartDate,
      }),
    })
    setMsg(res.ok ? 'Settings saved' : 'Save failed')
  }

  if (!canEdit) {
    return <div className="p-8 text-slate-500">HR admin access required.</div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Office settings</h1>
      <form onSubmit={save} className="hr-card space-y-4">
        <input className="hr-input" placeholder="Office name" value={form.officeName} onChange={(e) => setForm({ ...form, officeName: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className="hr-input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <input className="hr-input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="hr-input" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          <input className="hr-input" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        </div>
        <input className="hr-input" placeholder="GPS radius (m)" value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })} />
        <label className="block text-sm font-medium text-slate-700">
          Attendance start date
          <input
            type="date"
            className="hr-input mt-1"
            value={form.attendanceStartDate}
            onChange={(e) => setForm({ ...form, attendanceStartDate: e.target.value })}
          />
        </label>
        <p className="text-xs text-slate-500">Days before this date are ignored for check-in, late deductions, and payroll. Set to Shrawan 1 when launching attendance.</p>
        <textarea
          className="hr-input"
          rows={4}
          placeholder="Allowed office IPs (one per line)"
          value={form.allowedIps}
          onChange={(e) => setForm({ ...form, allowedIps: e.target.value })}
        />
        <p className="text-xs text-slate-500">Env overrides: HR_ALLOWED_IPS, HR_OFFICE_LAT, HR_OFFICE_LNG, HR_OFFICE_RADIUS_M, HR_ATTENDANCE_START_DATE</p>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button type="submit" className="hr-btn">Save settings</button>
      </form>
    </div>
  )
}
