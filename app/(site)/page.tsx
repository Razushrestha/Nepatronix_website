import Image from "next/image";
import type { Metadata } from "next";
import { features, courses, mentors, testimonials, stats } from "./data";
import Link from "next/link";
import { SectionHeading } from "./components/SectionHeading";
import { FeatureGrid } from "./components/FeatureGrid";
import SchoolCollaborations from "./components/SchoolCollaborations";
import { CourseShowcase } from "./components/CourseShowcase";
import { MentorSpotlight } from "./components/MentorSpotlight";
import { Testimonials } from "./components/Testimonials";
import { StatsBar } from "./components/StatsBar";
import { HeroSection } from "./components/HeroSection";
import { RecognitionGrid } from "./components/RecognitionGrid";
import { PartnersGrid } from "./components/PartnersGrid";

export const metadata: Metadata = {
  title: "Certified IoT, Robotics & STEM Education in Nepal",
  description: "Nepatronix is the best IoT and Robotics training institute in Nepal. Join our expert-led workshops for schools covering Arduino, PCB Design, and Electronics.",
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />

      <section className="relative -mt-10" id="outcomes">
        <div className="mx-auto max-w-6xl px-6">
          <StatsBar stats={stats} />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl space-y-12 px-6" id="about">
        <SectionHeading
          eyebrow="About Us"
          title="Our Mission & Vision"
          description="Driving innovation through education and technology."
          align="center"
        />
        <div className="mx-auto max-w-4xl text-center space-y-2">
          <p className="text-xl leading-relaxed text-[#6B7280]">
            Founded in <span className="font-semibold text-[#2563EB]">2021</span>, <span className="font-semibold text-[#020617]">NepaTronix</span> is a leading Nepal-based IoT, STEM EdTech, and software company committed to closing the gap between education and innovation.
          </p>
          <p className="text-xl leading-relaxed text-[#6B7280]">
            Built on the belief that education should inspire creativity, cultivate practical skills, and lead to meaningful invention, <span className="font-semibold text-[#020617]">NepaTronix</span> operates at the intersection of engineering, education, and social impact. Through smart technology solutions and engaging, hands-on learning programs, we empower students, teachers, and institutions to create real-world change.
          </p>
          <p className="text-xl font-bold text-[#020617] mt-2">
            NepaTronix - Excellence Through Innovation.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-[0_4px_20px_rgba(2,6,23,0.1)] transition-all hover:border-[#020617]/20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#020617]/10 px-4 py-2">
              <svg className="w-5 h-5 text-[#020617]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-widest text-[#020617]">
                Vision
              </span>
            </div>
            <p className="text-lg leading-relaxed text-slate-700">
              &ldquo;Tech-driven learning that inspires innovation at every
              level.&rdquo;
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-[0_4px_20px_rgba(193,18,31,0.15)] transition-all hover:border-[#C1121F]/20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2">
              <svg className="w-5 h-5 text-[#C1121F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
                <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-widest text-[#C1121F]">
                Mission
              </span>
            </div>
            <p className="text-lg leading-relaxed text-slate-700">
              &ldquo;To simplify and amplify IoT, STEM education through
              impactful tools, creative content, and innovating real-world
              technology.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6" id="recognition">
        <div className="text-center">
          <SectionHeading
            eyebrow="Recognition"
            title="Trusted by Leading Institutions"
            description="We are proud to be recognized and supported by prestigious organizations across Nepal and India."
            align="center"
          />
        </div>

        <RecognitionGrid />
      </section>

      <section
        className="mx-auto mt-24 max-w-6xl space-y-12 px-6"
        id="programs"
      >
        <SectionHeading
          eyebrow="Certification"
          title="Certified and Accreditation"
          description="Our STEAM with IoT and Robotic course is being accredited and certified by Kathmandu University"
          align="center"
        />

        {/* Certification Partners */}
        <div className="mt-16 flex justify-center">
          <div className="max-w-md w-full rounded-2xl border border-[#e3f2fd] bg-white p-10 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col items-center">
            <div className="mb-8 flex h-28 w-full items-center justify-center">
              <Image
                src="/recognition/KU.png"
                alt="Kathmandu University"
                width={180}
                height={180}
                className="h-auto max-h-24 w-auto max-w-full object-contain"
              />
            </div>
            <span className="mb-3 rounded-full bg-[#1e88e5]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1e88e5]">
              Academic Accreditation
            </span>
            <h3 className="mb-4 text-center text-xl font-bold text-[#020617]">
              Kathmandu University
            </h3>
            <p className="text-center text-base leading-relaxed text-[#64748b]">
              Official university certification for our comprehensive STEAM curriculum
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl space-y-12 px-6" id="mentors">
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive STEM Solutions"
          description="From education to innovation, we provide end-to-end STEM services for institutions, students, and businesses."
          align="center"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "STEM Tutor Program",
              href: "/services#stem-education",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              ),
              description:
                "Personalized STEM education with expert tutors for students at all levels",
              color: "text-blue-600",
            },
            {
              name: "STEM Lab Setup",
              href: "/services#stem-lab-setup",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <circle cx="14" cy="5" r="2" />
                  <path d="M12 14l3-3" />
                  <path d="M7 14l4-4 3 3 4-4" />
                  <path d="M12 21V11" />
                </svg>
              ),
              description:
                "Complete laboratory setup and equipment for schools and educational institutions",
              color: "text-red-600",
            },
            {
              name: "Software and APP Development",
              href: "/services#product-engineering",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="14" y1="4" x2="10" y2="20" />
                </svg>
              ),
              description:
                "Custom software solutions and mobile applications for educational and business needs",
              color: "text-emerald-600",
            },
            {
              name: "Research and Innovations",
              href: "/services#institutional-programs",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 7 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              ),
              description:
                "Cutting-edge research projects and innovative solutions for real-world challenges",
              color: "text-purple-600",
            },
          ].map((service) => (
            <Link
              href={service.href}
              key={service.name}
              className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-[#C1121F]/20"
            >
              <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${service.color}`}>
                <div className="w-10 h-10">
                  {service.icon}
                </div>
              </div>
              <h3 className="mb-4 text-center text-lg font-bold text-[#020617] group-hover:text-[#C1121F] transition-colors">
                {service.name}
              </h3>
              <p className="text-center text-sm leading-relaxed text-slate-500 font-medium">
                {service.description}
              </p>
              <div className="mt-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C1121F] flex items-center gap-2">
                  Learn More 
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl space-y-12 px-6" id="stories">
        <SectionHeading
          eyebrow="Partnership Organizations"
          title="Trusted Partners & Collaborators"
          description="Building a strong ecosystem through strategic partnerships with leading organizations across technology, education, and financial sectors."
          align="center"
        />

        <PartnersGrid />
      </section>

      <section
        className="mx-auto mt-24 max-w-6xl space-y-12 px-6"
        id="portfolio"
      >
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Websites We've Built"
          description="Explore some of the professional websites and digital solutions we've created for our clients."
          align="center"
        />

        <div className="mt-16 overflow-hidden">
          <div className="animate-marquee flex gap-6">
            {[
              {
                name: "Suryodaya Inc",
                url: "https://www.suryodayainc.com/",
              },
              {
                name: "EU Nepal Business Forum",
                url: "https://eunepalbusinessforum.eu/",
              },
              {
                name: "Campsite Nepal",
                url: "https://campsitenepal.com/",
              },
              {
                name: "Event Solutions",
                url: "https://eventsolutions.com/",
              },
              {
                name: "Karnorr",
                url: "https://karnorr.com/",
              },
              // Duplicate for seamless scroll
              {
                name: "Suryodaya Inc",
                url: "https://www.suryodayainc.com/",
              },
              {
                name: "EU Nepal Business Forum",
                url: "https://eunepalbusinessforum.eu/",
              },
              {
                name: "Campsite Nepal",
                url: "https://campsitenepal.com/",
              },
              {
                name: "Event Solutions",
                url: "https://eventsolutions.com/",
              },
              {
                name: "Karnorr",
                url: "https://karnorr.com/",
              },
            ].map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="flex w-72 flex-shrink-0 flex-col items-center rounded-xl border border-[#e3f2fd] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">🌐</div>
                <h3 className="mb-3 text-center text-lg font-semibold text-[#1f2933]">
                  {project.name}
                </h3>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#1e88e5] px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1565c0]"
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl space-y-12 px-6" id="schools">
        <SectionHeading
          eyebrow="Educational Partners"
          title="School & College Collaborations"
          description="Partnering with leading educational institutions to transform STEM education across Nepal and beyond."
          align="center"
        />

        <SchoolCollaborations />
      </section>

      <section
        className="mx-auto mt-24 mb-24 max-w-6xl space-y-12 px-6"
        id="testimonials"
      >
        <SectionHeading
          eyebrow="Client Reviews"
          title="What Our Clients Say"
          description="Real feedback from our satisfied clients and partners across various projects."
          align="center"
        />

        <div className="mt-16 overflow-hidden">
          <div className="animate-marquee flex gap-6">
            {[
              {
                name: "Rajesh Maharjan",
                role: "Principal, Kathmandu Modern School",
                rating: 5,
                review:
                  "Nepatronix transformed our school's science lab with cutting-edge STEM equipment. Students are now more engaged in practical learning than ever before.",
              },
              {
                name: "Dr. Sunita Shrestha",
                role: "Professor, Tribhuvan University",
                rating: 5,
                review:
                  "The IoT training program conducted by Nepatronix was exceptional. Their expertise in modern technology education is truly remarkable.",
              },
              {
                name: "Bikram Tamang",
                role: "IT Director, Prime College",
                rating: 5,
                review:
                  "Professional website development with excellent customer support. Nepatronix delivered exactly what we envisioned for our institution.",
              },
              {
                name: "Priya Adhikari",
                role: "Education Consultant",
                rating: 5,
                review:
                  "Their STEM tutor program has significantly improved our students' performance in science and mathematics. Highly recommended service!",
              },
              {
                name: "Amit Basnet",
                role: "Director, Rainbow Academy",
                rating: 5,
                review:
                  "Nepatronix helped us set up a complete digital classroom solution. The team is knowledgeable, responsive, and delivers quality work.",
              },
              {
                name: "Dr. Kamala Devi",
                role: "Research Head, BIT",
                rating: 5,
                review:
                  "Excellent research and innovation support. Their technical expertise helped us complete our technology project successfully and on time.",
              },
              {
                name: "Santosh Gurung",
                role: "Principal, Marvellous School",
                rating: 5,
                review:
                  "The mobile app development service exceeded our expectations. Clean interface, robust functionality. Outstanding work by the Nepatronix team!",
              },
              {
                name: "Renu Karki",
                role: "Academic Director, NCCS",
                rating: 5,
                review:
                  "Professional team with deep understanding of educational technology needs. They delivered our learning management system exactly as promised.",
              },
            ]
              .concat([
                {
                  name: "Rajesh Maharjan",
                  role: "Principal, Kathmandu Modern School",
                  rating: 5,
                  review:
                    "Nepatronix transformed our school's science lab with cutting-edge STEM equipment. Students are now more engaged in practical learning than ever before.",
                },
                {
                  name: "Dr. Sunita Shrestha",
                  role: "Professor, Tribhuvan University",
                  rating: 5,
                  review:
                    "The IoT training program conducted by Nepatronix was exceptional. Their expertise in modern technology education is truly remarkable.",
                },
                {
                  name: "Bikram Tamang",
                  role: "IT Director, Prime College",
                  rating: 5,
                  review:
                    "Professional website development with excellent customer support. Nepatronix delivered exactly what we envisioned for our institution.",
                },
                {
                  name: "Priya Adhikari",
                  role: "Education Consultant",
                  rating: 5,
                  review:
                    "Their STEM tutor program has significantly improved our students' performance in science and mathematics. Highly recommended service!",
                },
                {
                  name: "Amit Basnet",
                  role: "Director, Rainbow Academy",
                  rating: 5,
                  review:
                    "Nepatronix helped us set up a complete digital classroom solution. The team is knowledgeable, responsive, and delivers quality work.",
                },
                {
                  name: "Dr. Kamala Devi",
                  role: "Research Head, BIT",
                  rating: 5,
                  review:
                    "Excellent research and innovation support. Their technical expertise helped us complete our technology project successfully and on time.",
                },
              ])
              .map((testimonial, index) => (
                <div
                  key={`testimonial-${index}`}
                  className="w-80 flex-shrink-0 rounded-xl border border-[#e3f2fd] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex text-yellow-400">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i} className="text-lg">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-[#64748b]">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>
                  <div className="border-t border-[#e3f2fd] pt-4">
                    <p className="font-semibold text-[#1f2933]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#64748b]">{testimonial.role}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
