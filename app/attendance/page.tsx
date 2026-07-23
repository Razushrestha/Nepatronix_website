'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { HR_DEPARTMENTS, departmentRequiresGps, attendanceActionRequiresLocation, ceoRemoteAttendanceAllowed } from '@/lib/hr/constants'
import { Icon } from '@/app/(admin)/components/icons'
import { getBestGpsReading } from '@/lib/hr/client-gps'
import AttendanceSidebar, { type AttendanceView } from './components/AttendanceSidebar'
import ProfileForm from './components/ProfileForm'
import TaskModule from '@/app/(admin)/components/tasks/TaskModule'

type User = {
  id: string
  fullName: string
  employeeCode: string
  department: string
  role: string
  position?: string
  allowRemoteAttendance?: boolean
}

type AttendanceData = {
  today?: {
    status: string
    checkIn?: string
    checkOut?: string
    lateMinutes?: number
    lateDeduction?: number
  } | null
  records: { date: string; status: string; checkIn?: string; checkOut?: string; lateMinutes?: number; lateDeduction?: number }[]
  summary: { present: number; lateMinutes: number; lateDeduction: number; absent: number }
  attendanceStartDate?: string
  attendanceStartLabel?: string
  trackingActive?: boolean
}

type OfficeSettings = { startTime: string; endTime: string; officeName?: string }

const STATUS_STYLES: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  absent: 'bg-slate-100 text-slate-600 border-slate-200',
  weekly_off: 'bg-blue-50 text-blue-700 border-blue-200',
  not_started: 'bg-sky-50 text-sky-700 border-sky-200',
  half_day: 'bg-amber-50 text-amber-700 border-amber-200',
  leave: 'bg-violet-50 text-violet-700 border-violet-200',
  weekly_off: 'bg-blue-50 text-blue-700 border-blue-200',
  holiday: 'bg-pink-50 text-pink-700 border-pink-200',
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  if (!now) return null
  return (
    <div className="text-right">
      <p className="text-2xl font-bold text-slate-900 tabular-nums">
        {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="text-xs text-slate-500">
        {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [department, setDepartment] = useState('nepatronix')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/hr/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ department, email, password }),
    })
    if (res.ok) onSuccess()
    else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#C1121F] via-[#9a0f18] to-[#5c0910] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-8">
            <Icon name="clock" className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold leading-tight">Nepatronix Staff Attendance</h1>
          <p className="text-white/80 mt-4 max-w-md text-sm leading-relaxed">
            Sign in from the office network to check in and out. Use your work email and password provided by HR.
          </p>
        </div>
        <ul className="relative space-y-3 text-sm text-white/90">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Office Wi‑Fi required</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> GPS for Nepatronix &amp; Metatronix (not STEM Innovation Nepal)</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Mon–Fri · 10:00 AM – 6:00 PM</li>
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#C1121F]/10 rounded-2xl mb-4 text-[#C1121F]">
              <Icon name="clock" className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Staff Attendance</h1>
            <p className="text-slate-500 text-sm mt-1">Nepatronix employee login</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="hidden lg:block mb-2">
              <h2 className="text-xl font-bold text-slate-900">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1">Use your Nepatronix work credentials</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <select className="hr-input" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                {HR_DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Work email</label>
              <input type="email" className="hr-input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" placeholder="you@nepatronix.org" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="hr-input pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
            <button type="submit" disabled={loading} className="hr-btn w-full py-3">
              {loading ? 'Signing in…' : 'Sign in to attendance'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-6">
            Manager or HR? <a href="/hr/login" className="text-[#C1121F] hover:underline font-medium">Full HR portal</a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Alert({ type, children }: { type: 'success' | 'error' | 'info'; children: React.ReactNode }) {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
}

type SalaryData = {
  month: string
  monthlyPay: number
  isStipend: boolean
  lateDeduction: number
  lateMinutes: number
  presentDays: number
  estimatedNet: number
  scheduledStart: string
  scheduledEnd: string
  totalWorkingDays: number
  totalWorkingHours: number
  bankName?: string
  bankAccount?: string
}

type TaskItem = {
  id: string
  title: string
  description?: string
  status: string
  effectiveStatus?: string
  completionPercent?: number
  dueDate?: string
  createdAt?: string
}

const TASK_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  review: 'bg-violet-50 text-violet-700 border-violet-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
}

function EmployeePortal({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [view, setView] = useState<AttendanceView>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [data, setData] = useState<AttendanceData | null>(null)
  const [settings, setSettings] = useState<OfficeSettings | null>(null)
  const [salary, setSalary] = useState<SalaryData | null>(null)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [leaveData, setLeaveData] = useState<{ requests: unknown[]; balance: unknown } | null>(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState<'in' | 'out' | null>(null)

  const load = useCallback(() => {
    fetch('/api/hr/attendance', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d) })
    fetch('/api/hr/settings', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then(setSettings)
  }, [])

  const loadSalary = useCallback(() => {
    fetch('/api/hr/salary', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { if (!d.error) setSalary(d) })
  }, [])

  const loadTasks = useCallback(() => {
    fetch('/api/tasks?limit=50', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.tasks)) setTasks(d.tasks) })
      .catch(() => {})
  }, [])

  const loadLeave = useCallback(() => {
    fetch('/api/hr/leave', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then(setLeaveData)
  }, [])

  useEffect(() => {
    load()
    loadSalary()
    loadTasks()
    loadLeave()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [load, loadSalary, loadTasks, loadLeave])

  useEffect(() => {
    if (view === 'salary') loadSalary()
    if (view === 'task') loadTasks()
  }, [view, loadSalary, loadTasks])

  async function check(action: 'in' | 'out') {
    setBusy(action)
    setMsg('')
    setErr('')
    try {
      const remoteOk = user
        ? ceoRemoteAttendanceAllowed({
            role: user.role,
            department: user.department,
            position: user.position,
            allowRemoteAttendance: user.allowRemoteAttendance,
          })
        : false
      const needsGps =
        user &&
        !remoteOk &&
        attendanceActionRequiresLocation(
          {
            role: user.role,
            department: user.department,
            position: user.position,
            allowRemoteAttendance: user.allowRemoteAttendance,
          },
          action === 'in' ? 'check_in' : 'check_out'
        ) &&
        departmentRequiresGps(user.department)
      let payload: Record<string, number> = {}
      if (needsGps) {
        setMsg('Locating you — please allow GPS and wait a few seconds…')
        payload = await getBestGpsReading()
      } else if (remoteOk) {
        setMsg(action === 'in' ? 'Checking in (remote allowed for CEO)…' : 'Checking out (remote allowed for CEO)…')
      } else if (action === 'in') {
        setMsg('Verifying office Wi‑Fi…')
      }
      const res = await fetch(`/api/hr/attendance/check-${action === 'in' ? 'in' : 'out'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) setErr(data.error || 'Failed')
      else {
        setMsg(data.message || (action === 'in' ? 'Checked in successfully!' : 'Checked out successfully!'))
        load()
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Location error')
    }
    setBusy(null)
  }

  const today = data?.today
  const trackingActive = data?.trackingActive !== false
  const statusKey = today?.status || (trackingActive ? 'absent' : 'not_started')
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.absent
  const canCheckIn =
    trackingActive && today && !today.checkIn && !['weekly_off', 'holiday', 'leave', 'not_started'].includes(statusKey)
  const canCheckOut = trackingActive && today?.checkIn && !today?.checkOut

  const openTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled'
  ).length

  const titles: Record<AttendanceView, string> = {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    salary: 'Salary',
    task: 'Tasks',
    profile: 'My profile',
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AttendanceSidebar
        user={user}
        active={view}
        onNavigate={setView}
        onLogout={onLogout}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{titles[view]}</h1>
              {settings && (
                <p className="text-xs text-slate-500 hidden sm:block">
                  {settings.officeName || 'Office'} · {settings.startTime}–{settings.endTime}
                </p>
              )}
            </div>
          </div>
          <LiveClock />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
          {!trackingActive && data?.attendanceStartLabel && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <strong>Attendance starts {data.attendanceStartLabel}</strong> (Shrawan 1). Until then, check-in is disabled and past days are not counted toward salary or deductions.
            </div>
          )}
          {view === 'dashboard' && (
            <>
              <div className="hr-card">
                <h2 className="text-lg font-bold text-slate-900">Welcome back, {user.fullName.split(' ')[0]}</h2>
                <p className="text-sm text-slate-500 mt-1">Here is your overview for today.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button type="button" onClick={() => setView('attendance')} className="hr-card text-left hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500">Today</p>
                  <p className="text-lg font-bold text-slate-900 mt-1 capitalize">{statusKey.replace(/_/g, ' ')}</p>
                  <p className="text-[10px] text-[#C1121F] mt-2 font-medium">View attendance →</p>
                </button>
                <button type="button" onClick={() => setView('salary')} className="hr-card text-left hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500">Estimated net ({salary?.month || 'this month'})</p>
                  <p className="text-lg font-bold text-[#C1121F] mt-1">NPR {salary?.estimatedNet?.toLocaleString() ?? '—'}</p>
                  <p className="text-[10px] text-slate-400 mt-2">After late deductions</p>
                </button>
                <button type="button" onClick={() => setView('task')} className="hr-card text-left hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-500">Open tasks</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{openTasks}</p>
                  <p className="text-[10px] text-[#C1121F] mt-2 font-medium">View tasks →</p>
                </button>
                <div className="hr-card">
                  <p className="text-xs text-slate-500">Present this month</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">{data?.summary?.present ?? 0} days</p>
                  <p className="text-[10px] text-slate-400 mt-2">{data?.summary?.lateMinutes ?? 0} min late</p>
                </div>
              </div>

              {leaveData?.balance && (
                <div className="hr-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-slate-900">Leave balance</h3>
                    <Link href="/hr/leave/apply" className="text-sm text-[#C1121F] font-medium hover:underline">Apply for leave</Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['annual', 'sick', 'casual'] as const).map((type) => {
                      const b = leaveData.balance as Record<string, number>
                      const used = b[`${type}Used`] || 0
                      const total = b[type] || 0
                      return (
                        <div key={type} className="rounded-xl bg-slate-50 border border-slate-100 py-3 text-center">
                          <p className="text-xs text-slate-500 capitalize">{type}</p>
                          <p className="text-lg font-bold text-slate-900">{Math.max(0, total - used)}</p>
                          <p className="text-[10px] text-slate-400">of {total} left</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {tasks.length > 0 && (
                <div className="hr-card">
                  <h3 className="font-semibold text-slate-900 mb-3">Recent tasks</h3>
                  <div className="divide-y divide-slate-100">
                    {tasks.slice(0, 3).map((t) => {
                      const s = t.effectiveStatus || t.status
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setView('task')}
                          className="w-full py-3 flex justify-between items-center gap-3 text-sm text-left hover:opacity-80"
                        >
                          <span className="font-medium text-slate-800">{t.title}</span>
                          <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full border ${TASK_STATUS_STYLES[s] || TASK_STATUS_STYLES.pending}`}>
                            {s.replace(/_/g, ' ')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {view === 'attendance' && (
            <>
              <div className="hr-card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C1121F]/5 to-transparent pointer-events-none" />
                <div className="relative flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-[#C1121F] uppercase tracking-widest">Current status</p>
                    <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold border capitalize ${statusStyle}`}>
                      {statusKey === 'not_started' ? 'Starts tomorrow' : statusKey.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {today?.checkIn && (
                    <p className="text-sm text-slate-600">
                      Checked in at <strong>{new Date(today.checkIn).toLocaleTimeString()}</strong>
                    </p>
                  )}
                </div>

                <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    ['Check in', today?.checkIn ? new Date(today.checkIn).toLocaleTimeString() : '—'],
                    ['Check out', today?.checkOut ? new Date(today.checkOut).toLocaleTimeString() : '—'],
                    ['Late', `${today?.lateMinutes || 0} min`],
                    ['Deduction', `NPR ${today?.lateDeduction || 0}`],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">{label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="relative flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => check('in')}
                    disabled={busy !== null || !canCheckIn}
                    className="hr-btn flex-1 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busy === 'in' ? 'Checking in…' : today?.checkIn ? '✓ Already checked in' : trackingActive ? 'Check in now' : 'Opens Shrawan 1'}
                  </button>
                  <button
                    type="button"
                    onClick={() => check('out')}
                    disabled={busy !== null || !canCheckOut}
                    className="hr-btn-secondary flex-1 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busy === 'out' ? 'Checking out…' : today?.checkOut ? '✓ Already checked out' : 'Check out'}
                  </button>
                </div>

                <p className="relative text-xs text-slate-400 mt-4">
                  Enable location and wait a few seconds for GPS. Nepatronix staff must be within 150m of the office. STEM Innovation Nepal uses office Wi‑Fi only.
                </p>
              </div>

              {msg && <Alert type={msg.includes('Locating') ? 'info' : 'success'}>{msg}</Alert>}
              {err && <Alert type="error">{err}</Alert>}

              {data?.summary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['Present', data.summary.present, 'text-emerald-600'],
                    ['Absent', data.summary.absent, 'text-slate-700'],
                    ['Late min', data.summary.lateMinutes, 'text-amber-600'],
                    ['Deductions', `NPR ${data.summary.lateDeduction}`, 'text-[#C1121F]'],
                  ].map(([label, val, color]) => (
                    <div key={String(label)} className="hr-card py-4 text-center hover:shadow-md transition-shadow">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className={`text-xl font-bold mt-1 ${color}`}>{val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">this month</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="hr-card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">Leave</h2>
                  <p className="text-sm text-slate-500 mt-1">Apply for leave or track requests</p>
                </div>
                <Link href="/hr/leave/apply" className="hr-btn-secondary">Apply for leave</Link>
              </div>

              <div className="hr-card overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">This month</h2>
                  <button type="button" onClick={load} className="text-xs text-[#C1121F] font-medium hover:underline">Refresh</button>
                </div>
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="pb-3 pr-4 font-semibold">Date</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 pr-4 font-semibold">In</th>
                        <th className="pb-3 pr-4 font-semibold">Out</th>
                        <th className="pb-3 font-semibold">Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.records || []).map((r) => (
                        <tr key={r.date} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pr-4 font-medium">{r.date}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[r.status] || STATUS_STYLES.absent}`}>
                              {r.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 pr-4 tabular-nums">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</td>
                          <td className="py-3 pr-4 tabular-nums">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</td>
                          <td className="py-3 tabular-nums">{r.lateMinutes || 0} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!data?.records?.length && (
                    <p className="text-slate-500 text-sm py-8 text-center">No attendance records this month yet.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {view === 'salary' && !salary && (
            <div className="hr-card py-12 text-center text-slate-500 text-sm">Loading salary…</div>
          )}

          {view === 'salary' && salary && (
            <div className="space-y-4">
              <div className="hr-card">
                <p className="text-xs font-bold text-[#C1121F] uppercase tracking-widest">{salary.month}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500">{salary.isStipend ? 'Monthly stipend' : 'Monthly salary'}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">NPR {salary.monthlyPay.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Estimated net pay</p>
                    <p className="text-3xl font-bold text-[#C1121F] mt-1">NPR {salary.estimatedNet.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">After NPR {salary.lateDeduction.toLocaleString()} late deductions</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['Present days', salary.presentDays],
                  ['Late minutes', salary.lateMinutes],
                  ['Working days', salary.totalWorkingDays],
                  ['Working hours', salary.totalWorkingHours],
                ].map(([label, val]) => (
                  <div key={String(label)} className="hr-card py-4 text-center">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{val}</p>
                  </div>
                ))}
              </div>

              <div className="hr-card space-y-3">
                <h3 className="font-semibold text-slate-900">Schedule & payment</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p className="text-slate-600">Office hours: <strong>{salary.scheduledStart} – {salary.scheduledEnd}</strong></p>
                  {salary.bankName && (
                    <p className="text-slate-600">Bank: <strong>{salary.bankName}</strong> · {salary.bankAccount || '—'}</p>
                  )}
                </div>
                <p className="text-xs text-slate-400">Update bank details in Profile. Official payslips will be available in a future update.</p>
              </div>
            </div>
          )}

          {view === 'task' && (
            <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
              <TaskModule
                role={user.role}
                currentUserId={user.id}
                department={user.department}
                variant="staff"
              />
            </div>
          )}

          {view === 'profile' && <ProfileForm />}
        </main>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  function refreshSession() {
    setChecking(true)
    fetch('/api/hr/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setUser(d?.user || null)
        setChecking(false)
      })
      .catch(() => {
        setUser(null)
        setChecking(false)
      })
  }

  useEffect(() => { refreshSession() }, [])

  async function logout() {
    await fetch('/api/hr/auth', { method: 'DELETE', credentials: 'same-origin' })
    setUser(null)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#C1121F] rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Loading attendance…</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginForm onSuccess={refreshSession} />

  return <EmployeePortal user={user} onLogout={logout} />
}
