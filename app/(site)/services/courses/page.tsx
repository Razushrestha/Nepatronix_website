import { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Courses | STEM, IoT & Robotics Training Programs",
  description: "Explore our comprehensive STEM-based IoT and Robotics courses designed for teachers, students, and schools. Get certified with hands-on training programs.",
  keywords: ["STEM courses Nepal", "IoT training", "Robotics courses", "Teacher training", "STEM education"],
};

export const revalidate = 0; // Disable caching - always fetch fresh data

// GROQ query to fetch courses from Sanity
const coursesQuery = `*[_type == "course"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  hours,
  deliveryMode,
  price,
  priceUnit,
  examMode,
  popular,
  isFree
}`;

interface SanityCourse {
  _id: string;
  title: string;
  slug: string;
  hours: number;
  deliveryMode: string;
  price: number;
  priceUnit: string;
  examMode: string;
  popular: boolean;
  isFree: boolean;
}

// Transform Sanity data to match the component's expected format
function transformCourses(sanityCourses: SanityCourse[]) {
  return sanityCourses.map((course, index) => ({
    id: index + 1,
    _id: course._id,
    slug: course.slug,
    name: course.title,
    hours: course.hours || 0,
    deliveryMode: course.deliveryMode || "Online",
    price: course.isFree ? "Free" : (course.price ? `NPR ${course.price.toLocaleString()}` : "Contact for price"),
    priceUnit: course.isFree ? "" : (course.priceUnit || "per person"),
    examMode: course.examMode || "Online",
    popular: course.popular || false,
    isFree: course.isFree || false,
  }));
}

const objectives = [
  "Build a solid foundation in IoT and Robotics concepts",
  "Develop project-based teaching and learning skills",
  "Understand curriculum alignment with modern STEM standards",
  "Master hands-on lab setup and equipment management",
  "Learn effective student engagement and assessment techniques",
  "Create sustainable tutoring business models",
];

export default function CoursesPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-4">What courses does Nepatronix offer?</h1>
      <p className="mb-6">Nepatronix offers hands-on STEM, robotics, and IoT courses for students and educators in Nepal. Our programs are designed to make learning technology fun, practical, and accessible for all ages and skill levels.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">What is a Nepatronix course?</h2>
      <p className="mb-4">A Nepatronix course is an interactive learning program focused on science, technology, engineering, and math (STEM). Courses include robotics, coding, electronics, and IoT, taught by expert mentors using real-world projects.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">How do Nepatronix courses work?</h2>
      <ol className="list-decimal list-inside mb-4 space-y-1">
        <li>Choose a course that matches your interest or skill level.</li>
        <li>Register online or through your school.</li>
        <li>Attend hands-on classes led by experienced mentors.</li>
        <li>Work on practical projects and group activities.</li>
        <li>Receive feedback, support, and a certificate upon completion.</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Why are Nepatronix courses important?</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Builds real-world problem-solving skills.</li>
        <li>Prepares students for future tech careers.</li>
        <li>Encourages creativity and teamwork.</li>
        <li>Makes STEM learning accessible and fun.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Best practices for choosing a course</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Pick a course that matches your current knowledge.</li>
        <li>Check the course schedule and location.</li>
        <li>Ask about hands-on activities and project work.</li>
        <li>Look for courses with experienced mentors.</li>
        <li>Read reviews or ask for recommendations.</li>
      </ul>

      <h2 className="text-xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Who can join Nepatronix courses?</h3>
          <p>Anyone interested in STEM, robotics, or IoT—students, teachers, and hobbyists of all ages—can join.</p>
        </div>
        <div>
          <h3 className="font-semibold">Do I need prior experience?</h3>
          <p>No prior experience is needed. Courses are available for beginners and advanced learners.</p>
        </div>
        <div>
          <h3 className="font-semibold">Are certificates provided?</h3>
          <p>Yes, you receive a certificate after successfully completing a course.</p>
        </div>
        <div>
          <h3 className="font-semibold">Where are the classes held?</h3>
          <p>Classes are held at Nepatronix labs, partner schools, and online. Check the course details for locations.</p>
        </div>
        <div>
          <h3 className="font-semibold">How do I enroll?</h3>
          <p>You can enroll online through our website or contact us for group registrations.</p>
        </div>
      </div>

      {/* FAQ Schema Markup for SEO & AEO */}
      <script type="application/ld+json" suppressHydrationWarning>
        {`
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Who can join Nepatronix courses?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Anyone interested in STEM, robotics, or IoT—students, teachers, and hobbyists of all ages—can join."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need prior experience?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No prior experience is needed. Courses are available for beginners and advanced learners."
              }
            },
            {
              "@type": "Question",
              "name": "Are certificates provided?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you receive a certificate after successfully completing a course."
              }
            },
            {
              "@type": "Question",
              "name": "Where are the classes held?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Classes are held at Nepatronix labs, partner schools, and online. Check the course details for locations."
              }
            },
            {
              "@type": "Question",
              "name": "How do I enroll?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can enroll online through our website or contact us for group registrations."
              }
            }
          ]
        }
        `}
      </script>
    </main>
  );
}

