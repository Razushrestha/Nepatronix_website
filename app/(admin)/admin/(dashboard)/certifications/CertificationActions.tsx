'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'pending', label: 'Pending Payment' },
  { value: 'payment_verified', label: 'Payment Verified' },
  { value: 'approved', label: 'Approved' },
  { value: 'certificate_generated', label: 'Certificate Generated' },
  { value: 'rejected', label: 'Rejected' },
]

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  payment_verified: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  certificate_generated: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function CertificationActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [rejectionReason, setRejectionReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/update-application-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status, rejectionReason }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage(data.message || 'Status updated!')
      router.refresh()
    } else {
      setMessage(data.error || 'Something went wrong.')
    }
    setSaving(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Update Status</h3>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-2">Application Status</label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 pr-9 appearance-none focus:outline-none focus:border-[#C1121F] transition-colors cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {status === 'rejected' && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Rejection Reason</label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1121F] resize-none"
            placeholder="Reason for rejection..."
          />
        </div>
      )}

      {message && (
        <p className="text-sm text-green-400 mb-3">{message}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
      >
        {saving ? 'Updating…' : 'Update Status'}
      </button>
    </div>
  )
}
