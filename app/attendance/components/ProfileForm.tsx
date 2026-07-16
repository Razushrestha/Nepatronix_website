'use client'

import { useEffect, useState } from 'react'

type Address = { line1?: string; line2?: string; city?: string; district?: string; province?: string }
type Emergency = { name?: string; relation?: string; phone?: string }

type Profile = {
  fullName: string
  fullNameNepali?: string
  email: string
  employeeCode: string
  phone?: string
  position: string
  department: string
  gender?: string
  dateOfBirth?: string
  citizenshipNumber?: string
  nidNumber?: string
  panNumber?: string
  permanentAddress?: Address
  currentAddress?: Address
  emergencyContact?: Emergency
  bankName?: string
  bankAccount?: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/hr/profile', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { if (d.profile) setProfile(d.profile) })
  }, [])

  function setField<K extends keyof Profile>(key: K, val: Profile[K]) {
    setProfile((p) => (p ? { ...p, [key]: val } : p))
  }

  function setAddress(which: 'permanentAddress' | 'currentAddress', key: keyof Address, val: string) {
    setProfile((p) =>
      p ? { ...p, [which]: { ...(p[which] || {}), [key]: val } } : p
    )
  }

  function setEmergency(key: keyof Emergency, val: string) {
    setProfile((p) =>
      p ? { ...p, emergencyContact: { ...(p.emergencyContact || {}), [key]: val } } : p
    )
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setMsg('')
    setErr('')
    const body: Record<string, unknown> = {
      phone: profile.phone,
      fullNameNepali: profile.fullNameNepali,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth || undefined,
      citizenshipNumber: profile.citizenshipNumber,
      nidNumber: profile.nidNumber,
      panNumber: profile.panNumber,
      permanentAddress: profile.permanentAddress,
      currentAddress: profile.currentAddress,
      emergencyContact: profile.emergencyContact,
      bankName: profile.bankName,
      bankAccount: profile.bankAccount,
    }
    if (password) body.password = password

    const res = await fetch('/api/hr/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) {
      setProfile(data.profile)
      setPassword('')
      setMsg('Profile updated successfully.')
    } else {
      setErr(data.error || 'Update failed')
    }
    setSaving(false)
  }

  if (!profile) {
    return (
      <div className="hr-card py-12 text-center text-slate-500 text-sm">Loading profile…</div>
    )
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Basic information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <input className="hr-input bg-slate-50" value={profile.fullName} readOnly />
          </Field>
          <Field label="Name (Nepali)">
            <input className="hr-input" value={profile.fullNameNepali || ''} onChange={(e) => setField('fullNameNepali', e.target.value)} />
          </Field>
          <Field label="Employee code">
            <input className="hr-input bg-slate-50 font-mono text-sm" value={profile.employeeCode} readOnly />
          </Field>
          <Field label="Work email">
            <input className="hr-input bg-slate-50" value={profile.email} readOnly />
          </Field>
          <Field label="Phone">
            <input className="hr-input" type="tel" value={profile.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
          </Field>
          <Field label="Position">
            <input className="hr-input bg-slate-50" value={profile.position} readOnly />
          </Field>
          <Field label="Gender">
            <select className="hr-input" value={profile.gender || ''} onChange={(e) => setField('gender', e.target.value)}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Date of birth">
            <input
              className="hr-input"
              type="date"
              value={profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : ''}
              onChange={(e) => setField('dateOfBirth', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">ID & documents</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Citizenship no.">
            <input className="hr-input" value={profile.citizenshipNumber || ''} onChange={(e) => setField('citizenshipNumber', e.target.value)} />
          </Field>
          <Field label="NID no.">
            <input className="hr-input" value={profile.nidNumber || ''} onChange={(e) => setField('nidNumber', e.target.value)} />
          </Field>
          <Field label="PAN no.">
            <input className="hr-input" value={profile.panNumber || ''} onChange={(e) => setField('panNumber', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Permanent address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Line 1">
            <input className="hr-input" value={profile.permanentAddress?.line1 || ''} onChange={(e) => setAddress('permanentAddress', 'line1', e.target.value)} />
          </Field>
          <Field label="Line 2">
            <input className="hr-input" value={profile.permanentAddress?.line2 || ''} onChange={(e) => setAddress('permanentAddress', 'line2', e.target.value)} />
          </Field>
          <Field label="City">
            <input className="hr-input" value={profile.permanentAddress?.city || ''} onChange={(e) => setAddress('permanentAddress', 'city', e.target.value)} />
          </Field>
          <Field label="District">
            <input className="hr-input" value={profile.permanentAddress?.district || ''} onChange={(e) => setAddress('permanentAddress', 'district', e.target.value)} />
          </Field>
          <Field label="Province">
            <input className="hr-input" value={profile.permanentAddress?.province || ''} onChange={(e) => setAddress('permanentAddress', 'province', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Current address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Line 1">
            <input className="hr-input" value={profile.currentAddress?.line1 || ''} onChange={(e) => setAddress('currentAddress', 'line1', e.target.value)} />
          </Field>
          <Field label="Line 2">
            <input className="hr-input" value={profile.currentAddress?.line2 || ''} onChange={(e) => setAddress('currentAddress', 'line2', e.target.value)} />
          </Field>
          <Field label="City">
            <input className="hr-input" value={profile.currentAddress?.city || ''} onChange={(e) => setAddress('currentAddress', 'city', e.target.value)} />
          </Field>
          <Field label="District">
            <input className="hr-input" value={profile.currentAddress?.district || ''} onChange={(e) => setAddress('currentAddress', 'district', e.target.value)} />
          </Field>
          <Field label="Province">
            <input className="hr-input" value={profile.currentAddress?.province || ''} onChange={(e) => setAddress('currentAddress', 'province', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Emergency contact</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name">
            <input className="hr-input" value={profile.emergencyContact?.name || ''} onChange={(e) => setEmergency('name', e.target.value)} />
          </Field>
          <Field label="Relation">
            <input className="hr-input" value={profile.emergencyContact?.relation || ''} onChange={(e) => setEmergency('relation', e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="hr-input" type="tel" value={profile.emergencyContact?.phone || ''} onChange={(e) => setEmergency('phone', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Bank details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Bank name">
            <input className="hr-input" value={profile.bankName || ''} onChange={(e) => setField('bankName', e.target.value)} />
          </Field>
          <Field label="Account number">
            <input className="hr-input" value={profile.bankAccount || ''} onChange={(e) => setField('bankAccount', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Change password</h2>
        <Field label="New password (leave blank to keep current)">
          <input className="hr-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </Field>
      </div>

      {msg && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</div>}
      {err && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>}

      <button type="submit" disabled={saving} className="hr-btn px-8 py-3">
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
