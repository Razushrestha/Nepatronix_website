import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Nepatronix for IoT training, robotics workshops, and project collaboration in Nepal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
