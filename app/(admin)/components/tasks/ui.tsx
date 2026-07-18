'use client'
import React, { createContext, useContext, useEffect } from 'react'
import { setTaskCmsAdminContext } from '@/lib/tasks/client-headers'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  progressColor,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/tasks/constants'

export type TaskApiOpts = { cmsAdmin?: boolean }

const CMS_ADMIN_HEADER = { 'X-HR-Context': 'cms-admin' }

const TaskCmsAdminContext = createContext(false)
let activeCmsAdminContext = false

export function TaskCmsAdminProvider({
  value,
  children,
}: {
  value: boolean
  children: React.ReactNode
}) {
  activeCmsAdminContext = value
  setTaskCmsAdminContext(value)
  useEffect(() => {
    setTaskCmsAdminContext(value)
    return () => setTaskCmsAdminContext(false)
  }, [value])
  return <TaskCmsAdminContext.Provider value={value}>{children}</TaskCmsAdminContext.Provider>
}

function resolveCmsAdmin(opts?: TaskApiOpts): boolean {
  return opts?.cmsAdmin ?? activeCmsAdminContext
}

function taskHeaders(opts?: TaskApiOpts): HeadersInit | undefined {
  return resolveCmsAdmin(opts) ? CMS_ADMIN_HEADER : undefined
}

/** Hook for components that need explicit fetch helpers (e.g. SWR fetchers). */
export function useTaskApi() {
  const cmsAdmin = useContext(TaskCmsAdminContext)
  const opts = cmsAdmin ? { cmsAdmin: true } satisfies TaskApiOpts : undefined
  return {
    cmsAdmin,
    fetchJson: (url: string) => fetchJson(url, opts),
    api: (url: string, method: 'POST' | 'PATCH' | 'DELETE', body?: unknown) => api(url, method, body, opts),
    fetch: (url: string, init?: RequestInit) =>
      fetch(url, {
        ...init,
        credentials: 'same-origin',
        headers: { ...taskHeaders(opts), ...init?.headers },
      }),
  }
}

export const fetchJson = async (url: string, opts?: TaskApiOpts) => {
  const r = await fetch(url, { credentials: 'same-origin', headers: taskHeaders(opts) })
  if (!r.ok) {
    let msg = `Request failed (${r.status})`
    try {
      const d = await r.json()
      if (d?.error) msg = `${d.error} (${r.status})`
    } catch {
      /* non-JSON error body */
    }
    throw new Error(msg)
  }
  return r.json()
}

export async function api(
  url: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: unknown,
  opts?: TaskApiOpts
): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    method,
    headers: body
      ? { 'Content-Type': 'application/json', ...taskHeaders(opts) }
      : taskHeaders(opts),
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_CLASS: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-600 border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  review: 'bg-violet-50 text-violet-700 border-violet-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-400 border-slate-200 line-through',
  overdue: 'bg-red-50 text-red-700 border-red-200',
}

export function PriorityBadge({ value }: { value: TaskPriority }) {
  const label = TASK_PRIORITIES.find((p) => p.value === value)?.label || value
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-semibold ${PRIORITY_CLASS[value]}`}>
      {label}
    </span>
  )
}

export function TaskStatusBadge({ value }: { value: TaskStatus }) {
  const label = TASK_STATUSES.find((s) => s.value === value)?.label || value
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-semibold capitalize ${STATUS_CLASS[value]}`}>
      {label}
    </span>
  )
}

export function ProgressBar({ percent, showLabel = true }: { percent: number; showLabel?: boolean }) {
  const c = progressColor(percent)
  const bar = c === 'green' ? 'bg-emerald-500' : c === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
      {showLabel && <span className="text-[11px] font-bold text-slate-600 tabular-nums w-9 text-right">{percent}%</span>}
    </div>
  )
}

export function Avatar({ name, size = 28 }: { name?: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() || '?'
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#C1121F] to-[#8B0D15] text-white font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={name}
    >
      {initial}
    </span>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function InlineSpinner({ className = 'w-4 h-4' }: { className?: string }) {
  return <span className={`inline-block ${className} border-2 border-slate-200 border-t-[#C1121F] rounded-full animate-spin`} />
}

export function fmtDate(v?: string) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtDateTime(v?: string) {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function relTime(v?: string) {
  if (!v) return ''
  const diff = Date.now() - new Date(v).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return fmtDate(v)
}
