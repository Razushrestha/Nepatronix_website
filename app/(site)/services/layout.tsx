import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services - IoT, Robotics & Engineering Solutions",
  description: "Explore Nepatronix services: IoT product development, Robotics workshops, PCB design, and STEM lab setup for schools in Nepal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
