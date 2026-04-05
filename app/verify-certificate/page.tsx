import type { Metadata } from "next";
import Link from "next/link";

const canonicalUrl = "https://nepatronix.org/verify-certificate";

const pageDescription =
  "Learn how Nepatronix certificate verification works. Each issued certificate has a unique verification link. Apply for certification or contact us for support.";

export const metadata: Metadata = {
  title: "Verify a Nepatronix Certificate",
  description: pageDescription,
  alternates: { canonical: canonicalUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  openGraph: {
    title: "Verify a Nepatronix Certificate | Nepatronix Nepal",
    description:
      "Official information about Nepatronix course completion certificates and how verification links work.",
    url: canonicalUrl,
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix certificate verification" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify a Nepatronix Certificate",
    description: "How Nepatronix certificate verification works.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export default function VerifyCertificateHubPage() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Verify a Nepatronix certificate",
    url: canonicalUrl,
    description: pageDescription,
    isPartOf: { "@type": "WebSite", name: "Nepatronix", url: "https://nepatronix.org" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C1121F] mb-3">Nepatronix</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Certificate verification
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Nepatronix issues course completion certificates with a unique verification link for each graduate. Open the
            link you received (for example from your email or QR code on your certificate) to confirm authenticity.
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">What you need</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-2 text-sm sm:text-base">
              <li>Your personal verification URL, or the certificate ID from your document.</li>
              <li>Do not share your verification link publicly if you prefer to keep your credential private.</li>
            </ul>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/services/apply-certificate"
              className="inline-flex justify-center items-center rounded-xl bg-[#C1121F] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#A30F19] transition-colors"
            >
              Apply for a certificate
            </Link>
            <Link
              href="/contact"
              className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Contact support
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center items-center rounded-xl text-sm font-semibold text-[#C1121F] hover:underline py-3.5"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
