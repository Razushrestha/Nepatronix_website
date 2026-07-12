import type { Metadata } from "next";
import { SectionHeading } from "./components/SectionHeading";
import SchoolCollaborations from "./components/SchoolCollaborations";
import { StatsBar } from "./components/StatsBar";
import { HeroSection } from "./components/HeroSection";
import { RecognitionGrid } from "./components/RecognitionGrid";
import { PartnersGrid } from "./components/PartnersGrid";
import { HomeServicesGrid } from "./components/HomeServicesGrid";
import { AccreditationCards } from "./components/AccreditationCards";
import { IncubatorsGrid } from "./components/IncubatorsGrid";
import { PortfolioMarquee } from "./components/PortfolioMarquee";
import { getHomePageContent } from "@/lib/site-content";
import {
  STEM_EDUCATION_SEO_KEYWORDS,
  mergeSeoKeywordGroups,
} from "./data/stemEducationSeoKeywords";
import { indexingRobots } from "@/lib/seo/indexingRobots";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Certified IoT, Robotics & STEM Education in Nepal",
  description: "Nepatronix is Nepal's #1 IoT and Robotics training institute. Expert-led workshops for schools covering Arduino, PCB Design, and Electronics. 25,000+ students trained.",
  keywords: mergeSeoKeywordGroups(
    [
      "IoT training Nepal",
      "Robotics institute Nepal",
      "STEM education Kathmandu",
      "Arduino workshop Nepal",
      "PCB design Nepal",
      "electronics training Nepal",
      "Nepatronix",
      "STEM lab setup Nepal",
      "robotics for schools Nepal",
    ],
    STEM_EDUCATION_SEO_KEYWORDS
  ),
  authors: [{ name: "Nepatronix Engineering Solutions", url: "https://nepatronix.org" }],
  alternates: {
    canonical: "https://nepatronix.org",
  },
  openGraph: {
    title: "Nepatronix | Certified IoT, Robotics & STEM Education in Nepal",
    description: "Nepal's #1 IoT and Robotics training institute. Arduino, PCB Design & STEM workshops for schools. 25,000+ students trained.",
    url: "https://nepatronix.org",
    type: "website",
    images: [{ url: "https://nepatronix.org/og-banner.png", width: 1200, height: 630, alt: "Nepatronix – IoT, Robotics & STEM Education in Nepal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepatronix | IoT, Robotics & STEM Education in Nepal",
    description: "Nepal's #1 IoT and Robotics training institute. 25,000+ students trained across 50+ schools.",
    images: ["https://nepatronix.org/og-banner.png"],
  },
  robots: indexingRobots,
};

export default async function Home() {
  const homeContent = await getHomePageContent();
  const { settings } = homeContent;
  const clientReviews = homeContent.testimonials;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nepatronix.org" }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does Nepatronix specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nepatronix specializes in STEM education, IoT and robotics training, engineering workshops, and lab setup solutions for schools and institutions."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Nepatronix located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nepatronix is based in Kathmandu, Nepal and serves students, teachers, schools, and partner institutions."
        }
      },
      {
        "@type": "Question",
        "name": "How can I enroll in courses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can explore available programs under the courses section and complete registration through the enrollment or application flow on the website."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <div className="relative overflow-hidden">
      <HeroSection slide={homeContent.hero} />

      <section className="relative -mt-10" id="outcomes">
        <div className="mx-auto max-w-6xl px-6">
          <StatsBar stats={homeContent.stats} />
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-12 px-6" id="about">
        <SectionHeading
          eyebrow={settings.about.eyebrow}
          title={settings.about.title}
          description={settings.about.description}
          align="center"
        />
        <div className="mx-auto max-w-4xl text-center space-y-2">
          <p className="text-xl leading-relaxed text-[#6B7280]">
            {settings.about.paragraph1}
          </p>
          <p className="text-xl leading-relaxed text-[#6B7280]">
            {settings.about.paragraph2}
          </p>
          <p className="text-xl font-bold text-[#020617] mt-2">
            {settings.about.tagline}
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
              &ldquo;{settings.about.vision}&rdquo;
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
              &ldquo;{settings.about.mission}&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-6" id="recognition">
        <div className="text-center">
          <SectionHeading
            eyebrow={settings.recognition.eyebrow}
            title={settings.recognition.title}
            description={settings.recognition.description}
            align="center"
          />
        </div>

        <RecognitionGrid items={homeContent.recognitions} />
      </section>

      <section
        className="mx-auto mt-8 max-w-6xl space-y-12 px-6"
        id="programs"
      >
        <SectionHeading
          eyebrow={settings.certification.eyebrow}
          title={settings.certification.title}
          description={settings.certification.description}
          align="center"
        />

        <AccreditationCards items={homeContent.accreditations} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-6" id="incubated-by">
        <div className="text-center">
          <SectionHeading
            eyebrow={settings.incubation.eyebrow}
            title={settings.incubation.title}
            description={settings.incubation.description}
            align="center"
          />
        </div>

        <IncubatorsGrid items={homeContent.incubators} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-12 px-6" id="mentors">
        <SectionHeading
          eyebrow={settings.services.eyebrow}
          title={settings.services.title}
          description={settings.services.description}
          align="center"
        />

        <HomeServicesGrid services={homeContent.services} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-12 px-6" id="stories">
        <SectionHeading
          eyebrow={settings.partners.eyebrow}
          title={settings.partners.title}
          description={settings.partners.description}
          align="center"
        />

        <PartnersGrid partners={homeContent.partners} />
      </section>

      <section
        className="mx-auto mt-8 max-w-6xl space-y-12 px-6"
        id="portfolio"
      >
        <SectionHeading
          eyebrow={settings.portfolio.eyebrow}
          title={settings.portfolio.title}
          description={settings.portfolio.description}
          align="center"
        />

        <PortfolioMarquee items={homeContent.portfolio} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl space-y-12 px-6" id="schools">
        <SectionHeading
          eyebrow={settings.schools.eyebrow}
          title={settings.schools.title}
          description={settings.schools.description}
          align="center"
        />

        <SchoolCollaborations schools={homeContent.schools} />
      </section>

      <section
        className="mx-auto mt-8 mb-24 max-w-6xl space-y-12 px-6"
        id="testimonials"
      >
        <SectionHeading
          eyebrow={settings.testimonials.eyebrow}
          title={settings.testimonials.title}
          description={settings.testimonials.description}
          align="center"
        />

        <div className="mt-16 overflow-hidden">
          <div className="animate-marquee flex gap-6">
            {clientReviews
              .concat(clientReviews)
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
    </>
  );
}
