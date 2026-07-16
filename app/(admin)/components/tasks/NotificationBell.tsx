'use client'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import type { NotificationDTO } from './shared-types'
import { fetchJson, relTime } from './ui'

export default function NotificationBell({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data, mutate } = useSWR<{ notifications: NotificationDTO[]; unread: number }>(
    '/api/notifications?limit=20',
    fetchJson,
    { refreshInterval: 30000 }
  )

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const unread = data?.unread || 0
  const items = data?.notifications || []

  async function markOne(n: NotificationDTO) {
    if (!n.read) {
      await fetch(`/api/notifications/${n.id}`, { method: 'PATCH', credentials: 'same-origin' })
      mutate()
    }
    if (n.link) window.location.assign(n.link)
  }
  async function markAll() {
    await fetch('/api/notifications', { method: 'PATCH', credentials: 'same-origin' })
    mutate()
  }

  const iconColor = theme === 'dark' ? 'text-white/80' : 'text-slate-500'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={`relative p-2 rounded-lg hover:bg-slate-100 ${iconColor}`} title="Notifications">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#C1121F] text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white">
            <p className="text-sm font-bold text-slate-800">Notifications</p>
            {unread > 0 && <button onClick={markAll} className="text-xs text-[#C1121F] font-semibold hover:underline">Mark all read</button>}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications</p>
          ) : (
            items.map((n) => (
              <button key={n.id} onClick={() => markOne(n)} className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${n.read ? '' : 'bg-red-50/40'}`}>
                <div className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-[#C1121F] shrink-0" />}
                  <div className={n.read ? 'pl-4' : ''}>
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    {n.body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{relTime(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
