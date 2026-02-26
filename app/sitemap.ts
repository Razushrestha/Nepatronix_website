
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { blogPosts, ourServices } from './(site)/data';

const baseUrl = 'https://nepatronix.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let sanityPosts: any[] = [];
  let sanityServices: any[] = [];
  let sanityCourses: any[] = [];
  let sanityCoursePdfs: any[] = [];
  let sanityCourseVideos: any[] = [];
  let sanityUpcomingSessions: any[] = [];

  try {
    sanityPosts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ slug, _updatedAt }`);
    sanityServices = await client.fetch(`*[_type == "service" && defined(_id)]{ _id, _updatedAt }`);
    sanityCourses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ slug, _id, _updatedAt }`);
    sanityCoursePdfs = await client.fetch(`*[_type == "coursePdf" && isPublished == true]{ _id, courseId }`);
    sanityCourseVideos = await client.fetch(`*[_type == "courseVideo" && isPublished == true]{ _id, courseId }`);
    sanityUpcomingSessions = await client.fetch(`*[_type == "course" && isUpcoming == true && defined(slug.current)]{ slug, _id, _updatedAt }`);
  } catch (e) {
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
    url: `${baseUrl}/blog/${post.slug?.current ?? post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const sanityServiceUrls: MetadataRoute.Sitemap = (sanityServices || []).map((service) => ({
    url: `${baseUrl}/services/${service._id}`,
    lastModified: service._updatedAt ? new Date(service._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const sanityCourseUrls: MetadataRoute.Sitemap = (sanityCourses || []).map((course) => ({
    url: `${baseUrl}/services/courses/${course.slug?.current ?? course.slug}`,
    lastModified: course._updatedAt ? new Date(course._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const coursePdfUrls: MetadataRoute.Sitemap = (sanityCoursePdfs || []).map((pdf) => ({
    url: `${baseUrl}/services/courses/view/${pdf.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const courseVideoUrls: MetadataRoute.Sitemap = (sanityCourseVideos || []).map((video) => ({
    url: `${baseUrl}/services/courses/watch/${video.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const upcomingSessionUrls: MetadataRoute.Sitemap = (sanityUpcomingSessions || []).map((session) => ({
    url: `${baseUrl}/services/upcoming-sessions/${session.slug?.current ?? session.slug}`,
    lastModified: session._updatedAt ? new Date(session._updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...staticServiceUrls,
    ...staticBlogUrls,
    ...sanityBlogUrls,
    ...sanityServiceUrls,
    ...sanityCourseUrls,
    ...coursePdfUrls,
    ...courseVideoUrls,
    ...upcomingSessionUrls,
  ];
}
