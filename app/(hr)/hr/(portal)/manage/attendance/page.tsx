'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'
import { useHrPaths } from '@/lib/hr/ui-context'

type EmployeeRow = {
  id: string
  fullName: string
  employeeCode: string
  department: string
  position: string
  isStipend?: boolean
  monthlyPay: number
  finalSalary: number
  totalWorkingDays: number
  totalWorkingHours: number
  present: number
  absent: number
  leave: number
  lateMinutes: number
  lateDeduction: number
  todayStatus: string | null
  attendanceRate: number
}

type PayrollMonth = {
  monthKey: string
  monthLabel: string
  shortLabel: string
  grossPay: number
  deductions: number
  netPay: number
  presentDays: number
  employeeCount: number
}

type OverviewData = {
  month: string
  monthKey: string
  today: string | null
  isCurrentMonth: boolean
  filters: { department: string | null; q: string | null; month: string }
  totalEmployeesUnfiltered: number
  departmentCounts: Record<string, number>
  kpis: {
    totalEmployees: number
    presentToday: number | null
    absentToday: number | null
    onLeaveToday: number | null
    monthPresentTotal: number
    monthLateDeduction: number
    totalGrossPayroll: number
    totalNetPayroll: number
  }
  payrollHistory: PayrollMonth[]
  filteredPayrollHistory: PayrollMonth[]
  employees: EmployeeRow[]
}

const TODAY_STYLES: Record<string, string> = {
  present: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  absent: 'bg-red-50 text-red-800 border-red-200',
  leave: 'bg-violet-50 text-violet-800 border-violet-200',
  half_day: 'bg-amber-50 text-amber-800 border-amber-200',
  weekly_off: 'bg-blue-50 text-blue-700 border-blue-200',
  holiday: 'bg-pink-50 text-pink-700 border-pink-200',
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

function deptLabel(value: string) {
  return HR_DEPARTMENTS.find((d) => d.value === value)?.label || value.replace(/-/g, ' ')
}

function todayLabel(status: string | null) {
  if (!status) return 'No record'
  return status.replace(/_/g, ' ')
}

function fmtNpr(n: number) {
  return `NPR ${n.toLocaleString()}`
}

function hasActiveFilters(department: string, search: string) {
  return !!department || !!search.trim()
}

export default function HrManageAttendancePage() {
  const paths = useHrPaths()
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'present' | 'absent' | 'late' | 'rate' | 'salary'>('name')

  const filtersActive = hasActiveFilters(department, search)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('month', selectedMonth)
    if (department) params.set('department', department)
    if (search.trim()) params.set('q', search.trim())

    fetch(`/api/hr/attendance/overview?${params}`, { credentials: 'same-origin' })
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || `Request failed (${r.status})`)
        return d
      })
      .then((d) => setData(d))
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load data')
      })
      .finally(() => setLoading(false))
  }, [department, search, selectedMonth])

  useEffect(() => {
    const t = setTimeout(load, search.trim() ? 350 : 0)
    return () => clearTimeout(t)
  }, [load])

  const sorted = useMemo(() => {
    const rows = [...(data?.employees || [])]
    rows.sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName)
      if (sortBy === 'present') return b.present - a.present
      if (sortBy === 'absent') return b.absent - a.absent
      if (sortBy === 'late') return b.lateMinutes - a.lateMinutes
      if (sortBy === 'rate') return b.attendanceRate - a.attendanceRate
      if (sortBy === 'salary') return b.finalSalary - a.finalSalary
      return 0
    })
    return rows
  }, [data?.employees, sortBy])

  function clearFilters() {
    setSearch('')
    setDepartment('')
  }

  const kpis = data?.kpis
  const payrollTimeline = data?.payrollHistory || []
  const payrollForHero = filtersActive
    ? data?.filteredPayrollHistory?.find((m) => m.monthKey === selectedMonth)
    : payrollTimeline.find((m) => m.monthKey === selectedMonth)

  const deptCounts = data?.departmentCounts || {}

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C1121F] via-[#9a0f18] to-[#5c0910] text-white p-6 lg:p-8 shadow-xl shadow-red-900/20">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">HR Attendance & Payroll</p>
            <h1 className="text-2xl lg:text-3xl font-bold mt-1">Attendance overview</h1>
            <p className="text-white/80 text-sm mt-2">
              {data?.month ? `Viewing ${data.month}` : 'Select a month to explore'}
              {data?.isCurrentMonth && data.today ? ` · Today ${data.today}` : ''}
              {data?.totalEmployeesUnfiltered != null && (
                <span> · {data.totalEmployeesUnfiltered} total staff</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Select month</span>
              <input
                type="month"
                value={selectedMonth}
                max={currentMonthKey()}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                className="rounded-xl border-0 bg-white/15 backdrop-blur px-4 py-2.5 text-white font-semibold text-sm shadow-inner [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              />
            </label>
            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonthKey())}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-medium transition-colors mt-5"
            >
              This month
            </button>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="rounded-xl bg-white text-[#C1121F] hover:bg-white/90 disabled:opacity-60 px-4 py-2.5 text-sm font-bold transition-colors mt-5 shadow-lg"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error} — <button type="button" onClick={load} className="underline font-medium">Retry</button>
        </div>
      )}

      {payrollForHero && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white p-6 shadow-xl shadow-emerald-900/20">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">
              Final payroll — {payrollForHero.monthLabel}
              {filtersActive ? ' (filtered)' : ''}
            </p>
            <p className="text-4xl lg:text-5xl font-black mt-2 tabular-nums">{fmtNpr(payrollForHero.netPay)}</p>
            <p className="text-emerald-100/90 text-sm mt-2">
              {payrollForHero.employeeCount} employee{payrollForHero.employeeCount === 1 ? '' : 's'} in this view
            </p>
            <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-white/20">
              <div>
                <p className="text-emerald-200 text-xs">Gross payroll</p>
                <p className="text-lg font-bold tabular-nums">{fmtNpr(payrollForHero.grossPay)}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs">Late deductions</p>
                <p className="text-lg font-bold tabular-nums text-amber-200">− {fmtNpr(payrollForHero.deductions)}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs">Present days</p>
                <p className="text-lg font-bold tabular-nums">{payrollForHero.presentDays}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 text-white p-6 shadow-xl">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-widest">Deduction rate</p>
            <p className="text-4xl font-black mt-2 tabular-nums">
              {payrollForHero.grossPay > 0
                ? `${Math.round((payrollForHero.deductions / payrollForHero.grossPay) * 100)}%`
                : '0%'}
            </p>
            <p className="text-violet-200/80 text-sm mt-1">of gross payroll lost to late arrivals</p>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Monthly final salary (company-wide)</h2>
          <p className="text-xs text-slate-500">Click a month · timeline always shows all staff</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {payrollTimeline.map((m, i) => {
            const active = m.monthKey === selectedMonth
            const grad = SALARY_GRADIENTS[i % SALARY_GRADIENTS.length]
            return (
              <button
                key={m.monthKey}
                type="button"
                onClick={() => setSelectedMonth(m.monthKey)}
                className={`snap-start shrink-0 w-[148px] rounded-2xl p-4 text-left transition-all duration-300 ${
                  active
                    ? `bg-gradient-to-br ${grad} text-white shadow-xl scale-105 ring-2 ring-white ring-offset-2`
                    : 'bg-white border border-slate-200 hover:border-[#C1121F]/40 hover:shadow-md'
                }`}
              >
                <p className={`text-xs font-bold uppercase ${active ? 'text-white/80' : 'text-slate-400'}`}>{m.shortLabel}</p>
                <p className={`text-lg font-black mt-1 tabular-nums ${active ? 'text-white' : 'text-[#C1121F]'}`}>
                  {m.netPay >= 1000 ? `${(m.netPay / 1000).toFixed(0)}k` : m.netPay}
                </p>
                <p className={`text-[10px] mt-1 ${active ? 'text-white/70' : 'text-slate-500'}`}>
                  {m.employeeCount} staff · {m.presentDays}d
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          ['In view', kpis?.totalEmployees ?? '—', 'text-slate-900', 'bg-white'],
          ['Present today', data?.isCurrentMonth ? (kpis?.presentToday ?? '—') : 'N/A', 'text-emerald-600', 'bg-emerald-50/50'],
          ['Absent today', data?.isCurrentMonth ? (kpis?.absentToday ?? '—') : 'N/A', 'text-red-600', 'bg-red-50/50'],
          ['On leave', data?.isCurrentMonth ? (kpis?.onLeaveToday ?? '—') : 'N/A', 'text-violet-600', 'bg-violet-50/50'],
          ['Month present', kpis?.monthPresentTotal ?? '—', 'text-[#C1121F]', 'bg-red-50/30'],
          ['Net payroll', kpis != null ? fmtNpr(kpis.totalNetPayroll) : '—', 'text-emerald-700', 'bg-emerald-50/50'],
        ].map(([label, val, color, bg]) => (
          <div key={String(label)} className={`hr-card py-4 ${bg}`}>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className={`text-lg font-bold mt-1 tabular-nums ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="hr-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="text-xs text-[#C1121F] font-semibold hover:underline">
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="hr-input flex-1 min-w-[220px] max-w-md"
            placeholder="Search name, email, code, position…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="hr-input max-w-[240px]"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">
              All departments ({data?.totalEmployeesUnfiltered ?? '…'})
            </option>
            {HR_DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label} ({deptCounts[d.value] ?? 0})
              </option>
            ))}
          </select>
          <select
            className="hr-input max-w-[180px]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="name">Sort by name</option>
            <option value="salary">Sort by final salary</option>
            <option value="present">Sort by present</option>
            <option value="absent">Sort by absent</option>
            <option value="late">Sort by late minutes</option>
            <option value="rate">Sort by attendance %</option>
          </select>
        </div>
        {filtersActive && (
          <div className="flex flex-wrap gap-2 pt-1">
            {department && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C1121F]/10 text-[#C1121F] text-xs font-medium">
                {deptLabel(department)}
                <button type="button" onClick={() => setDepartment('')} aria-label="Remove department filter">×</button>
              </span>
            )}
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                &quot;{search.trim()}&quot;
                <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>
              </span>
            )}
            <span className="text-xs text-slate-500 self-center">
              {kpis?.totalEmployees ?? 0} of {data?.totalEmployeesUnfiltered ?? 0} employees match
            </span>
          </div>
        )}
      </div>

      <div className="hr-card overflow-hidden p-0 shadow-md">
        <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-wrap justify-between gap-2">
          <h2 className="font-semibold text-slate-900">Employee attendance & salary — {data?.month}</h2>
          {!loading && (
            <span className="text-xs text-slate-500 self-center">
              {sorted.length} result{sorted.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1280px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/80">
                <th className="px-5 py-3.5 font-semibold">Employee</th>
                {data?.isCurrentMonth && <th className="px-4 py-3.5 font-semibold text-center">Today</th>}
                <th className="px-4 py-3.5 font-semibold text-center">Present</th>
                <th className="px-4 py-3.5 font-semibold text-center">Absent</th>
                <th className="px-4 py-3.5 font-semibold text-center">Late</th>
                <th className="px-4 py-3.5 font-semibold text-right">Gross</th>
                <th className="px-4 py-3.5 font-semibold text-right">Deduction</th>
                <th className="px-4 py-3.5 font-semibold text-right">Final salary</th>
                <th className="px-4 py-3.5 font-semibold text-center">Rate</th>
                <th className="px-5 py-3.5 font-semibold text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={data?.isCurrentMonth ? 11 : 10} className="px-5 py-12 text-center text-slate-500">
                    Loading attendance data…
                  </td>
                </tr>
              )}
              {!loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={data?.isCurrentMonth ? 11 : 10} className="px-5 py-12 text-center">
                    <p className="text-slate-700 font-medium">No employees match your filters</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                      {department && (deptCounts[department] ?? 0) === 0
                        ? `${deptLabel(department)} has no active employees yet. Try All departments or add staff in Employees.`
                        : 'Try a different search term or clear filters to see all staff.'}
                    </p>
                    {filtersActive && (
                      <button type="button" onClick={clearFilters} className="hr-btn mt-4 text-sm">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {!loading &&
                sorted.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-red-50/20 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={paths.attendanceEmployee(e.id)} className="font-medium text-slate-900 hover:text-[#C1121F]">
                        {e.fullName}
                      </Link>
                      <p className="text-xs text-slate-400 font-mono">{e.employeeCode}</p>
                      <p className="text-xs text-slate-500">{deptLabel(e.department)} · {e.position}</p>
                    </td>
                    {data?.isCurrentMonth && (
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                            e.todayStatus
                              ? TODAY_STYLES[e.todayStatus] || 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {todayLabel(e.todayStatus)}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-4 text-center font-bold text-emerald-700 tabular-nums">{e.present}</td>
                    <td className="px-4 py-4 text-center font-bold text-red-600 tabular-nums">{e.absent}</td>
                    <td className="px-4 py-4 text-center font-medium text-amber-600 tabular-nums">{e.lateMinutes}m</td>
                    <td className="px-4 py-4 text-right text-slate-600 tabular-nums whitespace-nowrap">
                      {e.monthlyPay > 0 ? fmtNpr(e.monthlyPay) : '—'}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-amber-700 tabular-nums whitespace-nowrap">
                      {e.lateDeduction > 0 ? `− ${fmtNpr(e.lateDeduction)}` : '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-emerald-800 tabular-nums">
                        {e.monthlyPay > 0 ? fmtNpr(e.finalSalary) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold tabular-nums">{e.attendanceRate}%</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={paths.attendanceEmployee(e.id)} className="text-xs text-[#C1121F] font-semibold hover:underline">
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
