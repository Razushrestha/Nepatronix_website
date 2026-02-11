import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import CourseVideoPlayer from "./CourseVideoPlayer";

// Course names mapping
const courseNames: Record<number, string> = {
  1: "Short Course on STEM-Based IoT and Robotics",
  2: "Tutor Training Certification on STEM-Based IoT and Robotics",
  3: "Professional Certificate on STEM-Based IoT and Robotics",
  4: "Occupational Certificate in Science Laboratory Setup and Operation",
  5: "Occupational Certificate in Math-Integrated STEM Teaching",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const courseId = parseInt(id);
  const courseName = courseNames[courseId] || "Course";
  
  return {
    title: `Watch ${courseName} | Nepatronix`,
    description: `Access course videos for ${courseName}. Learn STEM, IoT, and Robotics with expert-led video content.`,
  };
}

interface CourseVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoFile?: {
    asset: {
      url: string;
    };
  };
  thumbnail?: {
    asset: {
      url: string;
    };
  };
  overviewPdf?: {
    asset: {
      url: string;
    };
  };
  duration?: string;
  order: number;
}

export default async function WatchCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id);
  const courseName = courseNames[courseId];

  if (!courseName) {
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

  // Fetch videos for this course from Sanity
  const videos: CourseVideo[] = await client.fetch(
    `*[_type == "courseVideo" && courseId == $courseId && isPublished == true] | order(order asc) {
      _id,
      title,
      description,
      videoUrl,
      "videoFile": videoFile.asset->{url},
      "thumbnail": thumbnail.asset->{url},
      "overviewPdf": overviewPdf.asset->{url},
      duration,
      order
    }`,
    { courseId }
  );

  return (
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
  );
}
