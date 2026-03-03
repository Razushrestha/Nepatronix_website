import { client } from '@/sanity/lib/client'
import CertificationsClient from './CertificationsClient'

export const revalidate = 60

async function getCertifications() {
  return client.fetch(`
    *[_type == "certificationApplication"] | order(submittedAt desc) {
      _id,
      applicantName,
      courseName,
      courseType,
      status,
      submittedAt,
      "certificateUID": certificateDetails.certificateUID,
      "hasQR": defined(certificateDetails.qrCodeData) && certificateDetails.qrCodeData != "",
      "hasPaymentProof": defined(paymentDetails.paymentProof),
      "paymentProofUrl": paymentDetails.paymentProof.asset->url
    }
  `)
}

export default async function CertificationsPage() {
  const certs = await getCertifications()
  return <CertificationsClient certs={certs} />
}

