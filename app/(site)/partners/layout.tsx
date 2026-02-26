import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners & About Us – Our Story",
  description:
    "Learn about Nepatronix's mission, vision, and our 50+ school partnerships across Nepal. Discover how we're transforming STEM education and engineering in Nepal.",
  keywords: [
    "Nepatronix partners Nepal", "STEM education partners Nepal", "about Nepatronix",
    "IoT company Nepal", "robotics company Kathmandu", "Nepatronix mission",
    "STEM school Nepal", "engineering education Nepal"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.com" }],
  alternates: {
    canonical: "https://nepatronix.com/partners",
  },
  openGraph: {
    title: "Partners & About Us | Nepatronix Nepal",
    description:
      "Nepatronix partners with 50+ schools across Nepal to deliver world-class STEM and IoT education. Learn about our mission.",
    url: "https://nepatronix.com/partners",
    type: "website",
    images: [
      {
        url: "https://nepatronix.com/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Nepatronix Partners – STEM Education in Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partners & About Us | Nepatronix Nepal",
    description:
      "Nepatronix partners with 50+ schools across Nepal for STEM and IoT education.",
    images: ["https://nepatronix.com/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nepatronix.com" },
      { "@type": "ListItem", "position": 2, "name": "Partners & About Us", "item": "https://nepatronix.com/partners" }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
