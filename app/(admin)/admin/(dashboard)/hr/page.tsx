'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Icon } from '@/app/(admin)/components/icons'
import { adminCard, fetcher, Spinner, timeAgo } from '@/app/(admin)/components/ui'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

interface HrStats {
  month: string
  monthKey: string
  isCurrentMonth: boolean
  today: string | null
  kpis: {
    totalEmployees: number
    activeEmployees: number
    pendingLeave: number
    presentToday: number | null
    absentToday: number | null
    onLeaveToday: number | null
    monthPresent: number
    monthLateDeduction: number
    monthLateMinutes: number
    grossPayroll: number
    netPayroll: number
    openTasks: number
  }
  payrollHistory: {
    monthKey: string
    shortLabel: string
    grossPay: number
    deductions: number
    netPay: number
    presentDays: number
  }[]
  departments: { department: string; count: number }[]
  office: { name?: string; startTime: string; endTime: string; graceMinutes: number }
  recentLeave: {
    id: string
    leaveType: string
    status: string
    fromDate: string
    toDate: string
    createdAt: string
    employee?: { fullName: string; employeeCode: string }
  }[]
  recentEmployees: {
    id: string
    fullName: string
    employeeCode: string
    department: string
    position?: string
    createdAt: string
  }[]
}

const MODULES = [
  {
    href: '/admin/hr/employees',
    title: 'Employees',
    desc: 'Add, edit, and manage staff',
    icon: 'users',
    gradient: 'from-blue-600 to-indigo-700',
    light: 'from-blue-50 to-indigo-50 border-blue-200/60',
    iconBg: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    stat: (d: HrStats) => `${d.kpis.activeEmployees} active`,
  },
  {
    href: '/admin/hr/attendance',
    title: 'Attendance',
    desc: 'Check-ins, records & salary',
    icon: 'clock',
    gradient: 'from-emerald-600 to-teal-700',
    light: 'from-emerald-50 to-teal-50 border-emerald-200/60',
    iconBg: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    stat: (d: HrStats) => `${d.kpis.presentToday ?? 0} in today`,
  },
  {
    href: '/admin/hr/leave',
    title: 'Leave',
    desc: 'Approvals & balances',
    icon: 'calendar',
    gradient: 'from-violet-600 to-purple-700',
    light: 'from-violet-50 to-purple-50 border-violet-200/60',
    iconBg: 'bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    stat: (d: HrStats) => `${d.kpis.pendingLeave} pending`,
  },
  {
    href: '/admin/hr/settings',
    title: 'Office Settings',
    desc: 'Hours, GPS & Wi‑Fi rules',
    icon: 'settings',
    gradient: 'from-amber-500 to-orange-600',
    light: 'from-amber-50 to-orange-50 border-amber-200/60',
    iconBg: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    stat: (d: HrStats) => `${d.office.startTime}–${d.office.endTime}`,
  },
] as const

const LEAVE_DROPDOWN_STYLES: Record<string, string> = {
  pending_hr: 'bg-orange-50 text-orange-800 border-orange-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
}

const SALARY_GRADIENTS = [
  'from-[#C1121F] to-[#8B0D15]',
  'from-violet-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-sky-600 to-blue-700',
  'from-fuchsia-600 to-purple-700',
]

function currentMonthKey() {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}

function deptLabel(slug: string) {
  return HR_DEPARTMENTS.find((d) => d.value === slug)?.label || slug.replace(/-/g, ' ')
}

function leaveDropdownValue(status: string) {
  if (status === 'approved') return 'approved'
  if (status === 'cancelled' || status === 'rejected') return 'cancelled'
  return 'pending_hr'
}

function fmtNpr(n: number) {
  return `NPR ${n.toLocaleString()}`
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
    <p className="text-white/80 text-sm tabular-nums mt-2">
      {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
      {' · '}
      <span className="font-semibold text-white">{now.toLocaleTimeString('en-GB')}</span>
    </p>
  )
}

export default function AdminHrHomePage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [actingLeave, setActingLeave] = useState<string | null>(null)

  const { data, isLoading, error, mutate } = useSWR<HrStats>(
    `/api/hr/stats?month=${selectedMonth}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  async function updateLeaveStatus(id: string, status: string) {
    setActingLeave(id)
    await fetch(`/api/hr/leave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'set_status', status }),
    })
    mutate()
    setActingLeave(null)
  }

  if (isLoading && !data) return <Spinner />

  if (error && !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-medium">Failed to load HR dashboard</p>
        <button type="button" onClick={() => mutate()} className="mt-4 text-[#C1121F] underline text-sm">
          Retry
        </button>
      </div>
    )
  }

  if (!data) return <Spinner />

  const maxDept = Math.max(...data.departments.map((d) => d.count), 1)
  const attendanceRate =
    data.kpis.activeEmployees > 0 && data.isCurrentMonth
      ? Math.round(((data.kpis.presentToday ?? 0) / data.kpis.activeEmployees) * 100)
      : 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C1121F] via-[#9a0f18] to-[#3d080c] text-white p-6 lg:p-8 shadow-2xl shadow-red-900/25">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Staff Operations · Live
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">HR Management</h1>
            <p className="text-white/75 text-sm mt-2 max-w-lg">
              {data.office.name || 'Nepatronix Office'} · {data.office.startTime}–{data.office.endTime}
              {data.office.graceMinutes === 0 && ' · No grace period'}
            </p>
            <LiveClock />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Month</span>
              <input
                type="month"
                value={selectedMonth}
                max={currentMonthKey()}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                className="rounded-xl bg-white/15 backdrop-blur px-4 py-2.5 text-white font-semibold text-sm [color-scheme:dark] border-0 focus:ring-2 focus:ring-white/40"
              />
            </label>
            <Link
              href="/admin/hr/employees/new"
              className="inline-flex items-center gap-2 bg-white text-[#C1121F] hover:bg-white/90 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <Icon name="users" className="w-4 h-4" />
              New employee
            </Link>
            <button
              type="button"
              onClick={() => mutate()}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Payroll banner */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white p-6 shadow-xl shadow-emerald-900/20">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">
            Final payroll · {data.month}
          </p>
          <p className="text-4xl lg:text-5xl font-black mt-2 tabular-nums">{fmtNpr(data.kpis.netPayroll)}</p>
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-white/20 text-sm">
            <span>Gross <strong className="ml-1">{fmtNpr(data.kpis.grossPayroll)}</strong></span>
            <span className="text-amber-200">Deductions <strong>−{fmtNpr(data.kpis.monthLateDeduction)}</strong></span>
            <span>{data.kpis.monthPresent} present days</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white p-6 shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-violet-200 text-xs font-bold uppercase tracking-widest">Today&apos;s pulse</p>
            {data.isCurrentMonth ? (
              <>
                <p className="text-5xl font-black mt-2 tabular-nums">{attendanceRate}%</p>
                <p className="text-violet-200/80 text-sm mt-1">
                  {data.kpis.presentToday} of {data.kpis.activeEmployees} staff present
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold mt-3 text-violet-200">Historical view</p>
            )}
          </div>
          {data.isCurrentMonth && (
            <div className="h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 6-month salary strip */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Icon name="numbers" className="w-4 h-4 text-[#C1121F]" />
          Monthly final salary
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x">
          {data.payrollHistory.map((m, i) => {
            const active = m.monthKey === selectedMonth
            const grad = SALARY_GRADIENTS[i % SALARY_GRADIENTS.length]
            return (
              <button
                key={m.monthKey}
                type="button"
                onClick={() => setSelectedMonth(m.monthKey)}
                className={`snap-start shrink-0 w-36 rounded-2xl p-4 text-left transition-all duration-300 ${
                  active
                    ? `bg-gradient-to-br ${grad} text-white shadow-xl scale-105 ring-2 ring-white ring-offset-2`
                    : 'bg-white border border-slate-200 hover:shadow-md hover:border-[#C1121F]/30'
                }`}
              >
                <p className={`text-xs font-bold uppercase ${active ? 'text-white/70' : 'text-slate-400'}`}>{m.shortLabel}</p>
                <p className={`text-xl font-black mt-1 tabular-nums ${active ? 'text-white' : 'text-[#C1121F]'}`}>
                  {m.netPay >= 1000 ? `${Math.round(m.netPay / 1000)}k` : m.netPay}
                </p>
                <p className={`text-[10px] mt-1 ${active ? 'text-white/60' : 'text-slate-500'}`}>{m.presentDays}d present</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Total staff', val: data.kpis.totalEmployees, sub: `${data.kpis.activeEmployees} active`, color: 'text-slate-900', href: '/admin/hr/employees', bg: 'bg-white' },
          { label: 'Present today', val: data.isCurrentMonth ? (data.kpis.presentToday ?? 0) : '—', sub: data.isCurrentMonth ? `${data.kpis.absentToday} absent` : 'Past month', color: 'text-emerald-600', href: '/admin/hr/attendance', bg: 'bg-emerald-50/80' },
          { label: 'Pending leave', val: data.kpis.pendingLeave, sub: 'Needs action', color: 'text-violet-600', href: '/admin/hr/leave', bg: 'bg-violet-50/80' },
          { label: 'Month present', val: data.kpis.monthPresent, sub: data.month, color: 'text-[#C1121F]', href: '/admin/hr/attendance', bg: 'bg-red-50/50' },
          { label: 'Late min', val: data.kpis.monthLateMinutes, sub: `−${fmtNpr(data.kpis.monthLateDeduction)}`, color: 'text-amber-600', href: '/admin/hr/attendance', bg: 'bg-amber-50/80' },
          { label: 'Open tasks', val: data.kpis.openTasks, sub: 'Assigned', color: 'text-blue-600', href: '/admin/hr/employees', bg: 'bg-blue-50/80' },
        ].map((k) => (
          <Link key={k.label} href={k.href} className={`${adminCard} ${k.bg} p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block`}>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{k.label}</p>
            <p className={`text-2xl font-black mt-1 tabular-nums ${k.color}`}>{k.val}</p>
            <p className="text-[10px] text-slate-400 mt-1 truncate">{k.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Module cards */}
        <div className="xl:col-span-2 grid sm:grid-cols-2 gap-4">
          {MODULES.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${mod.light} p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative group-hover:text-white transition-colors duration-300">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${mod.iconBg} group-hover:bg-white/20 group-hover:shadow-none transition-all`}>
                  <Icon name={mod.icon} className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg mt-4 text-slate-900 group-hover:text-white">{mod.title}</h2>
                <p className="text-sm text-slate-500 group-hover:text-white/80 mt-1">{mod.desc}</p>
                <p className="text-sm font-black mt-3 text-[#C1121F] group-hover:text-white">{mod.stat(data)}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className={`${adminCard} p-5 shadow-md`}>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="chart" className="w-4 h-4 text-[#C1121F]" />
              Staff by department
            </h3>
            <div className="space-y-4">
              {data.departments.length === 0 && <p className="text-sm text-slate-500">No employees yet.</p>}
              {data.departments.map((d, i) => {
                const colors = ['from-[#C1121F] to-[#8B0D15]', 'from-violet-500 to-purple-600', 'from-emerald-500 to-teal-600']
                return (
                  <div key={d.department}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700">{deptLabel(d.department)}</span>
                      <span className="font-black text-slate-900">{d.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-700`}
                        style={{ width: `${(d.count / maxDept) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`${adminCard} p-5 shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent leave</h3>
              <Link href="/admin/hr/leave" className="text-xs text-[#C1121F] font-semibold hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {data.recentLeave.length === 0 && <p className="text-sm text-slate-500">No leave requests yet.</p>}
              {data.recentLeave.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{r.employee?.fullName || 'Employee'}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {r.leaveType} · {r.fromDate}
                        {r.toDate !== r.fromDate ? ` – ${r.toDate}` : ''}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(r.createdAt)}</p>
                    </div>
                    <select
                      value={leaveDropdownValue(r.status)}
                      disabled={actingLeave === r.id}
                      onChange={(e) => updateLeaveStatus(r.id, e.target.value)}
                      className={`text-[10px] font-bold rounded-lg border px-2 py-1.5 cursor-pointer shrink-0 ${LEAVE_DROPDOWN_STYLES[leaveDropdownValue(r.status)]}`}
                    >
                      <option value="pending_hr">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {data.recentEmployees.length > 0 && (
        <div className={`${adminCard} p-5 shadow-md`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recently added</h3>
            <Link href="/admin/hr/employees" className="text-xs text-[#C1121F] font-semibold hover:underline">All employees</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.recentEmployees.map((e) => (
              <Link
                key={e.id}
                href={`/admin/hr/employees/${e.id}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 hover:shadow-md hover:border-[#C1121F]/20 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-900/20">
                  {e.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{e.fullName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{e.employeeCode}</p>
                  <p className="text-[10px] text-slate-400">{deptLabel(e.department)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Auto-refresh every 30s
        </span>
        <span>·</span>
        <Link href="/attendance" target="_blank" className="text-[#C1121F] font-medium hover:underline">
          Staff portal → /attendance
        </Link>
        <span>·</span>
        <Link href="/hr/login" target="_blank" className="text-[#C1121F] font-medium hover:underline">
          HR portal → /hr/login
        </Link>
      </div>
    </div>
  )
}
