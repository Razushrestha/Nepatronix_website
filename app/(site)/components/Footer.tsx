import type { ReactNode } from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Footer as FooterModel, ContactPage, Course } from "@/lib/models";
import { getFooterQuickLinks } from "@/lib/site-nav";

interface FooterData {
  companyName: string;
  tagline: string;
  description: string;
  contactInfo: {
    address: string;
    postalCode: string;
    weekdayHours: string;
    weekendHours: string;
  };
  quickLinks?: {
    name: string;
    href: string;
  }[];
  expertise: {
    name: string;
    desc: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  copyrightText: string;
}

function SocialIcon({ platform }: { platform: string }) {
  const key = platform?.toLowerCase();

  if (key?.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 5 3.66 9.14 8.44 9.93v-7.03H7.9V12.1h2.4V9.83c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.19 2.13.19v2.35h-1.2c-1.18 0-1.55.73-1.55 1.48v1.75h2.64l-.42 2.87h-2.22v7.03c4.78-.79 8.44-4.93 8.44-9.93Z" />
      </svg>
    );
  }

  if (key?.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.29c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.79v5.38h-3.55V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.41-1.85 3.65 0 4.32 2.4 4.32 5.51v6.23ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm-1.78 13.02h3.55V9H3.56v11.45Z" />
      </svg>
    );
  }

  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

interface ContactData {
  contactDetails?: {
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
  socialMedia?: {
    platform: string;
    url: string;
  }[];
}

const SITE_URL = "https://nepatronix.org";

// SEO: keyword-rich description reused for visible copy and structured data.
const SEO_DESCRIPTION =
  "Nepatronix Engineering Solutions is Nepal's leading IoT, robotics, and STEM education institute based in Kupondole, Lalitpur, offering hands-on Arduino training, PCB design courses, robotics workshops, drone building, and STEM lab setup for schools across Nepal.";

const SEO_KEYWORDS = [
  "IoT training in Nepal",
  "Robotics training in Nepal",
  "STEM education Nepal",
  "Arduino training",
  "PCB design training",
  "Robotics workshops Kathmandu",
  "STEM lab setup for schools",
  "Engineering training Nepal",
  "Electronics courses Nepal",
  "Drone building workshops",
];

const DEFAULT_FOOTER: FooterData = {
  companyName: "Nepatronix",
  tagline: "Excellence Through Innovation",
  description:
    "Nepatronix Engineering Solutions is Nepal's leading IoT, robotics, and STEM education institute.",
  contactInfo: {
    address: "Kupondole, Lalitpur, Nepal",
    postalCode: "44700",
    weekdayHours: "Sun–Fri: 9:00 AM – 6:00 PM",
    weekendHours: "Sat: By appointment",
  },
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/partners" },
    { name: "Teams", href: "/teams" },
    { name: "All Services", href: "/services" },
    { name: "STEM Education", href: "/services/stem-education" },
    { name: "STEM Lab Setup", href: "/services/stem-lab-setup" },
    { name: "Government & CSR", href: "/services/institutional-programs" },
    { name: "Courses", href: "/services/courses" },
    { name: "Apply Certificate", href: "/services/apply-certificate" },
    { name: "Upcoming Sessions", href: "/services/upcoming-sessions" },
    { name: "Blog", href: "/blog" },
    { name: "Images", href: "/image" },
    { name: "Contact", href: "/contact" },
  ],
  expertise: [
    { name: "IoT Training", desc: "Hands-on Arduino and sensor workshops" },
    { name: "Robotics", desc: "School and college robotics programs" },
    { name: "STEM Labs", desc: "End-to-end lab design and setup" },
  ],
  socialLinks: [
    { platform: "Facebook", url: "https://www.facebook.com/NepaTronixx" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/nepatronix" },
  ],
  copyrightText: "Nepatronix Engineering Solutions",
};

function FooterContactCard({
  label,
  primary,
  secondary,
  href,
  icon,
}: {
  label: string;
  primary: string;
  secondary?: string;
  href?: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors hover:border-white/20 hover:bg-white/[0.06]">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C1121F]/15 text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/25">
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="block text-[13px] font-semibold leading-snug text-white transition-colors hover:text-[#C1121F] break-words"
          >
            {primary}
          </a>
        ) : (
          <p className="text-[13px] font-semibold leading-snug text-white break-words">{primary}</p>
        )}
        {secondary ? (
          <p className="mt-1 text-[11px] font-medium leading-snug text-slate-400">{secondary}</p>
        ) : null}
      </div>
    </div>
  );
}

function splitOfficeHours(weekdayHours: string, weekendHours?: string) {
  const match = weekdayHours.match(/^([^:]+):\s*(.+)$/);
  if (match) {
    return {
      primary: `${match[1].trim()}, ${match[2].trim()}`,
      secondary: weekendHours,
    };
  }
  return { primary: weekdayHours, secondary: weekendHours };
}

export async function Footer() {
  let footerDoc: FooterData | null = null;
  let contactData: ContactData | null = null;
  let courseItems: { id: number; title: string }[] = [];

  try {
    await connectToDatabase();
    const [footer, contact, courses] = await Promise.all([
      FooterModel.findOne({ key: "footer" }).lean<FooterData | null>(),
      ContactPage.findOne({ key: "contact" }).lean<ContactData | null>(),
      Course.find().sort({ order: 1, createdAt: -1 }).select("title").lean<{ title?: string }[]>(),
    ]);
    footerDoc = footer;
    contactData = contact;
    courseItems = courses
      .map((course, index) => ({
        id: index + 1,
        title: course.title?.trim() || "",
      }))
      .filter((course) => course.title);
  } catch (err) {
    console.warn("Footer: MongoDB unavailable, using defaults.", err);
  }

  const footerData = footerDoc || DEFAULT_FOOTER;
  const quickLinks = getFooterQuickLinks();
  const officeHours = splitOfficeHours(
    footerData.contactInfo?.weekdayHours || "",
    footerData.contactInfo?.weekendHours
  );

  const email = contactData?.contactDetails?.email;
  const phone = contactData?.contactDetails?.phone;
  const socialUrls = [
    ...(footerData.socialLinks?.map((s) => s.url) ?? []),
    ...(contactData?.socialMedia?.map((s) => s.url) ?? []),
  ].filter(Boolean) as string[];

  // SEO: Organization / LocalBusiness structured data so search engines can
  // surface Nepatronix's NAP (name, address, phone), email, and social
  // profiles, and trigger local-business rich results.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: footerData.companyName,
    alternateName: "NepaTronix",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-banner.png`,
    description: SEO_DESCRIPTION,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: footerData.contactInfo?.address,
      addressLocality: "Lalitpur",
      addressRegion: "Bagmati",
      addressCountry: "NP",
      postalCode: footerData.contactInfo?.postalCode,
    },
    areaServed: "Nepal",
    sameAs: socialUrls,
    knowsAbout: SEO_KEYWORDS,
  };

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden border-t border-white/5">
      {/* SEO: Organization / LocalBusiness structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[length:30px_30px]"></div>
      
      {/* Decorative Brand Blurs */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 h-128 w-128 rounded-full bg-[#C1121F]/10 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-128 w-128 rounded-full bg-blue-500/10 blur-[120px]"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="grid gap-x-12 gap-y-16 py-24 grid-cols-2 lg:grid-cols-4">
          
          {/* Company Brand */}
          <div className="col-span-2 space-y-10 lg:col-span-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {footerData.companyName}
                </h3>
                <p className="text-[10px] font-black text-[#C1121F] tracking-[0.4em] uppercase">{footerData.tagline}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-sm font-medium">
                {footerData.description}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 max-w-sm font-medium">
                Specializing in IoT, robotics, Arduino, PCB design, drone workshops, and STEM lab setup for schools across Kathmandu and Nepal.
              </p>
            </div>
            
            {/* Contact Info — single column so text never crushes in a narrow grid cell */}
            <div className="space-y-3 max-w-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Get in touch
              </p>
              <div className="flex flex-col gap-2.5">
                <FooterContactCard
                  label="Visit us"
                  primary={footerData.contactInfo?.address || ""}
                  secondary={`Postal code ${footerData.contactInfo?.postalCode || ""}`}
                  icon={
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />

                <FooterContactCard
                  label="Office hours"
                  primary={officeHours.primary}
                  secondary={officeHours.secondary}
                  icon={
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                {email ? (
                  <FooterContactCard
                    label="Email us"
                    primary={email}
                    href={`mailto:${email}`}
                    icon={
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                ) : null}

                {phone ? (
                  <FooterContactCard
                    label="Call us"
                    primary={phone}
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    icon={
                      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Quick Links
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#C1121F] transition-all shrink-0" />
                  <span className="leading-snug tracking-tight">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Courses We Offer */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Courses We Offer
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            <nav className="flex flex-col gap-3.5">
              {courseItems.length > 0 ? (
                courseItems.map((course) => (
                  <Link
                    key={course.id}
                    href={`/services/courses/view/${course.id}`}
                    className="group flex items-start gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700 group-hover:bg-[#C1121F] transition-all" />
                    <span className="leading-snug tracking-tight group-hover:text-[#C1121F] transition-colors">
                      {course.title}
                    </span>
                  </Link>
                ))
              ) : (
                footerData.expertise?.map((service, i) => (
                  <div key={i} className="group space-y-1">
                    <h5 className="text-sm font-bold text-white group-hover:text-[#C1121F] transition-colors leading-tight tracking-tight">
                      {service.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {service.desc}
                    </p>
                  </div>
                ))
              )}
            </nav>

            <Link
              href="/services/courses"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C1121F] hover:text-white transition-colors"
            >
              View all courses
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Connect & Socials */}
          <div className="col-span-2 md:col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Connect With Us
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            <div className="space-y-8">
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Follow us on social media for daily updates and student spotlights.
              </p>

              <div className="flex flex-wrap gap-4">
                {footerData.socialLinks?.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#C1121F] hover:text-white hover:border-transparent transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#C1121F] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#020617] transition-all duration-300 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email Nepatronix
                </a>
              )}

              <a
                href="/contact"
                className="block text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Or send us a message via the <span className="text-[#C1121F]">contact form</span> &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/5 py-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
               © {new Date().getFullYear()} All rights reserved by {footerData.companyName}.
            </p>
            
            <div className="flex items-center gap-4">
              {footerData.socialLinks?.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Made with</span>
               <svg className="w-3.5 h-3.5 text-[#C1121F] animate-pulse fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
               <span>in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
