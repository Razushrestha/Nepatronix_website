
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { blogPosts, ourServices, galleryItems, mentors, teamMembers, aboutUsData, partnerLogos } from './(site)/data';

const baseUrl = 'https://nepatronix.org';

// Helper to build <image:image> entries for sitemap (Next.js expects array of { url, caption? })
function buildImageObjects(imageUrls: string[], caption?: string) {
  return imageUrls.map((url) => ({
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    ...(caption ? { caption } : {})
  }));
}

// Collect all images for Home, About Us, Teams, and public folders
const staticImages = [
  `${baseUrl}/logo.png`,
  `${baseUrl}/title.png`,
  `${baseUrl}/Raju%20Shrestha.jpg`,
  `${baseUrl}/BankQR.png`,
  `${baseUrl}/payment-qr.png`,
  ...partnerLogos,
  // Partner images
  ...[
    'diyo.ai.png','dronehub.png','edtra.png','Esewa.png','gyanbazzar.png','himalayansolution.png','laxmisunrise.png','Siddhartha bank.png','Thokbikrita.png','Tridev.png','Yarsatech.png','Youth_Innovation_Lab_textlogo.svg_.png',
  ].map(f => `${baseUrl}/partner/${f}`),
  // Recognition images
  ...[
    'embassy_of_india-removebg-preview.png','EUbusinessforum.png','ICT.png','IITM_pravatak-removebg-preview.png','iit_madras-removebg-preview.png','INSPAN.png','KU.png','NepalGov.png',
  ].map(f => `${baseUrl}/recognition/${f}`),
  // School/College images
  ...[
    'BIT-removebg-preview.png','bramarupa-removebg-preview.png','candidcareer-removebg-preview.png','himchuli-removebg-preview.png','marvellous-removebg-preview.png','mrigashira-removebg-preview.png','nationalinfotech-removebg-preview.png','nccs-removebg-preview.png','primecollege-removebg-preview.png','rainbow-removebg-preview.png','siddhartha_vidyapeeth-removebg-preview.png','texas_college.png',
  ].map(f => `${baseUrl}/school_College/${f}`),
  // Gallery images
  ...galleryItems.map(item => item.image),
  // Mentor avatars
  ...mentors.map(m => m.avatar),
  // Team member images (if any)
  // About Us CEO image
  aboutUsData.ceo.image ? `${baseUrl}${aboutUsData.ceo.image}` : '',
].filter(Boolean);


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content from Sanity
  let sanityPosts: any[] = [];
  let sanityServices: any[] = [];
  let sanityCourses: any[] = [];
  let sanityCoursePdfs: any[] = [];
  let sanityCourseVideos: any[] = [];
  let sanityUpcomingSessions: any[] = [];
  let sanityCertificates: any[] = [];
  try {
    sanityPosts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ slug, _updatedAt, mainImage }`);
    sanityServices = await client.fetch(`*[_type == "service" && defined(_id)]{ _id, _updatedAt, icon }`);
    sanityCourses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ slug, _id, _updatedAt }`);
    sanityCoursePdfs = await client.fetch(`*[_type == "coursePdf" && isPublished == true]{ _id, courseId, title, pdfFile{asset->{url}}, thumbnail{asset->{url}} }`);
    sanityCourseVideos = await client.fetch(`*[_type == "courseVideo" && isPublished == true]{ _id, courseId, title, videoUrl, videoFile{asset->{url}}, thumbnail{asset->{url}} }`);
    sanityUpcomingSessions = await client.fetch(`*[_type == "course" && isUpcoming == true && defined(slug.current)]{ slug, _id, sessionStartDate, sessionStatus, _updatedAt }`);
    sanityCertificates = await client.fetch(`*[_type == "certificationApplication" && defined(certificateDetails.certificateUID)]{ certificateDetails, _updatedAt }`);
  } catch (e) {
    // fallback to static only
  }

  // Static and local data blog posts
  const staticBlogUrls = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.5,
    images: post.image ? buildImageObjects([post.image], post.title) : [],
  }));

  // Static and local data services
  const staticServiceUrls = (ourServices || []).map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
    images: service.icon ? buildImageObjects([`${baseUrl}/icons/${service.icon}.svg`], service.title) : [],
  }));

  // Sanity blog posts
  const sanityBlogUrls = (sanityPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug?.current || post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.6,
    images: post.mainImage?.asset?._ref ? buildImageObjects([`https://cdn.sanity.io/images/${post.mainImage.asset._ref.replace('-','/').replace('-','.')}`]) : [],
  }));

  // Sanity services
  const sanityServiceUrls = (sanityServices || []).map((service) => ({
    url: `${baseUrl}/services/${service._id}`,
    lastModified: service._updatedAt ? new Date(service._updatedAt) : new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
    images: service.icon ? buildImageObjects([`${baseUrl}/icons/${service.icon}.svg`]) : [],
  }));

  // Sanity courses (main course pages)
  const sanityCourseUrls = (sanityCourses || []).map((course) => ({
    url: `${baseUrl}/services/courses/${course.slug}`,
    lastModified: course._updatedAt ? new Date(course._updatedAt) : new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
    images: [],
  }));

  // Course PDF view pages
  const coursePdfUrls = (sanityCoursePdfs || []).map((pdf) => ({
    url: `${baseUrl}/services/courses/view/${pdf.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.5,
    images: pdf.thumbnail?.asset?.url ? buildImageObjects([pdf.thumbnail.asset.url], pdf.title) : [],
  }));

  // Course video watch pages
  const courseVideoUrls = (sanityCourseVideos || []).map((video) => ({
    url: `${baseUrl}/services/courses/watch/${video.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.5,
    images: video.thumbnail?.asset?.url ? buildImageObjects([video.thumbnail.asset.url], video.title) : [],
  }));

  // Upcoming session pages
  const upcomingSessionUrls = (sanityUpcomingSessions || []).map((session) => ({
    url: `${baseUrl}/services/upcoming-sessions/${session.slug}`,
    lastModified: session._updatedAt ? new Date(session._updatedAt) : new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.6,
    images: [],
  }));

  // Certificate verification pages
  const certificateUrls = (sanityCertificates || []).map((cert) => ({
    url: `${baseUrl}/verify-certificate/${cert.certificateDetails.certificateUID}`,
    lastModified: cert._updatedAt ? new Date(cert._updatedAt) : new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.6,
    images: [],
  }));

  // Home, About Us, Teams, and all static images
  const homeAboutTeamsUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      // changeFrequency options: 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
      // 'always'  - Changes with every visit
      // 'hourly'  - Changes every hour
      // 'daily'   - Changes every day
      // 'weekly'  - Changes every week
      // 'monthly' - Changes every month
      // 'yearly'  - Changes every year
      // 'never'   - Never changes
      changeFrequency: 'hourly' as const,
      priority: 1,
      images: buildImageObjects(staticImages),
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.7,
      images: buildImageObjects(staticImages),
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.5,
      images: buildImageObjects(staticImages),
    },
  ];

  // Other static pages
  const otherStaticUrls = [
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/services/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/upcoming-sessions`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/apply-certificate`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  return [
    ...homeAboutTeamsUrls,
    ...otherStaticUrls,
    ...staticBlogUrls,
    ...staticServiceUrls,
    ...sanityBlogUrls,
    ...sanityServiceUrls,
    ...sanityCourseUrls,
    ...coursePdfUrls,
    ...courseVideoUrls,
    ...upcomingSessionUrls,
    // Note: certificateUrls excluded — verify-certificate pages are set to noindex
  ];
}
