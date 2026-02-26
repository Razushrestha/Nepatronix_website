import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
    "Nepatronix provides hands-on IoT, Robotics, Arduino & PCB training in Nepal with real-world projects and expert mentors. 25,000+ students trained across 50+ schools.",
  keywords: [
    "IoT training in Nepal", "Robotics training in Nepal", "Arduino training Nepal",
    "STEM education Nepal", "PCB design training Nepal", "STEM lab setup Nepal",
    "robotics workshop Kathmandu", "IoT certification Nepal", "Nepatronix",
    "engineering training Nepal", "electronics course Nepal"
  ],
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.com" }],
  creator: "Nepatronix Engineering Solutions",
  publisher: "Nepatronix Engineering Solutions",
  category: "Education",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/title.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/title.png',
  },
  openGraph: {
    title: "Nepatronix | IoT & Robotics Training in Nepal",
    description: "Hands-on engineering training and STEM education in Kathmandu. 25,000+ students trained across 50+ schools in Nepal.",
    url: 'https://nepatronix.com',
    siteName: 'Nepatronix',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://nepatronix.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Nepatronix – IoT, Robotics & STEM Education in Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nepatronix',
    creator: '@nepatronix',
    title: 'Nepatronix | IoT & Robotics Training in Nepal',
    description: 'Hands-on engineering training and STEM education in Kathmandu. 25,000+ students trained.',
    images: ['https://nepatronix.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://nepatronix.com',
    languages: {
      'en-US': 'https://nepatronix.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ADD_YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN_HERE',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": "https://nepatronix.com/#organization",
      "name": "Nepatronix Engineering Solutions",
      "legalName": "Nepatronix Engineering Solution Pvt. Ltd.",
      "url": "https://nepatronix.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nepatronix.com/logo.png",
        "width": 200,
        "height": 60
      },
      "image": "https://nepatronix.com/og-banner.png",
      "description": "Nepal's leading IoT, Robotics and STEM EdTech company. We train students and teachers with hands-on engineering education.",
      "telephone": "+977-9803661701",
      "email": "info@nepatronix.com",
      "foundingDate": "2021",
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 20 },
      "priceRange": "NPR 5,000 - 50,000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tinkune",
        "addressLocality": "Kathmandu",
        "addressRegion": "Bagmati",
        "postalCode": "44600",
        "addressCountry": "NP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.6939,
        "longitude": 85.3442
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.facebook.com/NepaTronixx",
        "https://linkedin.com/company/nepatronix"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+977-9803661701",
          "contactType": "customer service",
          "areaServed": "NP",
          "availableLanguage": ["English", "Nepali"]
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "STEM & IoT Training Programs",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Certified STEM Education" } },
          { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "IoT & Robotics Training" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "STEM Lab Setup" } }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://nepatronix.com/#website",
      "url": "https://nepatronix.com",
      "name": "Nepatronix",
      "description": "Nepal's leading IoT, Robotics and STEM education platform",
      "publisher": { "@id": "https://nepatronix.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://nepatronix.com/blog?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1PE8XYWE1"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1PE8XYWE1');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script 
          src="https://static.cloudflareinsights.com/beacon.min.js" 
          data-cf-beacon='{"token": "f32d76b83e0f4fc09b0c3134d9b750e5"}' 
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
