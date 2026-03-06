import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import CertificationActions from '../CertificationActions'
import QRDisplay from '../../../../components/QRDisplay'

export const dynamic = 'force-dynamic'

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  payment_verified: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  certificate_generated: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default async function CertificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cert = await client.fetch(
    `*[_type == "certificationApplication" && _id == $id][0]{
      _id, applicantName, email, phone, courseName, courseType,
      trainingHours, trainingDays, status, submittedAt, profileImage,
      paymentDetails, certificateDetails
    }`,
    { id }
  )

  if (!cert) notFound()

  const fields = [
    { label: 'Full Name', value: cert.applicantName },
    { label: 'Email', value: cert.email },
    { label: 'Phone', value: cert.phone },
    { label: 'Course', value: cert.courseName },
    { label: 'Course Type', value: cert.courseType },
    { label: 'Training Hours', value: cert.trainingHours },
    { label: 'Training Days', value: cert.trainingDays },
    { label: 'Submitted', value: cert.submittedAt ? new Date(cert.submittedAt).toLocaleString() : '—' },
  ]

  const paymentFields = cert.paymentDetails ? [
    { label: 'Amount', value: cert.paymentDetails.amount ? `NPR ${cert.paymentDetails.amount}` : '—' },
    { label: 'Method', value: cert.paymentDetails.paymentMethod || '—' },
    { label: 'Date', value: cert.paymentDetails.paymentDate ? new Date(cert.paymentDetails.paymentDate).toLocaleDateString() : '—' },
  ] : []

  // Derive all certificate fields — fall back to computed values when not yet stored
  const certUID     = cert.certificateDetails?.certificateUID ?? null
  const certUrl     = cert.certificateDetails?.certificateUrl
                   ?? (certUID ? `https://nepatronix.org/verify-certificate/${certUID}` : null)
  const qrData      = cert.certificateDetails?.qrCodeData ?? certUrl
  const certIssueDate = cert.certificateDetails?.issueDate
                     ?? (cert.submittedAt ? cert.submittedAt.split('T')[0] : null)

  const hasUID = !!certUID

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/admin/certifications" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Back to Certifications
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {cert.profileImage && (
            <Image
              src={urlFor(cert.profileImage).width(64).height(64).url()}
              alt={cert.applicantName}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{cert.applicantName}</h1>
            <p className="text-gray-400 text-sm mt-1">{cert.courseName}</p>
          </div>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full border font-medium ${BADGE[cert.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
          {cert.status?.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Applicant Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Applicant Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.label}>
                  <dt className="text-gray-400 text-xs mb-1">{f.label}</dt>
                  <dd className="text-white text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Payment Info */}
          {paymentFields.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Payment Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {paymentFields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-gray-400 text-xs mb-1">{f.label}</dt>
                    <dd className="text-white text-sm font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {cert.paymentDetails?.paymentProof && (
                <div>
                  <p className="text-gray-400 text-xs mb-2">Payment Screenshot</p>
                  <Image
                    src={urlFor(cert.paymentDetails.paymentProof).width(400).url()}
                    alt="Payment proof"
                    width={400}
                    height={250}
                    className="rounded-xl object-contain border border-gray-700"
                  />
                </div>
              )}
            </div>
          )}

          {/* Certificate + QR */}
          {hasUID && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Certificate Details</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* QR Code — always shown when UID exists */}
                {qrData && (
                  <div className="flex-shrink-0">
                    <p className="text-gray-400 text-xs mb-2">Verification QR Code</p>
                    <QRDisplay data={qrData} />
                  </div>
                )}
                {/* UID + URL */}
                <div className="space-y-4 flex-1">
                  <div>
                    <dt className="text-gray-400 text-xs mb-1">Certificate UID</dt>
                    <dd className="text-purple-300 text-sm font-mono bg-gray-800 px-3 py-2 rounded-lg inline-block">
                      {certUID}
                    </dd>
                  </div>
                  {certIssueDate && (
                    <div>
                      <dt className="text-gray-400 text-xs mb-1">Issue Date</dt>
                      <dd className="text-white text-sm font-medium">{certIssueDate}</dd>
                    </div>
                  )}
                  {certUrl && (
                    <div>
                      <dt className="text-gray-400 text-xs mb-1">Verification URL</dt>
                      <dd>
                        <a
                          href={certUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C1121F] hover:underline text-sm break-all"
                        >
                          {certUrl}
                        </a>
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          <CertificationActions
            id={cert._id}
            currentStatus={cert.status}
            existingCertUID={cert.certificateDetails?.certificateUID}
            certData={{
              applicantName: cert.applicantName,
              courseName: cert.courseName,
              trainingHours: cert.trainingHours,
              trainingDays: cert.trainingDays,
              issueDate: certIssueDate ?? undefined,
              qrCodeData: qrData ?? undefined,
            }}
          />
        </div>
      </div>
    </div>
  )
}
