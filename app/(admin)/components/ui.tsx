'use client'
import React from 'react'

export const fetcher = (url: string) =>
  fetch(url, { credentials: 'same-origin' }).then((r) => {
    if (!r.ok) throw new Error('Request failed')
    return r.json()
  })

export const COLOR_CLASSES: Record<string, string> = {
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const adminInput =
  'w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F]/20 transition-colors placeholder:text-slate-400'

export const adminCard = 'bg-white border border-slate-200 rounded-2xl shadow-sm'

export const adminHeading = 'text-2xl font-bold text-slate-900'

export const adminSubtext = 'text-slate-500 text-sm'

export function StatusBadge({
  value,
  options,
}: {
  value?: string
  options?: { value: string; label: string; color: string }[]
}) {
  if (!value) return <span className="text-slate-400 text-xs">—</span>
  const opt = options?.find((o) => o.value === value)
  const color = opt?.color || 'gray'
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${COLOR_CLASSES[color]}`}>
      {opt?.label || value.replace(/_/g, ' ')}
    </span>
  )
}

export function formatDate(v?: string) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function timeAgo(v?: string) {
  if (!v) return ''
  const diff = Date.now() - new Date(v).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(v)
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#C1121F] rounded-full animate-spin" />
    </div>
  )
}
