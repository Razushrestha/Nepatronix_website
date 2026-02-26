import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Latest news on IoT trends, robotics tutorials, and STEM education updates in Nepal from Nepatronix.",
  keywords: [
    "Robotics blog Nepal", "IoT insights Nepal", "STEM education articles",
    "Nepatronix news", "Technology trends Nepal", "engineering education Nepal"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.com" }],
  alternates: {
    canonical: "https://nepatronix.com/blog",
  },
  openGraph: {
    title: "Nepatronix Blog | Technology & Education Insights",
    description: "Stay updated with the latest trends in engineering, robotics, and hands-on learning in Nepal.",
    url: "https://nepatronix.com/blog",
    type: "website",
    images: [{ url: "https://nepatronix.com/og-banner.png", width: 1200, height: 630, alt: "Nepatronix Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepatronix Blog | Technology & Education Insights",
    description: "Latest news and insights on IoT, Robotics and STEM education in Nepal.",
    images: ["https://nepatronix.com/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nepatronix.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://nepatronix.com/blog" }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
