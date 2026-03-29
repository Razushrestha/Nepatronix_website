import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery | Nepatronix",
  description: "Explore photos from Nepatronix events, workshops, and innovation activities.",
  alternates: {
    canonical: "https://nepatronix.org/image",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
