import { Metadata } from "next";
import Link from "next/link";
import CoursePdfViewer from "./CoursePdfViewer";
import { fetchCourseByListId, fetchCoursesOrdered } from "@/lib/course-list-order";
import { connectToDatabase } from "@/lib/mongodb";
import { CoursePdf, CourseVideo } from "@/lib/models";
import { resolveFileUrl } from "@/lib/content-image";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const courseId = parseInt(id);
  const resolved = await fetchCourseByListId(courseId);
  const canonicalUrl = `https://nepatronix.org/services/courses/view/${id}`;

  if (!resolved) {
    return {
      title: "Course Not Found | Nepatronix",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  const courseName = resolved.title;

  return {
    title: `${courseName} | Course Overview - Nepatronix`,
    description: `View the course overview and syllabus for ${courseName}. Learn about STEM, IoT, and Robotics curriculum.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${courseName} | Course Overview - Nepatronix`,
      description: `View the course overview and syllabus for ${courseName}. Learn about STEM, IoT, and Robotics curriculum.`,
      url: canonicalUrl,
      type: "website",
      images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: `${courseName} - Nepatronix` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${courseName} | Course Overview - Nepatronix`,
      description: `View the course overview and syllabus for ${courseName}.`,
      images: ["https://nepatronix.org/og-banner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

interface CoursePdfData {
  _id: string;
  title: string;
  description?: string;
  pdfUrl?: string;
}

export default async function ViewCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id);
  const resolved = await fetchCourseByListId(courseId);
  const canonicalUrl = `https://nepatronix.org/services/courses/view/${id}`;

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
  const courses = await fetchCoursesOrdered();
  const courseDoc = courses[courseId - 1];

  let pdfUrl = resolveFileUrl(courseDoc?.coursePdf?.pdfFile);
  let courseDescription =
    `Syllabus and overview for ${courseName} covering STEM, IoT, and Robotics topics.`;

  if (!pdfUrl) {
    const coursePdf = await CoursePdf.findOne({
      courseId,
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean<{ description?: string; pdfFile?: { url?: string } }>();
    pdfUrl = resolveFileUrl(coursePdf?.pdfFile);
    if (coursePdf?.description) courseDescription = coursePdf.description;
  }

  if (!pdfUrl) {
    const courseVideo = await CourseVideo.findOne({
      courseId,
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean<{ description?: string; overviewPdf?: { url?: string } }>();
    pdfUrl = resolveFileUrl(courseVideo?.overviewPdf);
    if (courseVideo?.description) courseDescription = courseVideo.description;
  }

  const courseJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonicalUrl}#course`,
    name: courseName,
    description: courseDescription,
    url: canonicalUrl,
    inLanguage: "en",
    provider: {
      "@type": "EducationalOrganization",
      "@id": "https://nepatronix.org/#organization",
      name: "Nepatronix Engineering Solutions",
      url: "https://nepatronix.org",
    },
    educationalCredentialAwarded: "Certificate of Completion from Nepatronix",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Onsite", "Online"],
      inLanguage: "en",
      location: {
        "@type": "Place",
        name: "Nepatronix Lab",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kupondole",
          addressLocality: "Lalitpur",
          addressRegion: "Bagmati",
          addressCountry: "NP",
        },
      },
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "NPR",
      price: "0",
      category: "Education",
      availability: "https://schema.org/InStock",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Students, Teachers, School Institutions",
    },
    teaches: [
      "IoT fundamentals",
      "Robotics",
      "Arduino programming",
      "STEM education",
      "Engineering problem solving",
    ],
    about: ["IoT", "Robotics", "STEM", "Arduino", "Electronics"],
  };

  if (pdfUrl) {
    courseJsonLd.hasPart = {
      "@type": "DigitalDocument",
      name: `${courseName} course overview`,
      url: pdfUrl,
      encodingFormat: "application/pdf",
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.org" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://nepatronix.org/services" },
      { "@type": "ListItem", position: 3, name: "Courses", item: "https://nepatronix.org/services/courses" },
      { "@type": "ListItem", position: 4, name: "Course Overview", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
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
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {courseName}
                </h1>
                <p className="text-slate-400">
                  Course Overview & Syllabus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {pdfUrl ? (
            <CoursePdfViewer pdfUrl={pdfUrl} courseName={courseName} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Course Overview Not Available Yet</h2>
              <p className="text-slate-500 mb-6">
                The course syllabus and overview document is being prepared. Please check back soon or contact us for more information.
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C1121F] text-white font-semibold rounded-lg hover:bg-[#A30F19] transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/services/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  View All Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
