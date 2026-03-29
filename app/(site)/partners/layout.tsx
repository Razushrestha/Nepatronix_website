import type { Metadata } from "next";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Partners & About Us – Our Story",
  description:
    "Learn about Nepatronix's mission, vision, and our 50+ school partnerships across Nepal. Discover how we're transforming STEM education and engineering in Nepal.",
  keywords: [
    "Nepatronix partners Nepal", "STEM education partners Nepal", "about Nepatronix",
    "IoT company Nepal", "robotics company Kathmandu", "Nepatronix mission",
    "STEM school Nepal", "engineering education Nepal"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.org" }],
  alternates: {
    canonical: "https://nepatronix.org/partners",
  },
  openGraph: {
    title: "Partners & About Us | Nepatronix Nepal",
    description:
      "Nepatronix partners with 50+ schools across Nepal to deliver world-class STEM and IoT education. Learn about our mission.",
    url: "https://nepatronix.org/partners",
    type: "website",
    images: [
      {
        url: "https://nepatronix.org/og-banner.png",
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
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
