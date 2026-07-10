'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { CertificateTemplate } from '@/app/(site)/components/CertificateTemplate'
import { normalizeCertificateGender } from '@/lib/certificate/pronouns'

type AnyObj = Record<string, unknown>

const COMPANY_NAME = 'Nepatronix Engineering Solution Pvt. Ltd.'

export default function CertificatePreview({ item, onClose }: { item: AnyObj; onClose: () => void }) {
  const [qr, setQr] = useState('')
  const cert = (item.certificateDetails as AnyObj) || {}
  const uid = String(cert.certificateUID || '')
  const profile = (item.profileImage as AnyObj) || {}

  const issueDate = cert.issueDate ? new Date(cert.issueDate as string) : new Date()
  const issueDateLabel = issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'}/verify-certificate/${uid}`

  useEffect(() => {
    const payload = [
      `Certificate UID : ${uid}`,
      `Full Name       : ${item.applicantName}`,
      `Issue Date      : ${issueDateLabel}`,
      `Company         : ${COMPANY_NAME}`,
      `Verify at       : ${verificationUrl}`,
    ].join('\n')
    QRCode.toDataURL(payload, { width: 300, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [uid, item.applicantName, issueDateLabel, verificationUrl])

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-auto p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 my-6 max-w-[1040px] w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-bold text-lg">Certificate — {uid}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl leading-none">×</button>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Use the PDF / Image buttons below to download. The preview is scaled to fit; downloads are full resolution (2000×1414).
        </p>
        {/* Scaled wrapper: template is 2000px wide, scale to fit ~1000px */}
        <div style={{ width: 1000, height: 760, overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: 2000 }}>
            <CertificateTemplate
              recipientName={String(item.applicantName || '')}
              courseName={String(item.courseName || '')}
              courseHours={String(item.trainingHours || '')}
              courseDays={String(item.trainingDays || '')}
              gender={normalizeCertificateGender(item.gender as string)}
              certificateUID={uid}
              organizationName={COMPANY_NAME}
              issueDate={issueDate.toISOString()}
              profileImageUrl={profile.url ? String(profile.url) : undefined}
              qrCodeDataUrl={qr}
              signatoryName={process.env.NEXT_PUBLIC_SIGNATORY_NAME || 'Director'}
              signatoryTitle={process.env.NEXT_PUBLIC_SIGNATORY_TITLE || 'Director, Nepatronix'}
              logoUrl={process.env.NEXT_PUBLIC_LOGO_URL}
              signatoryImageUrl={process.env.NEXT_PUBLIC_SIGNATORY_IMAGE_URL}
              partnerLogo1Url={process.env.NEXT_PUBLIC_PARTNER_LOGO_1_URL}
              partnerLogo2Url={process.env.NEXT_PUBLIC_PARTNER_LOGO_2_URL}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
