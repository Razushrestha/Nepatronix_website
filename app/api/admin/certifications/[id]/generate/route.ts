import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { connectToDatabase } from '@/lib/mongodb'
import { Certification } from '@/lib/models'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

async function generateCertificateUID(): Promise<string> {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const count = await Certification.countDocuments({ 'certificateDetails.certificateUID': { $exists: true, $ne: null } })
  const seq = (count + 1).toString().padStart(2, '0')
  return `NT-${date}-${seq}`
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectToDatabase()

  const app = await Certification.findById(id)
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const certificateUID = app.certificateDetails?.certificateUID || (await generateCertificateUID())
  const issueDate = new Date()
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'}/verify-certificate/${certificateUID}`
  const COMPANY_NAME = 'Nepatronix Engineering Solution Pvt. Ltd.'

  const qrPayload = [
    `Certificate UID : ${certificateUID}`,
    `Full Name       : ${app.applicantName}`,
    `Issue Date      : ${issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    `Company         : ${COMPANY_NAME}`,
    `Verify at       : ${verificationUrl}`,
  ].join('\n')

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 300,
    margin: 1,
    color: { dark: '#000000', light: '#FFFFFF' },
  })

  app.status = 'certificate_generated'
  app.certificateDetails = {
    certificateUID,
    issueDate,
    certificateUrl: verificationUrl,
    qrCodeData: qrPayload,
  }
  await app.save()

  return NextResponse.json({
    success: true,
    certificateUID,
    verificationUrl,
    qrCodeDataUrl,
  })
}
