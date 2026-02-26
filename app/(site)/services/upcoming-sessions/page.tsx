import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
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
};

export const revalidate = 0;

// Query for courses marked as upcoming - shows all where isUpcoming is true
// Sessions will be filtered by status (upcoming/completed) on the client side
const upcomingSessionsQuery = `*[_type == "course" && isUpcoming == true] | order(sessionStartDate asc) {
  _id,
  title,
  "slug": slug.current,
  hours,
  duration,
  deliveryMode,
  price,
  priceUnit,
  isFree,
  level,
  sessionStatus,
  sessionStartDate,
  sessionEndDate,
  enrollmentDeadline,
  maxSeats,
  currentEnrollments,
  sessionVenue,
  batchName,
  meetingUrl,
  registrationLink,
  "pdfUrl": coursePdf.pdfFile.asset->url
}`;

export default async function UpcomingSessionsPage() {
  const sessions = await client.fetch<UpcomingSession[]>(
    upcomingSessionsQuery,
    {},
    { cache: 'no-store' }
  );

  // Debug: Log what we're getting from Sanity
  console.log("Upcoming sessions from Sanity:", JSON.stringify(sessions, null, 2));

  return (
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
  );
}
