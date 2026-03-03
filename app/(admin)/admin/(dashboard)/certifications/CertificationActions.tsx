'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { CertificateTemplate } from '@/app/(site)/components/CertificateTemplate'

const COMPANY_NAME = 'Nepatronix Engineering Solution Pvt. Ltd.'

const STATUSES = [
  { value: 'pending', label: 'Pending Payment' },
  { value: 'payment_verified', label: 'Payment Verified' },
  { value: 'approved', label: 'Approved' },
  { value: 'certificate_generated', label: 'Certificate Generated' },
  { value: 'rejected', label: 'Rejected' },
]

interface CertDataProp {
  applicantName: string
  courseName: string
  trainingHours?: string
  trainingDays?: string
  issueDate?: string
  qrCodeData?: string
}

export default function CertificationActions({
  id,
  currentStatus,
  existingCertUID,
  certData,
}: {
  id: string
  currentStatus: string
  existingCertUID?: string
  certData?: CertDataProp
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [rejectionReason, setRejectionReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [certUID, setCertUID] = useState<string | null>(existingCertUID ?? null)
  const [liveCertData, setLiveCertData] = useState<CertDataProp | undefined>(certData)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [scale, setScale] = useState(0.75)

  // Compute scale so 2000×1414 fits the viewport
  const computeScale = useCallback(() => {
    const sw = (window.innerWidth  * 0.92) / 2000
    const sh = (window.innerHeight * 0.88) / 1414
    setScale(Math.min(sw, sh, 1))
  }, [])

  useEffect(() => {
    computeScale()
    window.addEventListener('resize', computeScale)
    return () => window.removeEventListener('resize', computeScale)
  }, [computeScale])

  // Generate QR data URL from existing qrCodeData text on mount
  useEffect(() => {
    if (!certData?.qrCodeData || qrDataUrl) return
    QRCode.toDataURL(certData.qrCodeData, { width: 300, margin: 1 }).then(setQrDataUrl).catch(() => {})
  }, [certData?.qrCodeData, qrDataUrl])

  // Close modal on Escape
  useEffect(() => {
    if (!showModal) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    setError('')

    const res = await fetch('/api/update-application-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status, rejectionReason }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      setSaving(false)
      return
    }

    setMessage(data.message || `Application ${status.replace(/_/g, ' ')} successfully`)

    if (status === 'certificate_generated') {
      setGenerating(true)
      try {
        const genRes = await fetch('/api/generate-certificate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: id }),
        })
        const genData = await genRes.json()
        if (genRes.ok && genData.certificateUID) {
          setCertUID(genData.certificateUID)
          if (genData.qrCodeDataUrl) setQrDataUrl(genData.qrCodeDataUrl)
          if (genData.qrCodeData && !genData.qrCodeDataUrl) {
            QRCode.toDataURL(genData.qrCodeData, { width: 300, margin: 1 }).then(setQrDataUrl).catch(() => {})
          }
          // Update live cert data with fresh issue date
          setLiveCertData((prev) => prev ? { ...prev, issueDate: new Date().toISOString().split('T')[0] } : prev)
          setShowModal(true)
        }
      } catch {
        // generation failed silently
      }
      setGenerating(false)
    }

    router.refresh()
    setSaving(false)
  }

  const certW = Math.round(2000 * scale)
  const certH = Math.round(1414 * scale)
  const verifyURL = certUID
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://nepatronix.org'}/verify-certificate/${certUID}`
    : null

  const data = liveCertData

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Update Status</h3>

        <div>
          <label className="block text-xs text-gray-400 mb-2">Application Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setMessage(''); setError('') }}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 pr-9 appearance-none focus:outline-none focus:border-[#C1121F] transition-colors cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {status === 'rejected' && (
          <div>
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

        {message && <p className="text-sm text-green-400">{message}</p>}
        {error   && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || generating}
          className="w-full bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {(saving || generating) && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {saving ? 'Updating…' : generating ? 'Generating certificate…' : 'Update Status'}
        </button>

        {/* View Certificate button */}
        {certUID && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/8 hover:bg-purple-500/15 text-purple-300 hover:text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Certificate
            <span className="font-mono text-xs text-purple-400/70">{certUID}</span>
          </button>
        )}
      </div>

      {/* ── Full-screen Certificate Modal ── */}
      {showModal && certUID && data && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between w-full mb-3 px-1"
            style={{ maxWidth: certW }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">Certificate</span>
              <span className="font-mono text-xs text-purple-300 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-lg">{certUID}</span>
            </div>
            <div className="flex items-center gap-2">
              {verifyURL && (
                <>
                  <button
                    onClick={() => { const w = window.open(verifyURL); if (w) setTimeout(() => w.print(), 1500) }}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-200 hover:text-white bg-white/8 hover:bg-white/14 border border-white/15 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print
                  </button>
                  <a
                    href={verifyURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-200 hover:text-white bg-white/8 hover:bg-white/14 border border-white/15 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Open
                  </a>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Close
              </button>
            </div>
          </div>

          {/* Certificate rendered directly — no iframe */}
          <div
            className="shadow-2xl overflow-hidden"
            style={{ width: certW, height: certH }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '2000px',
              height: '1414px',
              transformOrigin: 'top left',
              transform: `scale(${scale})`,
            }}>
              <CertificateTemplate
                recipientName={data.applicantName}
                courseName={data.courseName}
                courseHours={data.trainingHours ?? ''}
                courseDays={data.trainingDays ?? ''}
                certificateUID={certUID}
                organizationName={COMPANY_NAME}
                issueDate={data.issueDate ?? new Date().toISOString()}
                qrCodeDataUrl={qrDataUrl ?? undefined}
                signatoryName={process.env.NEXT_PUBLIC_SIGNATORY_NAME ?? 'Director'}
                signatoryTitle={process.env.NEXT_PUBLIC_SIGNATORY_TITLE ?? 'Director, Nepatronix'}
                logoUrl={process.env.NEXT_PUBLIC_LOGO_URL}
                signatoryImageUrl={process.env.NEXT_PUBLIC_SIGNATORY_IMAGE_URL}
                partnerLogo1Url={process.env.NEXT_PUBLIC_PARTNER_LOGO_1_URL}
                partnerLogo2Url={process.env.NEXT_PUBLIC_PARTNER_LOGO_2_URL}
              />
            </div>
          </div>

          <p className="mt-3 text-gray-600 text-xs">Press Esc or click outside to close</p>
        </div>
      )}
    </>
  )
}
