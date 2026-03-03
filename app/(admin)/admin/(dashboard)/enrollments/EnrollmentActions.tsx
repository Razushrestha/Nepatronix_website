'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'cancelled', label: 'Cancelled' },
]

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  enrolled: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

interface Enrollment {
  _id: string
  fullName: string
  email: string
  phone: string
  organization?: string
  courseName: string
  coursePrice?: string
  message?: string
  status: string
  createdAt?: string
  notes?: string
}

export default function EnrollmentActions({ enrollment }: { enrollment: Enrollment }) {
  const router = useRouter()
  const [status, setStatus] = useState(enrollment.status)
  const [notes, setNotes] = useState(enrollment.notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/enrollment', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: enrollment._id, status, notes }),
    })
    setSaved(true)
    setSaving(false)
    setTimeout(() => { setSaved(false); router.refresh() }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Update Status</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                status === s.value
                  ? `${BADGE[s.value]} border-opacity-100`
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="block text-sm text-gray-400 mb-2">Internal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1121F] resize-none"
          placeholder="Add internal notes..."
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 w-full bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
