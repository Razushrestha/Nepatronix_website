import Image from "next/image";
import type { Metadata } from "next";
import { features, courses, mentors, testimonials, stats } from "./data";
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
  title: "IoT, Robotics & STEM Education in Nepal",
  description:
    "Nepatronix is the best IoT and Robotics training institute in Nepal. Nepatronix offers expert-led workshops for schools covering Arduino, PCB Design, and Electronics.",
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
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xl leading-relaxed text-[#6B7280]">
            <span className="font-semibold text-[#020617]">NepaTronix</span> is a
            leading Nepal-based IOT, STEM EdTech and software company dedicated
            to bridging the persistent gap between theoretical knowledge and
            real-world innovation. Founded in{" "}
            <span className="font-semibold text-[#2563EB]">2021</span>, the
            company is driven by the core belief that education should inspire
            creativity, cultivate practical skills, and lead to meaningful
            invention. As a multidisciplinary technology enterprise, NepaTronix
            operates across the intersections of{" "}
            <span className="text-[#020617]">engineering</span>,{" "}
            <span className="text-[#020617]">education</span>, and{" "}
            <span className="text-[#020617]">social impact</span>—delivering
            smart technology solutions and engaging educational programs that
            empower learners of all backgrounds.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-[0_4px_20px_rgba(2,6,23,0.1)] transition-all hover:border-[#020617]/20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#020617]/10 px-4 py-2">
              <span className="text-2xl">🎯</span>
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
              <span className="text-2xl">🚀</span>
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
          description="Our STEAM with IoT and Robotic course is being accredited and certified by Kathmandu University, IIT Madras and IITM Pravartak"
          align="center"
        />

        {/* Certification Partners */}
        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Kathmandu University",
                logo: "/recognition/KU.png",
                role: "Academic Accreditation",
                description:
                  "Official university certification for our comprehensive STEAM curriculum",
              },
              {
                name: "IIT Madras",
                logo: "/recognition/iit_madras-removebg-preview.png",
                role: "Technical Validation",
                description:
                  "Industry-standard validation of our IoT and robotics modules",
              },
              {
                name: "IITM Pravartak",
                logo: "/recognition/IITM_pravatak-removebg-preview.png",
                role: "Innovation Certification",
                description:
                  "Startup ecosystem certification for practical project implementation",
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center rounded-2xl border border-[#e3f2fd] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-6 flex h-24 w-full items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={150}
                    height={150}
                    className="h-auto max-h-20 w-auto max-w-full object-contain"
                  />
                </div>
                <span className="mb-2 rounded-full bg-[#1e88e5]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1e88e5]">
                  {partner.role}
                </span>
                <h3 className="mb-3 text-center text-lg font-semibold text-[#1f2933]">
                  {partner.name}
                </h3>
                <p className="text-center text-sm leading-relaxed text-[#64748b]">
                  {partner.description}
                </p>
              </div>
            ))}
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
              icon: "🎓",
              description:
                "Personalized STEM education with expert tutors for students at all levels",
              color: "bg-[#1e88e5]/10",
            },
            {
              name: "STEM Lab Setup",
              icon: "🔬",
              description:
                "Complete laboratory setup and equipment for schools and educational institutions",
              color: "bg-[#e63946]/10",
            },
            {
              name: "Software and APP Development",
              icon: "💻",
              description:
                "Custom software solutions and mobile applications for educational and business needs",
              color: "bg-[#00b894]/10",
            },
            {
              name: "Research and Innovations",
              icon: "🚀",
              description:
                "Cutting-edge research projects and innovative solutions for real-world challenges",
              color: "bg-[#6c5ce7]/10",
            },
          ].map((service) => (
            <div
              key={service.name}
              className="flex flex-col items-center rounded-2xl border border-[#e3f2fd] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${service.color}`}
              >
                <span className="text-4xl">{service.icon}</span>
              </div>
              <h3 className="mb-4 text-center text-lg font-semibold text-[#1f2933]">
                {service.name}
              </h3>
              <p className="text-center text-sm leading-relaxed text-[#64748b]">
                {service.description}
              </p>
            </div>
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
