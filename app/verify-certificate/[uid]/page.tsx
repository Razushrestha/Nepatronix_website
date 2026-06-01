import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { CertificateTemplate } from "@/app/(site)/components/CertificateTemplate";
import PrintButton from "./PrintButton";
import { normalizeCertificateGender } from "@/lib/certificate/pronouns";

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;

  return {
    title: `Verify Certificate ${uid} | Nepatronix`,
    description: `Verify the authenticity of Nepatronix certificate ID: ${uid}. Confirm your IoT, Robotics or STEM course completion certificate issued in Nepal.`,
    alternates: {
      canonical: `https://nepatronix.org/verify-certificate/${uid}`,
    },
    openGraph: {
      title: `Verify Certificate ${uid} | Nepatronix Nepal`,
      description: `Confirm the authenticity of Nepatronix certificate ID: ${uid}. Official IoT, Robotics & STEM training certification in Nepal.`,
      url: `https://nepatronix.org/verify-certificate/${uid}`,
      type: "website",
      images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix Certificate Verification" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Verify Certificate ${uid} | Nepatronix`,
      description: `Verify the authenticity of Nepatronix certificate ID: ${uid}.`,
      images: ["https://nepatronix.org/og-banner.png"],
    },
    robots: {
      index: false, // certificate pages should not be indexed
      follow: false,
    },
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { uid } = await params;

  const application = await client.fetch(
    `*[_type == "certificationApplication" && certificateDetails.certificateUID == $uid][0]{
      _id,
      applicantName,
      gender,
      courseName,
      trainingHours,
      trainingDays,
      "issueDate": certificateDetails.issueDate,
      "certificateUID": certificateDetails.certificateUID,
      "profileImage": profileImage.asset->url,
    }`,
    { uid }
  );

  if (!application) {
    notFound();
  }

  const COMPANY_NAME = "Nepatronix Engineering Solution Pvt. Ltd.";
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'}/verify-certificate/${uid}`;

  const formatDate = (d: string | null | undefined) => {
    if (!d) return 'N/A';
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const issueDateLabel = formatDate(application.issueDate);

  // Always regenerate QR from live data — never trust stored qrCodeData
  const qrPayload = [
    `Certificate UID : ${application.certificateUID}`,
    `Full Name       : ${application.applicantName}`,
    `Issue Date      : ${issueDateLabel}`,
    `Company         : ${COMPANY_NAME}`,
    `Verify at       : ${verificationUrl}`,
  ].join('\n');

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 300,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  const profileImageUrl: string | undefined = application.profileImage ?? undefined;

  return (
    <>
      {/* ── Screen view ── */}
      <div className="print:hidden min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl space-y-5">

          {/* ── Verified badge ── */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-2xl px-5 py-4">
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-green-900 text-base leading-tight">Certificate Verified</p>
              <p className="text-green-700 text-xs mt-0.5 truncate">Authentic &amp; issued by {COMPANY_NAME}</p>
            </div>
            <PrintButton />
          </div>

          {/* ── Main card ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Red header strip */}
            <div className="bg-[#C1121F] px-6 py-5 flex items-center gap-4">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={application.applicantName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                  <span className="text-white text-2xl font-bold">
                    {application.applicantName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-0.5">Certificate of Completion</p>
                <h1 className="text-white text-xl font-bold leading-tight truncate">{application.applicantName}</h1>
                <p className="text-white/80 text-sm mt-0.5 truncate">{application.courseName}</p>
              </div>
            </div>

            {/* Info rows */}
            <div className="divide-y divide-slate-100">
              {[
                { label: 'Certificate ID', value: application.certificateUID, mono: true },
                { label: 'Full Name',      value: application.applicantName },
                { label: 'Course',         value: application.courseName },
                { label: 'Duration',       value: `${application.trainingHours ?? '—'} hrs / ${application.trainingDays ?? '—'} days` },
                { label: 'Issue Date',     value: issueDateLabel },
                { label: 'Issued By',      value: COMPANY_NAME },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-start gap-3 px-6 py-3.5">
                  <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
                  <span className={`text-sm font-semibold text-slate-900 break-words min-w-0 ${mono ? 'font-mono text-[#C1121F]' : ''}`}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Verification URL row */}
              <div className="flex items-start gap-3 px-6 py-3.5">
                <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5">Verify at</span>
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#C1121F] underline underline-offset-2 break-all hover:text-[#9A0E19] transition-colors"
                >
                  {verificationUrl}
                </a>
              </div>
            </div>

            {/* QR code footer */}
            <div className="border-t border-slate-100 px-6 py-5 flex items-center gap-5 bg-slate-50">
              <img
                src={qrCodeDataUrl}
                alt="Verification QR Code"
                className="w-20 h-20 rounded-lg border border-slate-200 shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">Scan to verify</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scan this QR code with any camera app to view this certificate&apos;s verification details.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Print view — full A4 landscape certificate only ── */}
      <div className="hidden print:block">
        <CertificateTemplate
          recipientName={application.applicantName}
          courseName={application.courseName}
          courseHours={application.trainingHours ?? ''}
          courseDays={application.trainingDays ?? ''}
          gender={normalizeCertificateGender(application.gender)}
          certificateUID={application.certificateUID}
          organizationName={COMPANY_NAME}
          issueDate={application.issueDate ?? new Date().toISOString()}
          profileImageUrl={profileImageUrl}
          qrCodeDataUrl={qrCodeDataUrl}
          signatoryName={process.env.SIGNATORY_NAME ?? 'Director'}
          signatoryTitle={process.env.SIGNATORY_TITLE ?? 'Director, Nepatronix'}
          logoUrl={process.env.LOGO_URL}
          partnerLogo1Url={process.env.PARTNER_LOGO_1_URL}
          partnerLogo2Url={process.env.PARTNER_LOGO_2_URL}
        />
      </div>
    </>
  );
}
