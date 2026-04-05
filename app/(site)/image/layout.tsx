import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery | Nepatronix",
  description: "Explore photos from Nepatronix events, workshops, and innovation activities.",
  alternates: {
    canonical: "https://nepatronix.org/image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Media Gallery | Nepatronix",
    description: "Photos from Nepatronix events, workshops, and STEM innovation activities in Nepal.",
    url: "https://nepatronix.org/image",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix media gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Gallery | Nepatronix",
    description: "Photos from Nepatronix events, workshops, and innovation activities.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
