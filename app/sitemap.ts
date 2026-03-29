
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { blogPosts, ourServices } from './(site)/data';

const baseUrl = 'https://nepatronix.org';

type SanityPost = {
  slug?: { current?: string } | string;
  _updatedAt?: string;
};

type SanityCourseAsset = {
  courseId?: number;
  _updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let sanityPosts: SanityPost[] = [];
  let sanityCoursePdfs: SanityCourseAsset[] = [];
  let sanityCourseVideos: SanityCourseAsset[] = [];

  try {
    sanityPosts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ slug, _updatedAt }`);
    sanityCoursePdfs = await client.fetch(`*[_type == "coursePdf" && isPublished == true]{ _id, courseId, _updatedAt }`);
    sanityCourseVideos = await client.fetch(`*[_type == "courseVideo" && isPublished == true]{ _id, courseId, _updatedAt }`);
  } catch {
    // fallback to static only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/services`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/services/courses`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/services/upcoming-sessions`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/services/apply-certificate`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/partners`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/teams`,                       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,                     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const staticServiceUrls: MetadataRoute.Sitemap = (ourServices || []).map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticBlogUrls: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const sanityBlogUrls: MetadataRoute.Sitemap = (sanityPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${typeof post.slug === 'string' ? post.slug : post.slug?.current ?? ''}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const coursePdfUrls: MetadataRoute.Sitemap = (sanityCoursePdfs || []).map((pdf) => ({
    url: `${baseUrl}/services/courses/view/${pdf.courseId}`,
    lastModified: pdf._updatedAt ? new Date(pdf._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const courseVideoUrls: MetadataRoute.Sitemap = (sanityCourseVideos || []).map((video) => ({
    url: `${baseUrl}/services/courses/watch/${video.courseId}`,
    lastModified: video._updatedAt ? new Date(video._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));
  const allEntries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...staticServiceUrls,
    ...staticBlogUrls,
    ...sanityBlogUrls,
    ...coursePdfUrls,
    ...courseVideoUrls,
  ];

  // Keep sitemap clean and deterministic for crawlers.
  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of allEntries) {
    deduped.set(entry.url, entry);
  }

  return [...deduped.values()];
}
