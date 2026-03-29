import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us – Get in Touch",
  description: "Contact Nepatronix for IoT training, Robotics workshops, STEM lab setup, and engineering project collaboration in Kathmandu, Nepal.",
  keywords: [
    "contact Nepatronix", "IoT training inquiry Nepal", "STEM lab setup inquiry",
    "robotics workshop booking Nepal", "Nepatronix Kathmandu contact"
  ],
  alternates: {
    canonical: "https://nepatronix.org/contact",
  },
  openGraph: {
    title: "Contact Nepatronix – IoT & Robotics Training in Nepal",
    description: "Reach out to Nepatronix for STEM lab setup, robotics workshops, IoT training, and engineering collaborations in Nepal.",
    url: "https://nepatronix.org/contact",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Contact Nepatronix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Nepatronix – IoT & STEM in Nepal",
    description: "Reach out for STEM lab setup, robotics workshops and IoT training in Nepal.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
