import { Metadata } from "next";
import Link from "next/link";
import CourseVideoPlayer from "./CourseVideoPlayer";
import { fetchCourseByListId } from "@/lib/course-list-order";
import { connectToDatabase } from "@/lib/mongodb";
import { CourseVideo } from "@/lib/models";
import { resolveFileUrl, resolveImageUrl } from "@/lib/content-image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const courseId = parseInt(id);
  const resolved = await fetchCourseByListId(courseId);
  const canonicalUrl = `https://nepatronix.org/services/courses/watch/${id}`;

  if (!resolved) {
    return {
      title: "Course Not Found | Nepatronix",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  const courseName = resolved.title;

  return {
    title: `Watch ${courseName} | Nepatronix`,
    description: `Access course videos for ${courseName}. Learn STEM, IoT, and Robotics with expert-led video content.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Watch ${courseName} | Nepatronix`,
      description: `Access course videos for ${courseName}. Learn STEM, IoT, and Robotics with expert-led video content.`,
      url: canonicalUrl,
      type: "video.other",
      images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: `${courseName} video course - Nepatronix` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Watch ${courseName} | Nepatronix`,
      description: `Access course videos for ${courseName}.`,
      images: ["https://nepatronix.org/og-banner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
    },
  };
}

interface CourseVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoFile?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  thumbnail?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  overviewPdf?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  duration?: string;
  order: number;
}

function toIsoDuration(duration?: string): string | undefined {
  if (!duration) return undefined;
  const clean = duration.trim().toLowerCase();

  const hms = clean.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (hms) {
    const first = Number(hms[1]);
    const second = Number(hms[2]);
    const third = hms[3] ? Number(hms[3]) : 0;
    if (hms[3]) {
      return `PT${first}H${second}M${third}S`;
    }
    return `PT${first}M${second}S`;
  }

  const hourMatch = clean.match(/(\d+)\s*h/);
  const minMatch = clean.match(/(\d+)\s*m/);
  const secMatch = clean.match(/(\d+)\s*s/);
  if (hourMatch || minMatch || secMatch) {
    const h = hourMatch ? Number(hourMatch[1]) : 0;
    const m = minMatch ? Number(minMatch[1]) : 0;
    const s = secMatch ? Number(secMatch[1]) : 0;
    return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || undefined;
  }

  return undefined;
}

export default async function WatchCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id);
  const resolved = await fetchCourseByListId(courseId);

  if (!resolved) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Link href="/services/courses" className="text-[#C1121F] hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const courseName = resolved.title;

  await connectToDatabase();
  const videoDocs = await CourseVideo.find({ courseId, isPublished: true })
    .sort({ order: 1 })
    .lean<
      {
        _id: unknown;
        title?: string;
        description?: string;
        videoUrl?: string;
        videoFile?: { url?: string };
        thumbnail?: { url?: string };
        overviewPdf?: { url?: string };
        duration?: string;
        order?: number;
        createdAt?: Date | string;
        updatedAt?: Date | string;
      }[]
    >();

  const videos = videoDocs.map((video) => {
    const fileUrl = resolveFileUrl(video.videoFile);
    const thumbUrl = resolveImageUrl(video.thumbnail);
    const overviewUrl = resolveFileUrl(video.overviewPdf);
    return {
      _id: String(video._id),
      title: video.title || "",
      description: video.description,
      videoUrl: video.videoUrl,
      videoFile: fileUrl ? { asset: { url: fileUrl }, url: fileUrl } : undefined,
      thumbnail: thumbUrl ? { asset: { url: thumbUrl }, url: thumbUrl } : undefined,
      overviewPdf: overviewUrl ? { asset: { url: overviewUrl }, url: overviewUrl } : undefined,
      duration: video.duration,
      order: video.order || 0,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }) as (CourseVideo & { createdAt?: Date | string; updatedAt?: Date | string })[];

  const canonicalUrl = `https://nepatronix.org/services/courses/watch/${id}`;
  const courseUrl = "https://nepatronix.org/services/courses";

  const toIso = (d: Date | string | undefined) => {
    if (!d) return undefined;
    try {
      const iso = new Date(d).toISOString();
      return Number.isFinite(new Date(iso).getTime()) ? iso : undefined;
    } catch {
      return undefined;
    }
  };

  const videoObjects = videos.map((video, index) => {
    const contentUrl =
      video.videoFile?.asset?.url ||
      video.videoFile?.url ||
      video.videoUrl;
    const thumbnailUrl =
      video.thumbnail?.asset?.url ||
      video.thumbnail?.url ||
      "https://nepatronix.org/og-banner.png";

    const uploadDate = toIso(video.createdAt) || toIso(video.updatedAt) || new Date().toISOString();

    const baseVideo: Record<string, unknown> = {
      "@type": "VideoObject",
      "@id": `${canonicalUrl}#video-${index + 1}`,
      name: video.title,
      description: video.description || `${video.title} from ${courseName}.`,
      thumbnailUrl,
      url: canonicalUrl,
      uploadDate,
      inLanguage: "en",
      position: index + 1,
      isFamilyFriendly: true,
      publisher: {
        "@type": "Organization",
        "@id": "https://nepatronix.org/#organization",
        name: "Nepatronix Engineering Solutions",
        url: "https://nepatronix.org",
        logo: {
          "@type": "ImageObject",
          url: "https://nepatronix.org/logo.png",
        },
      },
      hasPart: { "@type": "Course", name: courseName, url: canonicalUrl },
    };

    const isoDuration = toIsoDuration(video.duration);
    if (isoDuration) {
      baseVideo.duration = isoDuration;
    }
    if (contentUrl) {
      baseVideo.contentUrl = contentUrl;
      baseVideo.embedUrl = contentUrl;
    }

    return baseVideo;
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${courseName} videos`,
    itemListElement: videoObjects.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.org" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://nepatronix.org/services" },
      { "@type": "ListItem", position: 3, name: "Courses", item: courseUrl },
      { "@type": "ListItem", position: 4, name: "Course Videos", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#020617] pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <Link 
              href="/services/courses"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Courses
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {courseName}
            </h1>
            <p className="text-slate-400">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {videos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No Videos Available Yet</h2>
              <p className="text-slate-500 mb-6">
                Course videos are being prepared. Please check back soon or contact us for more information.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C1121F] text-white font-semibold rounded-lg hover:bg-[#A30F19] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          ) : (
            <CourseVideoPlayer videos={videos} courseName={courseName} />
          )}
        </div>
      </div>
    </>
  );
}
