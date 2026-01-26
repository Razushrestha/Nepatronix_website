import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Breadcrumb from "./components/Breadcrumb";
import MahabirChat from "./components/MahabirChat";

export const metadata: Metadata = {
  metadataBase: new URL('https://nepatronix.com'),
  title: {
    default: "Nepatronix | IoT, Robotics & STEM Education in Nepal",
    template: "%s | Nepatronix"
  },
  description:
    "Nepatronix provides hands-on IoT, Robotics, Arduino & PCB training in Nepal with real-world projects and expert mentors.",
  keywords: ["IoT training in Nepal", "Robotics training in Nepal", "Arduino training Nepal", "STEM education Nepal", "PCB design training Nepal"],
  icons: {
    icon: '/title.png',
  },
  openGraph: {
    title: "Nepatronix | IoT & Robotics Training in Nepal",
    description: "Hands-on engineering training and STEM education in Kathmandu.",
    url: 'https://nepatronix.com',
    siteName: 'Nepatronix',
    locale: 'en_US',
    type: 'website',
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
