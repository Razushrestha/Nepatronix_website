import type { Metadata } from "next";
import { indexingRobots } from "@/lib/seo/indexingRobots";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Our Team – Engineers, Educators & Innovators",
  description:
    "Meet the Nepatronix team — a passionate group of engineers, educators, and innovators driving STEM and IoT education across Nepal.",
  keywords: [
    "Nepatronix team", "IoT engineers Nepal", "STEM educators Nepal",
    "robotics experts Nepal", "Nepatronix founders", "engineering team Kathmandu"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.org" }],
  alternates: {
    canonical: "https://nepatronix.org/teams",
  },
  openGraph: {
    title: "Our Team | Nepatronix – Engineers & Educators in Nepal",
    description:
      "Meet Nepatronix's passionate team of engineers and educators driving IoT and STEM education across Nepal.",
    url: "https://nepatronix.org/teams",
    type: "website",
    images: [
      {
        url: "https://nepatronix.org/og-banner.png",
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
    images: ["https://nepatronix.org/og-banner.png"],
  },
  robots: indexingRobots,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
