'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HrLeavePage() {
  const [data, setData] = useState<{
    requests: { id: string; leaveType: string; fromDate: string; toDate: string; status: string; totalDays: number; reason: string }[]
    balance: { annual: number; annualUsed: number; sick: number; sickUsed: number; casual: number; casualUsed: number } | null
  } | null>(null)

  function load() {
    fetch('/api/hr/leave', { credentials: 'same-origin' }).then((r) => r.json()).then(setData)
  }

  useEffect(() => { load() }, [])

  async function cancel(id: string) {
    await fetch(`/api/hr/leave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'cancel' }),
    })
    load()
  }

  const b = data?.balance

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My leave</h1>
        <Link href="/hr/leave/apply" className="hr-btn">Apply leave</Link>
      </div>
      {b && (
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="hr-card"><p className="text-xs text-slate-500">Annual</p><p className="font-bold">{b.annual - b.annualUsed} / {b.annual}</p></div>
          <div className="hr-card"><p className="text-xs text-slate-500">Sick</p><p className="font-bold">{b.sick - b.sickUsed} / {b.sick}</p></div>
          <div className="hr-card"><p className="text-xs text-slate-500">Casual</p><p className="font-bold">{b.casual - b.casualUsed} / {b.casual}</p></div>
        </div>
      )}
      <div className="hr-card space-y-3">
        <h2 className="font-semibold">Applications</h2>
        {(data?.requests || []).map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="font-medium capitalize">{r.leaveType} · {r.totalDays} day(s)</p>
              <p className="text-sm text-slate-500">{r.fromDate}{r.toDate !== r.fromDate ? ` → ${r.toDate}` : ''}</p>
              <p className="text-xs text-slate-400">{r.reason}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 capitalize">{r.status.replace(/_/g, ' ')}</span>
              {['pending_manager', 'pending_hr'].includes(r.status) && (
                <button type="button" className="text-xs text-red-600" onClick={() => cancel(r.id)}>Cancel</button>
              )}
            </div>
          </div>
        ))}
        {!data?.requests?.length && <p className="text-slate-500 text-sm">No leave applications yet.</p>}
      </div>
    </div>
  )
}
