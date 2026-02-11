import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  
  return {
    title: `Verify Certificate ${uid} | Nepatronix`,
    description: "Verify the authenticity of Nepatronix course completion certificate",
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { uid } = await params;

  const certificate = await client.fetch(
    `*[_type == "certificate" && certificateNumber == $uid][0]{
      certificateNumber,
      recipientName,
      courseName,
      courseHours,
      courseDays,
      issueDate,
      organizationName,
      recipientImage,
      "certificatePdfUrl": certificateFile.asset->url
    }`,
    { uid }
  );

  if (!certificate) {
    notFound();
  }

  const imageUrl = certificate.recipientImage 
    ? builder.image(certificate.recipientImage).width(200).height(200).url()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Verification Success Banner */}
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Certificate Verified ✓</h1>
              <p className="text-green-700">This certificate is authentic and issued by Nepatronix</p>
            </div>
          </div>
        </div>

        {/* Certificate Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-start gap-6 mb-6">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={certificate.recipientName}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#C1121F]"
              />
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {certificate.recipientName}
              </h2>
              <p className="text-slate-600">Certificate ID: <span className="font-mono font-semibold text-[#C1121F]">{certificate.certificateNumber}</span></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Course Name</p>
              <p className="font-semibold text-slate-900">{certificate.courseName}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Duration</p>
              <p className="font-semibold text-slate-900">
                {certificate.courseHours} hours / {certificate.courseDays} days
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Issue Date</p>
              <p className="font-semibold text-slate-900">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Issued By</p>
              <p className="font-semibold text-slate-900">{certificate.organizationName}</p>
            </div>
          </div>

          {certificate.certificatePdfUrl && (
            <div className="flex gap-4">
              <a
                href={certificate.certificatePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#C1121F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#9A0E19] transition-colors text-center"
              >
                Download Certificate
              </a>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Print
              </button>
            </div>
          )}
        </div>

        {/* Security Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">🔒 Security Information</h3>
          <p className="text-sm text-blue-700">
            This certificate can be verified at any time using the unique certificate ID. 
            Any modifications to the certificate will invalidate the verification.
          </p>
        </div>
      </div>
    </div>
  );
}
