import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // VPS-friendly: skip in-build typecheck (saves RAM during `next build`).
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Large video/PDF uploads through `next start` (default is only 10 MB).
    proxyClientMaxBodySize: "5gb",
    serverActions: {
      bodySizeLimit: "5gb",
    },
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
