import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Breadcrumb from "./components/Breadcrumb";
import MahabirChat from "./components/MahabirChat";

// Default ISR for public SEO pages in the site group.
export const revalidate = 3600;

// Minimal metadata here — root layout (app/layout.tsx) holds the full global metadata.
// Individual pages override title, description, OG, twitter as needed.
export const metadata: Metadata = {
  openGraph: {
    siteName: 'Nepatronix',
    locale: 'en_US',
    images: [
      {
        url: 'https://nepatronix.org/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Nepatronix – IoT, Robotics & STEM Education in Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nepatronix',
    images: ['https://nepatronix.org/og-banner.png'],
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Breadcrumb />
      <main>{children}</main>
      <MahabirChat />
      <Footer />
    </>
  );
}
