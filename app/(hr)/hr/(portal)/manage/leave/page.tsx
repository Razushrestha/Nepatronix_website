'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

type LeaveRequest = {
  id: string
  leaveType: string
  fromDate: string
  toDate: string
  halfDay?: 'am' | 'pm'
  status: string
  totalDays: number
  reason: string
  department: string
  createdAt?: string
  managerComment?: string
  hrComment?: string
  rejectionReason?: string
  managerApprovedAt?: string
  hrApprovedAt?: string
  employee?: { fullName: string; employeeCode: string; department: string }
}

type LeaveMonth = {
  monthKey: string
  monthLabel: string
  shortLabel: string
  total: number
  approved: number
  pending: number
  approvedDays: number
}

type LeaveOverview = {
  requests: LeaveRequest[]
  summary: {
    total: number
    pending: number
    approved: number
    rejected: number
    cancelled: number
    approvedDays: number
    byType: Record<string, number>
  }
  filteredSummary: {
    total: number
    pending: number
    approved: number
    approvedDays: number
  }
  totalUnfiltered: number
  departmentCounts: Record<string, number>
  leaveTimeline: LeaveMonth[]
  monthStats?: LeaveMonth
  month: string
  monthKey: string
  isCurrentMonth: boolean
}

const TYPE_STYLES: Record<string, string> = {
  annual: 'bg-violet-100 text-violet-800 ring-violet-200',
  sick: 'bg-rose-100 text-rose-800 ring-rose-200',
  casual: 'bg-sky-100 text-sky-800 ring-sky-200',
  unpaid: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const TYPE_GRADIENTS: Record<string, string> = {
  annual: 'from-violet-500 to-purple-700',
  sick: 'from-rose-500 to-red-700',
  casual: 'from-sky-500 to-blue-700',
  unpaid: 'from-slate-400 to-slate-600',
}

const TIMELINE_GRADIENTS = [
  'from-[#C1121F] to-[#8B0D15]',
  'from-violet-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-sky-600 to-blue-700',
  'from-fuchsia-600 to-purple-700',
]

const DROPDOWN_STYLES: Record<string, string> = {
  pending_hr: 'bg-orange-50 text-orange-800 border-orange-300',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
}

const DROPDOWN_OPTIONS = [
  { value: 'pending_hr', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'cancelled', label: 'Cancel' },
] as const

function currentMonthKey() {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}

function statusToDropdown(status: string): (typeof DROPDOWN_OPTIONS)[number]['value'] {
  if (status === 'approved') return 'approved'
  if (status === 'cancelled' || status === 'rejected') return 'cancelled'
  return 'pending_hr'
}

function formatDate(d: string) {
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

function formatRange(from: string, to: string, halfDay?: string) {
  const range = from === to ? formatDate(from) : `${formatDate(from)} – ${formatDate(to)}`
  if (halfDay) return `${range} (${halfDay.toUpperCase()} half)`
  return range
}

function deptLabel(value: string) {
  return HR_DEPARTMENTS.find((d) => d.value === value)?.label || value.replace(/-/g, ' ')
}

function initials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function hasActiveFilters(search: string, status: string, type: string, dept: string) {
  return !!search.trim() || !!status || !!type || !!dept
}

export default function HrManageLeavePage() {
  const [data, setData] = useState<LeaveOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  const filtersActive = hasActiveFilters(search, statusFilter, typeFilter, deptFilter)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ scope: 'all' })
    params.set('month', selectedMonth)
    if (statusFilter) params.set('status', statusFilter)
    if (typeFilter) params.set('type', typeFilter)
    if (deptFilter) params.set('department', deptFilter)
    if (search.trim()) params.set('q', search.trim())

    fetch(`/api/hr/leave?${params}`, { credentials: 'same-origin' })
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || `Request failed (${r.status})`)
        return d
      })
      .then((d) => setData(d))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load leave data'))
      .finally(() => setLoading(false))
  }, [deptFilter, search, selectedMonth, statusFilter, typeFilter])

  useEffect(() => {
    const t = setTimeout(load, search.trim() ? 350 : 0)
    return () => clearTimeout(t)
  }, [load])

  const requests = data?.requests || []
  const summary = data?.summary
  const monthStats = data?.monthStats
  const timeline = data?.leaveTimeline || []
  const deptCounts = data?.departmentCounts || {}

  const typeBreakdown = useMemo(() => {
    const byType = summary?.byType || {}
    return (['annual', 'sick', 'casual', 'unpaid'] as const).map((t) => ({
      type: t,
      count: byType[t] || 0,
    }))
  }, [summary?.byType])

  function clearFilters() {
    setSearch('')
    setStatusFilter('')
    setTypeFilter('')
    setDeptFilter('')
  }

  function toggleStatusFilter(status: string) {
    setStatusFilter((prev) => (prev === status ? '' : status))
  }

  async function updateStatus(id: string, status: string) {
    setActingId(id)
    const res = await fetch(`/api/hr/leave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'set_status', status }),
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      setError(errData.error || 'Failed to update status')
    } else {
      load()
    }
    setActingId(null)
  }

  const liveDate = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C1121F] via-[#9a0f18] to-[#5c0910] text-white p-6 lg:p-8 shadow-xl shadow-red-900/20">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/70">
              <span>Leave management</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
              <span>{liveDate}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mt-2">Leave queue</h1>
            <p className="text-white/80 text-sm mt-2 max-w-xl">
              Review, approve, and manage every leave application across the organisation.
              {data?.totalUnfiltered != null && (
                <span> · {data.totalUnfiltered} total request{data.totalUnfiltered === 1 ? '' : 's'}</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Leave month</span>
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

      {(summary?.pending ?? 0) > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white text-lg font-black shadow-lg shadow-amber-500/30">
              {summary?.pending}
            </span>
            <div>
              <p className="font-bold text-amber-900">Action needed — pending approvals</p>
              <p className="text-sm text-amber-700">
                {summary?.pending} request{(summary?.pending ?? 0) === 1 ? '' : 's'} awaiting review
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleStatusFilter('pending')}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm font-bold transition-colors shadow-md"
          >
            {statusFilter === 'pending' ? 'Show all' : 'View pending'}
          </button>
        </div>
      )}

      {monthStats && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-800 text-white p-6 shadow-xl shadow-violet-900/20">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-widest">
              {data?.month} leave activity
              {filtersActive ? ' (filtered view)' : ''}
            </p>
            <p className="text-4xl lg:text-5xl font-black mt-2 tabular-nums">{monthStats.total}</p>
            <p className="text-violet-200/90 text-sm mt-1">requests with leave starting this month</p>
            <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-white/20">
              <div>
                <p className="text-violet-200 text-xs">Approved</p>
                <p className="text-lg font-bold tabular-nums text-emerald-300">{monthStats.approved}</p>
              </div>
              <div>
                <p className="text-violet-200 text-xs">Pending</p>
                <p className="text-lg font-bold tabular-nums text-amber-200">{monthStats.pending}</p>
              </div>
              <div>
                <p className="text-violet-200 text-xs">Approved days</p>
                <p className="text-lg font-bold tabular-nums">{monthStats.approvedDays}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 shadow-xl shadow-emerald-900/20">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">All-time approved days</p>
            <p className="text-4xl font-black mt-2 tabular-nums">{summary?.approvedDays ?? '—'}</p>
            <p className="text-emerald-100/80 text-sm mt-1">across {summary?.approved ?? 0} approved requests</p>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Monthly leave timeline</h2>
          <p className="text-xs text-slate-500">Click a month to filter by leave start date</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {timeline.map((m, i) => {
            const active = m.monthKey === selectedMonth
            const grad = TIMELINE_GRADIENTS[i % TIMELINE_GRADIENTS.length]
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
                <p className={`text-xs font-bold uppercase ${active ? 'text-white/80' : 'text-slate-400'}`}>
                  {m.shortLabel}
                </p>
                <p className={`text-lg font-black mt-1 tabular-nums ${active ? 'text-white' : 'text-[#C1121F]'}`}>
                  {m.total}
                </p>
                <p className={`text-[10px] mt-1 ${active ? 'text-white/70' : 'text-slate-500'}`}>
                  {m.approved} ok · {m.pending} wait
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          ['Total', summary?.total ?? '—', 'text-slate-900', 'bg-white', ''],
          ['Pending', summary?.pending ?? '—', 'text-amber-600', 'bg-amber-50/60', 'pending'],
          ['Approved', summary?.approved ?? '—', 'text-emerald-600', 'bg-emerald-50/60', 'approved'],
          ['Rejected', summary?.rejected ?? '—', 'text-red-600', 'bg-red-50/60', 'rejected'],
          ['Approved days', summary?.approvedDays ?? '—', 'text-[#C1121F]', 'bg-red-50/30', ''],
        ].map(([label, val, color, bg, filterKey]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => filterKey && toggleStatusFilter(String(filterKey))}
            disabled={!filterKey}
            className={`hr-card py-4 text-left transition-all ${bg} ${
              filterKey && statusFilter === filterKey ? 'ring-2 ring-[#C1121F] ring-offset-1' : ''
            } ${filterKey ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}`}
          >
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${color}`}>{val}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {typeBreakdown.map(({ type, count }) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter((prev) => (prev === type ? '' : type))}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all ring-1 ${
              typeFilter === type
                ? `bg-gradient-to-r ${TYPE_GRADIENTS[type]} text-white shadow-lg ring-transparent`
                : `${TYPE_STYLES[type]} hover:shadow-md`
            }`}
          >
            {type}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                typeFilter === type ? 'bg-white/25' : 'bg-white/80'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

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
            placeholder="Search employee, code, or reason…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="hr-input max-w-[180px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">All pending</option>
            <option value="pending_manager">Pending manager</option>
            <option value="pending_hr">Pending HR</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="hr-input max-w-[160px]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="casual">Casual</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select className="hr-input max-w-[220px]" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {HR_DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label} ({deptCounts[d.value] ?? 0})
              </option>
            ))}
          </select>
        </div>
        {filtersActive && (
          <div className="flex flex-wrap gap-2 pt-1">
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Search: {search.trim()}
                <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-700">×</button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Status: {statusFilter.replace(/_/g, ' ')}
                <button type="button" onClick={() => setStatusFilter('')} className="text-amber-500 hover:text-amber-800">×</button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 capitalize">
                Type: {typeFilter}
                <button type="button" onClick={() => setTypeFilter('')} className="text-sky-500 hover:text-sky-800">×</button>
              </span>
            )}
            {deptFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800">
                Dept: {deptLabel(deptFilter)}
                <button type="button" onClick={() => setDeptFilter('')} className="text-violet-500 hover:text-violet-800">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="hr-card overflow-hidden p-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[960px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <th className="px-5 py-3.5 font-semibold">Employee</th>
                <th className="px-4 py-3.5 font-semibold">Leave type</th>
                <th className="px-4 py-3.5 font-semibold">Dates</th>
                <th className="px-4 py-3.5 font-semibold text-center">Days</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Applied</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                    <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#C1121F] border-t-transparent mr-2 align-middle" />
                    Loading leave requests…
                  </td>
                </tr>
              )}
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                    {filtersActive || data?.totalUnfiltered
                      ? 'No requests match your filters.'
                      : 'No leave requests yet.'}
                  </td>
                </tr>
              )}
              {!loading &&
                requests.map((r) => {
                  const expanded = expandedId === r.id
                  const isPending = r.status === 'pending_manager' || r.status === 'pending_hr'
                  return (
                    <Fragment key={r.id}>
                      <tr
                        className={`border-b border-slate-100 transition-colors ${
                          isPending ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] text-white text-xs font-bold shadow-md">
                              {initials(r.employee?.fullName)}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900">{r.employee?.fullName || '—'}</p>
                              <p className="text-xs text-slate-400 font-mono">{r.employee?.employeeCode}</p>
                              <p className="text-xs text-slate-500">{deptLabel(r.department)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ring-1 ${TYPE_STYLES[r.leaveType] || TYPE_STYLES.unpaid}`}
                          >
                            {r.leaveType}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-700 whitespace-nowrap font-medium">
                          {formatRange(r.fromDate, r.toDate, r.halfDay)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold tabular-nums text-slate-900 text-base">
                          {r.totalDays}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={statusToDropdown(r.status)}
                            disabled={actingId === r.id}
                            onChange={(e) => updateStatus(r.id, e.target.value)}
                            className={`text-xs font-bold rounded-lg border px-2.5 py-1.5 min-w-[110px] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 disabled:opacity-50 ${DROPDOWN_STYLES[statusToDropdown(r.status)]}`}
                          >
                            {DROPDOWN_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {r.createdAt ? formatDate(r.createdAt.slice(0, 10)) : '—'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : r.id)}
                            className="rounded-lg bg-red-50 hover:bg-red-100 text-[#C1121F] text-xs font-bold px-3 py-1.5 transition-colors"
                          >
                            {expanded ? 'Hide' : 'Details'}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                          <td colSpan={7} className="px-5 py-5">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Reason</p>
                                <p className="text-slate-700">{r.reason || '—'}</p>
                              </div>
                              {r.managerComment && (
                                <div className="rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Manager note</p>
                                  <p className="text-slate-700">{r.managerComment}</p>
                                  {r.managerApprovedAt && (
                                    <p className="text-xs text-slate-400 mt-1">{formatDate(r.managerApprovedAt.slice(0, 10))}</p>
                                  )}
                                </div>
                              )}
                              {r.hrComment && (
                                <div className="rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">HR note</p>
                                  <p className="text-slate-700">{r.hrComment}</p>
                                  {r.hrApprovedAt && (
                                    <p className="text-xs text-slate-400 mt-1">{formatDate(r.hrApprovedAt.slice(0, 10))}</p>
                                  )}
                                </div>
                              )}
                              {r.rejectionReason && (
                                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                                  <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">Rejection / cancel</p>
                                  <p className="text-red-700">{r.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
            </tbody>
          </table>
        </div>
        {!loading && requests.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50 flex flex-wrap justify-between gap-2">
            <span>
              Showing {requests.length} of {data?.totalUnfiltered ?? requests.length} request
              {(data?.totalUnfiltered ?? requests.length) === 1 ? '' : 's'}
              {filtersActive ? ' (filtered)' : ''}
            </span>
            {data?.filteredSummary && filtersActive && (
              <span className="text-slate-400">
                {data.filteredSummary.approved} approved · {data.filteredSummary.pending} pending ·{' '}
                {data.filteredSummary.approvedDays} days
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
