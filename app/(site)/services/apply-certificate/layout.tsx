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
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.org" }],
  alternates: {
    canonical: "https://nepatronix.org/services/apply-certificate",
  },
  openGraph: {
    title: "Apply for Certificate | Nepatronix Nepal",
    description:
      "Apply for your official Nepatronix IoT, Robotics and STEM course completion certificate. Recognized by industry partners across Nepal.",
    url: "https://nepatronix.org/services/apply-certificate",
    type: "website",
    images: [
      {
        url: "https://nepatronix.org/og-banner.png",
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
    images: ["https://nepatronix.org/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
