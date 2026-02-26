import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team – Engineers, Educators & Innovators",
  description:
    "Meet the Nepatronix team — a passionate group of engineers, educators, and innovators driving STEM and IoT education across Nepal.",
  keywords: [
    "Nepatronix team", "IoT engineers Nepal", "STEM educators Nepal",
    "robotics experts Nepal", "Nepatronix founders", "engineering team Kathmandu"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.com" }],
  alternates: {
    canonical: "https://nepatronix.com/teams",
  },
  openGraph: {
    title: "Our Team | Nepatronix – Engineers & Educators in Nepal",
    description:
      "Meet Nepatronix's passionate team of engineers and educators driving IoT and STEM education across Nepal.",
    url: "https://nepatronix.com/teams",
    type: "website",
    images: [
      {
        url: "https://nepatronix.com/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Nepatronix Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | Nepatronix Engineers & Educators",
    description:
      "Meet the team behind Nepal's leading IoT and STEM education company.",
    images: ["https://nepatronix.com/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nepatronix.com" },
      { "@type": "ListItem", "position": 2, "name": "Our Team", "item": "https://nepatronix.com/teams" }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
