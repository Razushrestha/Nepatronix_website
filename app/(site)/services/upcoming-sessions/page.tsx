import { Metadata } from "next";
import { indexingRobots } from "@/lib/seo/indexingRobots";
import { connectToDatabase } from "@/lib/mongodb";
import { Course } from "@/lib/models";
import { resolveFileUrl } from "@/lib/content-image";
import UpcomingSessionsClient, { UpcomingSession } from "./UpcomingSessionsClient";

export const metadata: Metadata = {
  title: "Upcoming Sessions | STEM, IoT & Robotics Training",
  description: "View upcoming STEM, IoT, and Robotics training sessions by Nepatronix in Nepal. Limited seats — enroll now to secure your spot in hands-on programs.",
  keywords: [
    "upcoming STEM courses Nepal", "IoT training sessions Kathmandu", "Robotics workshop Nepal",
    "enroll robotics course", "upcoming engineering training Nepal"
  ],
  alternates: {
    canonical: "https://nepatronix.org/services/upcoming-sessions",
  },
  openGraph: {
    title: "Upcoming Training Sessions | Nepatronix Nepal",
    description: "Upcoming STEM, IoT and Robotics sessions in Nepal. Limited seats — register now!",
    url: "https://nepatronix.org/services/upcoming-sessions",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Upcoming Sessions – Nepatronix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Sessions | Nepatronix Nepal",
    description: "STEM, IoT and Robotics upcoming sessions in Nepal. Limited seats — enroll now.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
  robots: indexingRobots,
};

export const revalidate = 900;

interface CourseDoc {
  _id: unknown;
  title?: string;
  slug?: string;
  hours?: number;
  duration?: string;
  deliveryMode?: string;
  price?: number;
  priceUnit?: string;
  isFree?: boolean;
  level?: string;
  sessionStatus?: string;
  sessionStartDate?: Date | string;
  sessionEndDate?: Date | string;
  enrollmentDeadline?: Date | string;
  maxSeats?: number;
  currentEnrollments?: number;
  sessionVenue?: string;
  batchName?: string;
  meetingUrl?: string;
  registrationLink?: string;
  coursePdf?: { pdfFile?: { url?: string } };
}

async function getUpcomingSessions(): Promise<UpcomingSession[]> {
  await connectToDatabase();
  const docs = await Course.find({ isUpcoming: true })
    .sort({ sessionStartDate: 1 })
    .lean<CourseDoc[]>();

  return docs.map((course) => ({
    _id: String(course._id),
    title: course.title || "",
    slug: course.slug || "",
    hours: course.hours || 0,
    duration: course.duration || "",
    deliveryMode: course.deliveryMode || "Online",
    price: course.price || 0,
    priceUnit: course.priceUnit || "per person",
    isFree: course.isFree || false,
    level: course.level || "Beginner",
    sessionStatus: course.sessionStatus || "upcoming",
    sessionStartDate: course.sessionStartDate
      ? new Date(course.sessionStartDate).toISOString()
      : "",
    sessionEndDate: course.sessionEndDate
      ? new Date(course.sessionEndDate).toISOString()
      : "",
    enrollmentDeadline: course.enrollmentDeadline
      ? new Date(course.enrollmentDeadline).toISOString()
      : "",
    maxSeats: course.maxSeats || 0,
    currentEnrollments: course.currentEnrollments || 0,
    sessionVenue: course.sessionVenue || "",
    batchName: course.batchName || "",
    meetingUrl: course.meetingUrl || "",
    registrationLink: course.registrationLink || "",
    pdfUrl: resolveFileUrl(course.coursePdf?.pdfFile),
  }));
}

export default async function UpcomingSessionsPage() {
  const sessions = await getUpcomingSessions();

  const canonicalUrl = "https://nepatronix.org/services/upcoming-sessions";
  const sessionsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Upcoming STEM, IoT and Robotics Sessions",
    "url": canonicalUrl,
    "itemListElement": sessions.map((session, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": session.title,
        "url": canonicalUrl,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Nepatronix Engineering Solutions",
          "url": "https://nepatronix.org"
        }
      }
    }))
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I register for an upcoming session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Open the upcoming sessions page, select the session you want, and use the available registration or contact path to enroll."
        }
      },
      {
        "@type": "Question",
        "name": "Are all sessions online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Session delivery mode depends on each listing and may include online, in-person, or hybrid options."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sessionsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-[#020617] pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
          </div>

          <div className="relative z-10">
            <div className="max-w-4xl mx-auto px-6 text-center mt-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="h-[2px] w-10 bg-[#C1121F]"></span>
                <span className="text-[#C1121F] font-semibold uppercase tracking-[0.3em] text-[10px]">Enroll Now</span>
                <span className="h-[2px] w-10 bg-[#C1121F]"></span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Upcoming <span className="text-[#C1121F]">Sessions</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Secure your spot in our upcoming STEM, IoT, and Robotics training sessions. Limited seats available!
              </p>
            </div>
          </div>
        </div>

        {/* Sessions Content */}
        <UpcomingSessionsClient sessions={sessions} />
      </div>
    </>
  );
}
