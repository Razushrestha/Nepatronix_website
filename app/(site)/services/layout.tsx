import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Our Services – IoT, Robotics & Engineering Solutions",
  description: "Explore Nepatronix services: IoT product development, Robotics workshops, PCB design, STEM lab setup, and certified training programs for schools in Nepal.",
  keywords: [
    "IoT engineering services Nepal", "Robotics workshop Nepal", "PCB design service Nepal",
    "STEM lab setup school Nepal", "engineering solutions Nepal", "Nepatronix services"
  ],
  alternates: {
    canonical: "https://nepatronix.org/services",
  },
  openGraph: {
    title: "Nepatronix Services – IoT, Robotics & Engineering Solutions",
    description: "IoT product development, Robotics workshops, PCB design, and STEM lab setup for schools in Nepal.",
    url: "https://nepatronix.org/services",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepatronix Services – IoT, Robotics & Engineering",
    description: "IoT product development, Robotics workshops, PCB design and STEM lab setup for schools in Nepal.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
