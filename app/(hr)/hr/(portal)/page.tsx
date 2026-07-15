'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TodayAttendance = {
  status?: string
  checkIn?: string
  checkOut?: string
  lateMinutes?: number
  lateDeduction?: number
}

export default function HrDashboardPage() {
  const [user, setUser] = useState<{ fullName: string; employeeCode: string; role: string } | null>(null)
  const [today, setToday] = useState<TodayAttendance | null>(null)
  const [settings, setSettings] = useState<{ startTime: string; endTime: string } | null>(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/hr/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
    fetch('/api/hr/attendance', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setToday(d.today))
    fetch('/api/hr/settings', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setSettings(d))
  }, [])

  async function getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('Geolocation not supported'))
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      })
    })
  }

  async function checkIn() {
    setBusy('in')
    setErr('')
    setMsg('')
    try {
      const pos = await getPosition()
      const res = await fetch('/api/hr/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Check-in failed')
      setMsg(data.message || 'Checked in')
      setToday((t) => ({ ...t, checkIn: data.checkIn, lateMinutes: data.lateMinutes, lateDeduction: data.lateDeduction, status: 'present' }))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Check-in failed')
    } finally {
      setBusy('')
    }
  }

  async function checkOut() {
    setBusy('out')
    setErr('')
    setMsg('')
    try {
      const pos = await getPosition()
      const res = await fetch('/api/hr/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Check-out failed')
      setMsg('Checked out successfully')
      setToday((t) => ({ ...t, checkOut: data.checkOut }))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Check-out failed')
    } finally {
      setBusy('')
    }
  }

  const canCheckIn = today && !today.checkIn && today.status !== 'weekly_off' && today.status !== 'holiday' && today.status !== 'leave'
  const canCheckOut = today?.checkIn && !today?.checkOut

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome{user ? `, ${user.fullName}` : ''}</h1>
        <p className="text-slate-500 text-sm mt-1">
          Office hours {settings?.startTime || '10:00'} – {settings?.endTime || '18:00'} · Mon–Fri · No grace period
        </p>
      </div>

      <div className="hr-card space-y-4">
        <h2 className="font-semibold text-slate-900">Today&apos;s attendance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-slate-500 text-xs">Status</p>
            <p className="font-semibold capitalize">{today?.status || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-slate-500 text-xs">Check in</p>
            <p className="font-semibold">{today?.checkIn ? new Date(today.checkIn).toLocaleTimeString() : '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-slate-500 text-xs">Late (min)</p>
            <p className="font-semibold text-amber-600">{today?.lateMinutes ?? 0}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-slate-500 text-xs">Deduction</p>
            <p className="font-semibold text-red-600">NPR {today?.lateDeduction ?? 0}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">Check-in requires office WiFi IP and GPS within office radius.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="hr-btn" disabled={!canCheckIn || !!busy} onClick={checkIn}>
            {busy === 'in' ? 'Checking in…' : 'Check in'}
          </button>
          <button type="button" className="hr-btn-secondary" disabled={!canCheckOut || !!busy} onClick={checkOut}>
            {busy === 'out' ? 'Checking out…' : 'Check out'}
          </button>
          <Link href="/hr/leave/apply" className="hr-btn-secondary">Apply leave</Link>
        </div>
        {msg && <p className="text-green-700 text-sm">{msg}</p>}
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/hr/attendance" className="hr-card hover:border-[#C1121F]/30 transition-colors">
          <p className="font-semibold text-slate-900">Monthly attendance</p>
          <p className="text-sm text-slate-500 mt-1">View history, late totals, deductions</p>
        </Link>
        <Link href="/hr/leave" className="hr-card hover:border-[#C1121F]/30 transition-colors">
          <p className="font-semibold text-slate-900">Leave &amp; balance</p>
          <p className="text-sm text-slate-500 mt-1">Track applications and remaining days</p>
        </Link>
      </div>
    </div>
  )
}
