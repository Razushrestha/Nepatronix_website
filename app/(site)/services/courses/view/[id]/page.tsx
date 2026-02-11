import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import CoursePdfViewer from "./CoursePdfViewer";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    title: `${courseName} | Course Overview - Nepatronix`,
    description: `View the course overview and syllabus for ${courseName}. Learn about STEM, IoT, and Robotics curriculum.`,
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

  // First, try to fetch course with embedded PDF from the course document itself
  let courseData: CoursePdfData | null = await client.fetch(
    `*[_type == "course"] | order(publishedAt desc) [$courseIndex] {
      _id,
      title,
      description,
      "pdfUrl": coursePdf.pdfFile.asset->url
    }`,
    { courseIndex: courseId - 1 }
  );

  // If no embedded PDF found, fall back to separate coursePdf document
  if (!courseData?.pdfUrl) {
    courseData = await client.fetch(
      `*[_type == "coursePdf" && courseId == $courseId && isPublished == true] | order(order asc) [0] {
        _id,
        title,
        description,
        "pdfUrl": pdfFile.asset->url
      }`,
      { courseId }
    );
  }

  // Final fallback: check old courseVideo schema
  if (!courseData?.pdfUrl) {
    courseData = await client.fetch(
      `*[_type == "courseVideo" && courseId == $courseId && isPublished == true] | order(order asc) [0] {
        _id,
        title,
        description,
        "pdfUrl": coalesce(pdfFile.asset->url, overviewPdf.asset->url)
      }`,
      { courseId }
    );
  }

  console.log("Course Data for ID", courseId, ":", JSON.stringify(courseData, null, 2));

  const pdfUrl = courseData?.pdfUrl;

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
  );
}
