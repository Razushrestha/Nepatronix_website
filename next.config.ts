import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // VPS-friendly: skip in-build typecheck (saves RAM during `next build`).
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "nepatronix.org",
      },
      {
        protocol: "https",
        hostname: "www.nepatronix.org",
      },
    ],
  },
};

export default nextConfig;
