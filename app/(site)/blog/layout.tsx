import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Latest news on IoT trends, robotics tutorials, and STEM education updates in Nepal from Nepatronix.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
