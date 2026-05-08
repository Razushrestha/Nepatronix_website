import type { Metadata } from "next";

/** Prefer merging this into metadata for important public routes so indexing intent stays explicit after layout merges. */
export const indexingRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
