import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nepatronix.com'),
  title: {
    default: "Nepatronix | IoT, Robotics & STEM Education in Nepal",
    template: "%s | Nepatronix"
  },
  description:
    "Nepatronix provides hands-on IoT, Robotics, Arduino & PCB training in Nepal with real-world projects and expert mentors.",
  keywords: ["IoT training in Nepal", "Robotics training in Nepal", "Arduino training Nepal", "STEM education Nepal", "PCB design training Nepal"],
  openGraph: {
    title: "Nepatronix | IoT & Robotics Training in Nepal",
    description: "Hands-on engineering training and STEM education in Kathmandu.",
    url: 'https://nepatronix.com',
    siteName: 'Nepatronix',
    locale: 'en_US',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Nepatronix Engineering Solution Pvt. Ltd.",
  "url": "https://nepatronix.com",
  "sameAs": [
    "https://facebook.com/nepatronix",
    "https://linkedin.com/company/nepatronix"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kathmandu",
    "addressCountry": "NP"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "NP"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
