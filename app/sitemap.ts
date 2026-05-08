import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { ourServices } from "./(site)/data";

const baseUrl = "https://nepatronix.org";

/** Regenerate sitemap periodically so new CMS content appears without redeploying. */
export const revalidate = 600;

const sanityFetchOptions = { next: { revalidate: 600 } } as const;

type SitemapPayload = {
  posts: {
    slug: string | null;
    _updatedAt?: string;
    publishedAt?: string;
  }[];
  courses: { _id: string; _updatedAt?: string }[];
  coursePdfs: { courseId?: number; _updatedAt?: string }[];
  courseVideos: { courseId?: number; _updatedAt?: string }[];
  /** Most recently updated gallery document, for /image freshness */
  galleryTouch?: string | null;
};

const sitemapContentQuery = `{
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    _updatedAt,
    publishedAt
  },
  "courses": *[_type == "course"] | order(publishedAt desc) {
    _id,
    _updatedAt
  },
  "coursePdfs": *[_type == "coursePdf" && isPublished == true]{
    courseId,
    _updatedAt
  },
  "courseVideos": *[_type == "courseVideo" && isPublished == true]{
    courseId,
    _updatedAt
  },
  "galleryTouch": *[_type == "gallery"] | order(_updatedAt desc)[0]._updatedAt
}`;

function toTimestamp(iso?: string): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : 0;
}

function lastModifiedToMs(lm: Date | string | undefined): number {
  if (!lm) return 0;
  if (lm instanceof Date) return lm.getTime();
  const t = new Date(lm).getTime();
  return Number.isFinite(t) ? t : 0;
}

function latestDate(...timestamps: number[]): Date {
  const max = Math.max(0, ...timestamps);
  return max > 0 ? new Date(max) : new Date();
}

function putEntry(
  map: Map<string, MetadataRoute.Sitemap[number]>,
  entry: MetadataRoute.Sitemap[number]
) {
  const prev = map.get(entry.url);
  if (!prev) {
    map.set(entry.url, entry);
    return;
  }
  const prevMs = lastModifiedToMs(prev.lastModified);
  const nextMs = lastModifiedToMs(entry.lastModified);
  if (nextMs >= prevMs) {
    map.set(entry.url, { ...prev, ...entry, lastModified: entry.lastModified });
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let payload: SitemapPayload = {
    posts: [],
    courses: [],
    coursePdfs: [],
    courseVideos: [],
    galleryTouch: null,
  };

  try {
    payload = await client.fetch<SitemapPayload>(sitemapContentQuery, {}, sanityFetchOptions);
  } catch {
    // Static routes only if Sanity is unreachable
  }

  const { posts, courses, coursePdfs, courseVideos, galleryTouch } = payload;

  const map = new Map<string, MetadataRoute.Sitemap[number]>();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/services/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/services/upcoming-sessions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/services/apply-certificate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/verify-certificate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.52 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/teams`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.55 },
    {
      url: `${baseUrl}/image`,
      lastModified: latestDate(toTimestamp(galleryTouch ?? undefined)),
      changeFrequency: "weekly",
      priority: 0.58,
    },
  ];

  for (const p of staticPages) putEntry(map, p);

  const highPriorityServiceIds = new Set([
    "stem-education",
    "stem-lab-setup",
    "institutional-programs",
  ]);

  for (const service of ourServices || []) {
    putEntry(map, {
      url: `${baseUrl}/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: highPriorityServiceIds.has(service.id) ? 0.85 : 0.72,
    });
  }

  const touchByCourseId = new Map<number, number>();
  for (const row of [...coursePdfs, ...courseVideos]) {
    if (row.courseId == null || !Number.isFinite(row.courseId)) continue;
    const id = Math.floor(row.courseId);
    const t = toTimestamp(row._updatedAt);
    touchByCourseId.set(id, Math.max(touchByCourseId.get(id) ?? 0, t));
  }

  for (let i = 0; i < courses.length; i++) {
    const numericId = i + 1;
    const courseMs = toTimestamp(courses[i]._updatedAt);
    const assetMs = touchByCourseId.get(numericId) ?? 0;
    const lastModified = latestDate(courseMs, assetMs);

    putEntry(map, {
      url: `${baseUrl}/services/courses/view/${numericId}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.62,
    });
    putEntry(map, {
      url: `${baseUrl}/services/courses/watch/${numericId}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.62,
    });
  }

  for (const post of posts || []) {
    const slug = typeof post.slug === "string" ? post.slug.trim() : "";
    if (!slug) continue;
    const lastModified = latestDate(toTimestamp(post.publishedAt), toTimestamp(post._updatedAt));
    putEntry(map, {
      url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.68,
    });
  }

  return [...map.values()].sort((a, b) => a.url.localeCompare(b.url));
}
