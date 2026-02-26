import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Certificate – Get Certified in IoT & Robotics",
  description:
    "Apply for your Nepatronix course completion certificate. Get officially certified in IoT, Robotics, Arduino, and STEM training programs in Nepal.",
  keywords: [
    "apply certificate Nepatronix", "IoT certificate Nepal", "Robotics certificate Nepal",
    "STEM course certificate", "Arduino training certificate", "Nepatronix certification",
    "engineering certificate Nepal", "online certificate application Nepal"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.com" }],
  alternates: {
    canonical: "https://nepatronix.com/services/apply-certificate",
  },
  openGraph: {
    title: "Apply for Certificate | Nepatronix Nepal",
    description:
      "Apply for your official Nepatronix IoT, Robotics and STEM course completion certificate. Recognized by industry partners across Nepal.",
    url: "https://nepatronix.com/services/apply-certificate",
    type: "website",
    images: [
      {
        url: "https://nepatronix.com/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Nepatronix Certificate Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Certificate | Nepatronix Nepal",
    description:
      "Get officially certified in IoT, Robotics and STEM training programs in Nepal.",
    images: ["https://nepatronix.com/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://nepatronix.com/services" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Apply for Certificate",
        item: "https://nepatronix.com/services/apply-certificate",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
