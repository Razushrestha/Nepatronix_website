'use client'

import { useEffect, useState } from 'react'

export default function HrManageLeavePage() {
  const [requests, setRequests] = useState<unknown[]>([])

  useEffect(() => {
    fetch('/api/hr/leave?scope=all', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">All leave requests</h1>
      <div className="hr-card space-y-2">
        {(requests as { id: string; employee?: { fullName: string }; leaveType: string; status: string; fromDate: string; toDate: string }[]).map((r) => (
          <div key={r.id} className="flex justify-between py-2 border-b border-slate-100 text-sm">
            <span>{r.employee?.fullName} · {r.leaveType} · {r.fromDate} – {r.toDate}</span>
            <span className="capitalize text-slate-500">{r.status.replace(/_/g, ' ')}</span>
          </div>
        ))}
        {!requests.length && <p className="text-slate-500 text-sm">No requests.</p>}
      </div>
    </div>
  )
}
