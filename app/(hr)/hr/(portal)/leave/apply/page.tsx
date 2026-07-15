'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LEAVE_TYPES } from '@/lib/hr/constants'

export default function HrLeaveApplyPage() {
  const router = useRouter()
  const [leaveType, setLeaveType] = useState('annual')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [halfDay, setHalfDay] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/hr/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        leaveType,
        fromDate,
        toDate: toDate || fromDate,
        halfDay: halfDay || undefined,
        reason,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed')
      setLoading(false)
      return
    }
    router.push('/hr/leave')
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Apply for leave</h1>
      <form onSubmit={submit} className="hr-card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Leave type</label>
          <select className="hr-input" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            {LEAVE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input type="date" className="hr-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input type="date" className="hr-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Half day (optional)</label>
          <select className="hr-input" value={halfDay} onChange={(e) => setHalfDay(e.target.value)}>
            <option value="">Full day(s)</option>
            <option value="am">Morning only</option>
            <option value="pm">Afternoon only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <textarea className="hr-input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
        </div>
        <p className="text-xs text-slate-500">Requires manager approval, then Nepatronix HR approval.</p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="hr-btn" disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</button>
      </form>
    </div>
  )
}
