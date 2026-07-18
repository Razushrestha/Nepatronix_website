"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  _id?: string;
  slug?: string;
  name: string;
  description?: string;
  hours: number;
  deliveryMode: string;
  price: string;
  priceUnit: string;
  examMode: string;
  popular: boolean;
  isFree: boolean;
}

interface CoursesClientProps {
  courses: Course[];
  objectives: string[];
}

type FilterType = "all" | "free" | "paid";

export default function CoursesClient({ courses, objectives }: CoursesClientProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "free") return course.isFree;
    if (activeFilter === "paid") return !course.isFree;
    return true;
  });

  const goToCourse = (course: Course) => {
    router.push(`/services/courses/${course.id}`);
  };

  return (
    <>
      {/* Program Goal Section */}
      <div className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#C1121F] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Overall Program Goal</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              To equip aspiring and practicing tutors with essential <span className="font-semibold text-slate-900">technical, pedagogical, professional, and business skills</span> to deliver high-quality, hands-on STEM, IoT, and Robotics education in schools, while building structured, accountable, and financially sustainable tutoring programs that integrate Science experiments and Math applications effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Key Objectives Section */}
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C1121F] font-semibold uppercase tracking-[0.2em] text-[11px]">What You&apos;ll Achieve</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Key Objectives</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {objectives.map((objective, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-[#C1121F]/20 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#C1121F]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#C1121F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Table Section */}
      <div className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[#C1121F] font-semibold uppercase tracking-[0.2em] text-[11px]">Certification Programs</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Available Courses</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Choose from our range of STEM-based IoT and Robotics programs tailored for different needs and durations.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeFilter === "all"
                    ? "bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-[#C1121F] hover:text-[#C1121F]"
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveFilter("free")}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === "free"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Free Courses
              </button>
              <button
                onClick={() => setActiveFilter("paid")}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === "paid"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-600 hover:text-blue-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Paid Courses
              </button>
            </div>
          </div>

          {/* Certification Notice */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">National &amp; International Certification Available</h4>
                <p className="text-amber-700 text-sm mt-1">
                  All our courses offer both national and international certification options. Prices may vary based on your choice of certification level.
                </p>
              </div>
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg">No {activeFilter === "free" ? "free" : "paid"} courses available at the moment.</p>
              </div>
            ) : (
              filteredCourses.map((course) => (
              <div 
                key={course.id}
                role="button"
                tabIndex={0}
                onClick={() => goToCourse(course)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToCourse(course);
                  }
                }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 cursor-pointer group ${
                  course.popular
                    ? 'border-[#C1121F] ring-2 ring-[#C1121F]/20 hover:-translate-y-2 hover:shadow-xl'
                    : course.isFree
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 hover:-translate-y-2 hover:shadow-xl'
                      : 'border-slate-100 hover:-translate-y-2 hover:shadow-xl hover:border-[#C1121F]/40'
                }`}
              >
                {/* Badge container */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {course.popular && (
                    <span className="bg-[#C1121F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {course.isFree && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C1121F]/10 flex items-center justify-center">
                      <span className="text-[#C1121F] font-bold">{course.id}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-4 min-h-[56px]">
                    {course.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-semibold text-slate-900">{course.hours} Hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Delivery</span>
                      <span className="font-medium text-slate-700">{course.deliveryMode}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Exam Mode</span>
                      <span className="font-medium text-slate-700">{course.examMode}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-[#C1121F]">{course.price}</span>
                      <span className="text-slate-500 text-sm block">{course.priceUnit}</span>
                    </div>
                  </div>
                </div>
                
                {/* Two Buttons */}
                <div className="px-6 pb-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/services/courses/${course.id}?enroll=1`}
                    className="flex-1 text-center py-2.5 rounded-lg bg-[#C1121F] text-white font-semibold text-sm hover:bg-[#A30F19] transition-colors duration-300"
                  >
                    Enroll Now
                  </Link>
                  <Link
                    href={`/services/courses/${course.id}`}
                    className="flex-1 text-center py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors duration-300 flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Course
                  </Link>
                </div>
              </div>
            )))
            }
          </div>

          {/* Full Table for Desktop */}
          <div className="hidden lg:block mt-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#020617] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">S.N</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Course Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Hours</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Delivery Mode</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Exam Mode</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((course, index) => (
                    <tr
                      key={course.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => goToCourse(course)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goToCourse(course);
                        }
                      }}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-[#C1121F]/5 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#C1121F]">{course.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          {course.name}
                          {course.isFree && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Free</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-slate-700">{course.hours}</td>
                      <td className="px-6 py-4 text-sm text-center text-slate-700">{course.deliveryMode}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-slate-900">{course.price} <span className="font-normal text-slate-500">{course.priceUnit}</span></td>
                      <td className="px-6 py-4 text-sm text-center text-slate-700">{course.examMode}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${course.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {course.isFree ? 'Free' : 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion Section */}
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#020617] via-slate-900 to-[#020617] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#C1121F]/15 blur-[60px] rounded-full"></div>
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="lg:max-w-3xl">
                <h2 className="text-xl md:text-2xl font-bold mb-3">Why Choose Our Programs?</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our STEM-based IoT and Robotics programs build strong technical foundations through hands-on, project-based learning. Each program features clear learning outcomes, flexible delivery modes, and industry-relevant content aligned with modern STEM education standards — creating confident, future-ready learners who can design, build, and deploy real-world solutions.
                </p>
              </div>
              
              <div className="flex flex-row gap-3 lg:flex-shrink-0">
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C1121F] text-white font-semibold text-sm rounded-lg hover:bg-[#A30F19] transition-colors whitespace-nowrap"
                >
                  Get Started
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10 whitespace-nowrap"
                >
                  All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
