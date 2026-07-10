'use client'
import { useState } from 'react'
import CertificatePreview from './CertificatePreview'

type AnyObj = Record<string, unknown>

async function setStatus(id: string, status: string) {
  await fetch(`/api/admin/collections/certifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

const STEPS = [
  { key: 'pending', label: 'Pending Payment' },
  { key: 'payment_verified', label: 'Payment Verified' },
  { key: 'approved', label: 'Approved' },
  { key: 'certificate_generated', label: 'Certificate Ready' },
]

export default function CertificateActions({ item, onChanged }: { item: AnyObj; onChanged: () => void }) {
  const id = String(item._id)
  const status = String(item.status || 'pending')
  const cert = (item.certificateDetails as AnyObj) || {}
  const [busy, setBusy] = useState('')
  const [qr, setQr] = useState<string>('')
  const [preview, setPreview] = useState(false)

  const stepIndex = STEPS.findIndex((s) => s.key === status)

  async function act(action: string) {
    setBusy(action)
    try {
      if (action === 'verify') await setStatus(id, 'payment_verified')
      else if (action === 'reject') await setStatus(id, 'rejected')
      else if (action === 'approve') {
        await setStatus(id, 'approved')
      } else if (action === 'generate') {
        const res = await fetch(`/api/admin/certifications/${id}/generate`, { method: 'POST' })
        const data = await res.json()
        if (data.qrCodeDataUrl) setQr(data.qrCodeDataUrl)
      }
      onChanged()
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Certificate Workflow</h2>
        {status === 'rejected' && <span className="text-red-400 text-xs font-medium">Rejected</span>}
      </div>

      {/* Progress */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIndex ? 'bg-[#C1121F] text-white' : 'bg-gray-800 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`text-[10px] mt-1 text-center w-20 ${i <= stepIndex ? 'text-gray-300' : 'text-gray-600'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < stepIndex ? 'bg-[#C1121F]' : 'bg-gray-800'}`} />}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {status === 'pending' && (
          <button onClick={() => act('verify')} disabled={!!busy} className="px-4 py-2 text-sm rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50">
            {busy === 'verify' ? 'Verifying…' : 'Verify Payment'}
          </button>
        )}
        {(status === 'payment_verified' || status === 'pending') && (
          <button onClick={() => act('approve')} disabled={!!busy} className="px-4 py-2 text-sm rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 disabled:opacity-50">
            {busy === 'approve' ? 'Approving…' : 'Approve'}
          </button>
        )}
        {(status === 'approved' || status === 'certificate_generated') && (
          <button onClick={() => act('generate')} disabled={!!busy} className="px-4 py-2 text-sm rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50">
            {busy === 'generate' ? 'Generating…' : status === 'certificate_generated' ? 'Regenerate Certificate' : 'Generate Certificate'}
          </button>
        )}
        {status !== 'rejected' && (
          <button onClick={() => act('reject')} disabled={!!busy} className="px-4 py-2 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 ml-auto">
            Reject
          </button>
        )}
      </div>

      {/* Certificate info */}
      {cert.certificateUID && (
        <div className="flex items-start gap-4 pt-4 border-t border-gray-800">
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR" className="w-24 h-24 rounded-lg bg-white p-1" />
          )}
          <div className="text-sm space-y-2 flex-1">
            <p className="text-gray-400">UID: <span className="text-white font-mono">{String(cert.certificateUID)}</span></p>
            {cert.certificateUrl && (
              <a href={String(cert.certificateUrl)} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all block">
                {String(cert.certificateUrl)}
              </a>
            )}
            <button
              onClick={() => setPreview(true)}
              className="mt-1 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold transition-colors"
            >
              Preview &amp; Download Certificate
            </button>
          </div>
        </div>
      )}

      {preview && <CertificatePreview item={item} onClose={() => setPreview(false)} />}
    </div>
  )
}
