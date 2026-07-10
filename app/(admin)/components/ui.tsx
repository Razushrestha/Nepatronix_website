'use client'
import React from 'react'

export const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Request failed')
    return r.json()
  })

export const COLOR_CLASSES: Record<string, string> = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export function StatusBadge({
  value,
  options,
}: {
  value?: string
  options?: { value: string; label: string; color: string }[]
}) {
  if (!value) return <span className="text-gray-600 text-xs">—</span>
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
      <div className="w-8 h-8 border-2 border-white/10 border-t-[#C1121F] rounded-full animate-spin" />
    </div>
  )
}
