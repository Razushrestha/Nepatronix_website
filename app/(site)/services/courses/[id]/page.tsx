import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseOverviewByListId } from "@/lib/course-overview";
import CourseDetailClient from "./CourseDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const courseId = parseInt(id, 10);
  const overview = await getCourseOverviewByListId(courseId);
  const canonicalUrl = `https://nepatronix.org/services/courses/${id}`;

  if (!overview) {
    return {
      title: "Course Not Found | Nepatronix",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  return {
    title: `${overview.name} | Course Details - Nepatronix`,
    description: overview.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${overview.name} | Course Details - Nepatronix`,
      description: overview.description,
      url: canonicalUrl,
      type: "website",
      images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: `${overview.name} - Nepatronix` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${overview.name} | Course Details - Nepatronix`,
      description: overview.description,
      images: ["https://nepatronix.org/og-banner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ enroll?: string }>;
}) {
  const { id } = await params;
  const { enroll } = await searchParams;
  const courseId = parseInt(id, 10);
  const overview = await getCourseOverviewByListId(courseId);

  if (!overview) notFound();

  const canonicalUrl = `https://nepatronix.org/services/courses/${id}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.org" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://nepatronix.org/services" },
      { "@type": "ListItem", position: 3, name: "Courses", item: "https://nepatronix.org/services/courses" },
      { "@type": "ListItem", position: 4, name: overview.name, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="bg-white min-h-screen">
        <CourseDetailClient course={overview} initialEnrollOpen={enroll === "1"} />
      </div>
    </>
  );
}
