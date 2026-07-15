'use client'

import { useEffect, useState } from 'react'

type LeaveRow = {
  id: string
  leaveType: string
  fromDate: string
  toDate: string
  status: string
  totalDays: number
  reason: string
  employee?: { fullName: string; employeeCode: string }
}

export default function HrApprovalsPage() {
  const [managerQueue, setManagerQueue] = useState<LeaveRow[]>([])
  const [hrQueue, setHrQueue] = useState<LeaveRow[]>([])
  const [role, setRole] = useState('')

  function load() {
    fetch('/api/hr/me', { credentials: 'same-origin' }).then((r) => r.json()).then((d) => setRole(d.user?.role))
    fetch('/api/hr/leave?scope=manager-queue', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setManagerQueue(d.requests || []))
    fetch('/api/hr/leave?scope=hr-queue', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setHrQueue(d.requests || []))
  }

  useEffect(() => { load() }, [])

  async function act(id: string, action: string) {
    const comment = window.prompt('Comment (optional)') || ''
    await fetch(`/api/hr/leave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action, comment }),
    })
    load()
  }

  const isHr = role === 'hr_staff' || role === 'super_hr_admin'

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Leave approvals</h1>

      <section className="hr-card space-y-3">
        <h2 className="font-semibold">Manager queue</h2>
        {managerQueue.map((r) => (
          <div key={r.id} className="flex flex-wrap justify-between gap-2 py-2 border-b border-slate-100">
            <div>
              <p className="font-medium">{r.employee?.fullName} ({r.employee?.employeeCode})</p>
              <p className="text-sm capitalize">{r.leaveType} · {r.totalDays}d · {r.fromDate} – {r.toDate}</p>
              <p className="text-xs text-slate-500">{r.reason}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="hr-btn text-xs !py-1.5" onClick={() => act(r.id, 'manager_approve')}>Approve</button>
              <button type="button" className="hr-btn-secondary text-xs !py-1.5" onClick={() => act(r.id, 'reject')}>Reject</button>
            </div>
          </div>
        ))}
        {!managerQueue.length && <p className="text-sm text-slate-500">No pending manager approvals.</p>}
      </section>

      {isHr && (
        <section className="hr-card space-y-3">
          <h2 className="font-semibold">HR queue (Nepatronix final approval)</h2>
          {hrQueue.map((r) => (
            <div key={r.id} className="flex flex-wrap justify-between gap-2 py-2 border-b border-slate-100">
              <div>
                <p className="font-medium">{r.employee?.fullName} ({r.employee?.employeeCode})</p>
                <p className="text-sm capitalize">{r.leaveType} · {r.totalDays}d</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="hr-btn text-xs !py-1.5" onClick={() => act(r.id, 'hr_approve')}>HR Approve</button>
                <button type="button" className="hr-btn-secondary text-xs !py-1.5" onClick={() => act(r.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
          {!hrQueue.length && <p className="text-sm text-slate-500">No pending HR approvals.</p>}
        </section>
      )}
    </div>
  )
}
