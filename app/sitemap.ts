import { MetadataRoute } from "next";
import { ourServices } from "./(site)/data";
import { canonicalBlogSlug } from "@/lib/blog/slugPath";
import { escapeXmlUrlForSitemap } from "@/lib/sitemap/escapeXmlUrl";
import { connectToDatabase } from "@/lib/mongodb";
import {
  CoursePdf,
  CourseVideo,
  Gallery,
  Post,
} from "@/lib/models";
import { blogPostImageUrl } from "@/lib/blog/queries";
import { fetchCoursesOrdered } from "@/lib/course-list-order";

const baseUrl = "https://nepatronix.org";

export const revalidate = 120;

function toTimestamp(iso?: string | Date): number {
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
  const normalized: MetadataRoute.Sitemap[number] = {
    ...entry,
    url: escapeXmlUrlForSitemap(entry.url),
  };
  if (normalized.images?.length) {
    normalized.images = normalized.images.map((img) =>
      typeof img === "string" ? escapeXmlUrlForSitemap(img) : img
    );
  }

  const prev = map.get(normalized.url);
  if (!prev) {
    map.set(normalized.url, normalized);
    return;
  }
  const prevMs = lastModifiedToMs(prev.lastModified);
  const nextMs = lastModifiedToMs(normalized.lastModified);
  if (nextMs >= prevMs) {
    map.set(normalized.url, { ...prev, ...normalized, lastModified: normalized.lastModified });
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const map = new Map<string, MetadataRoute.Sitemap[number]>();

  let galleryTouch: string | null = null;
  let posts: {
    slug?: string;
    mainImage?: unknown;
    updatedAt?: Date | string;
    publishedAt?: Date | string;
  }[] = [];
  let courses: { _id: unknown; updatedAt?: Date | string }[] = [];
  let coursePdfs: { courseId?: number; updatedAt?: Date | string }[] = [];
  let courseVideos: { courseId?: number; updatedAt?: Date | string }[] = [];

  try {
    await connectToDatabase();
    const [postDocs, courseDocs, pdfDocs, videoDocs, galleryDoc] = await Promise.all([
      Post.find({ slug: { $exists: true, $ne: "" } })
        .sort({ publishedAt: -1, updatedAt: -1 })
        .select("slug mainImage publishedAt updatedAt")
        .lean(),
      fetchCoursesOrdered(),
      CoursePdf.find({ isPublished: true }).select("courseId updatedAt").lean(),
      CourseVideo.find({ isPublished: true }).select("courseId updatedAt").lean(),
      Gallery.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),
    ]);

    posts = postDocs;
    courses = courseDocs.map((course) => ({
      _id: course._id,
      updatedAt: course.updatedAt,
    }));
    coursePdfs = pdfDocs;
    courseVideos = videoDocs;
    galleryTouch = galleryDoc?.updatedAt
      ? new Date(galleryDoc.updatedAt).toISOString()
      : null;
  } catch {
    // Static routes only if MongoDB is unreachable
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/services/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/services/upcoming-sessions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/services/apply-certificate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/verify-certificate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.52 },
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
    const t = toTimestamp(row.updatedAt);
    touchByCourseId.set(id, Math.max(touchByCourseId.get(id) ?? 0, t));
  }

  for (let i = 0; i < courses.length; i++) {
    const numericId = i + 1;
    const courseMs = toTimestamp(courses[i].updatedAt);
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

  let maxBlogLastModifiedMs = 0;

  for (const post of posts || []) {
    const raw = typeof post.slug === "string" ? post.slug.trim() : "";
    const slug = canonicalBlogSlug(raw);
    if (!slug) continue;
    const lastModified = latestDate(toTimestamp(post.publishedAt), toTimestamp(post.updatedAt));
    maxBlogLastModifiedMs = Math.max(maxBlogLastModifiedMs, lastModifiedToMs(lastModified));

    const entry: MetadataRoute.Sitemap[number] = {
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.68,
    };

    const imgUrl = blogPostImageUrl({ mainImage: post.mainImage as { url?: string } });
    if (imgUrl) {
      entry.images = [imgUrl.startsWith("http") ? imgUrl : `${baseUrl}${imgUrl}`];
    }

    putEntry(map, entry);
  }

  putEntry(map, {
    url: `${baseUrl}/blog`,
    lastModified:
      maxBlogLastModifiedMs > 0 ? new Date(maxBlogLastModifiedMs) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  });

  return [...map.values()].sort((a, b) => a.url.localeCompare(b.url));
}
