import { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Courses | STEM, IoT & Robotics Training Programs",
  description: "Explore Nepatronix's comprehensive STEM-based IoT and Robotics courses for teachers, students, and schools in Nepal. Get certified with hands-on training programs.",
  keywords: [
    "STEM courses Nepal", "IoT training Nepal", "Robotics courses Nepal",
    "teacher training STEM", "certified robotics program", "Arduino course Nepal",
    "engineering course Kathmandu"
  ],
  alternates: {
    canonical: "https://nepatronix.org/services/courses",
  },
  openGraph: {
    title: "Nepatronix Courses | STEM, IoT & Robotics Training",
    description: "Hands-on IoT, Robotics and STEM courses for teachers and students in Nepal. Get certified today.",
    url: "https://nepatronix.org/services/courses",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepatronix Courses | STEM, IoT & Robotics Training",
    description: "Hands-on IoT, Robotics and STEM courses for teachers and students in Nepal.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
};

export const revalidate = 1800;

// GROQ query to fetch courses from Sanity
const coursesQuery = `*[_type == "course"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
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
  description?: string;
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
    description: course.description || "",
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

export default async function CoursesPage() {
  // Fetch courses from Sanity with no-cache
  const sanityCourses = await client.fetch<SanityCourse[]>(
    coursesQuery,
    {},
    { next: { revalidate: 1800 } }
  );
  const courses = transformCourses(sanityCourses);

  // If no courses from Sanity, show fallback message
  if (courses.length === 0) {
    console.log("No courses found from Sanity");
  }

  const coursesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nepatronix STEM & IoT Training Courses",
    "url": "https://nepatronix.org/services/courses",
    "numberOfItems": courses.length,
    "itemListElement": courses.map((course, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Course",
        "name": course.name,
        "url": "https://nepatronix.org/services/courses",
        "description": course.description || `${course.name} — a hands-on ${course.deliveryMode.toLowerCase()} training program by Nepatronix Engineering Solutions in Nepal. ${course.isFree ? "This course is available for free." : `Enrollment fee: ${course.price} ${course.priceUnit}.`} Duration: ${course.hours} hours. Exam mode: ${course.examMode}.`,
        "inLanguage": "en",
        "timeRequired": `PT${course.hours}H`,
        "courseWorkload": `PT${course.hours}H`,
        "educationalCredentialAwarded": "Certificate of Completion from Nepatronix",
        "teaches": [
          "IoT fundamentals",
          "Robotics",
          "STEM education",
          "Arduino programming",
          "Engineering problem solving"
        ],
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Nepatronix Engineering Solutions",
          "url": "https://nepatronix.org",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NP",
            "addressLocality": "Kathmandu"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": course.isFree ? "0" : String(course.price).replace(/[^0-9]/g, ""),
          "priceCurrency": "NPR",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString().split("T")[0],
          "category": course.isFree ? "Free" : "Paid"
        },
        "courseMode": course.deliveryMode.toLowerCase(),
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": course.deliveryMode.toLowerCase(),
          "inLanguage": "en",
          "courseSchedule": {
            "@type": "Schedule",
            "duration": `PT${course.hours}H`
          }
        }
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }} />
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#020617] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C1121F]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
        </div>

        <div className="relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center mt-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-[2px] w-10 bg-[#C1121F]"></span>
              <span className="text-[#C1121F] font-semibold uppercase tracking-[0.3em] text-[10px]">Our Programs</span>
              <span className="h-[2px] w-10 bg-[#C1121F]"></span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              STEM, IoT & Robotics <span className="text-[#C1121F]">Courses</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Comprehensive training programs designed to equip educators and students with essential technical, pedagogical, and professional skills.
            </p>
          </div>
        </div>
      </div>

      {/* Client Component with interactive features */}
      <CoursesClient courses={courses} objectives={objectives} />
    </div>
    </>
  );
}

