"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { aboutUsData } from "../data";

// --- Animation Helper Component ---
function FadeIn({ 
  children, 
  delay = 0, 
  className = "",
  direction = "up"
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100";
    if (direction === "up") return "translate-y-12 opacity-0";
    if (direction === "left") return "-translate-x-12 opacity-0";
    if (direction === "right") return "translate-x-12 opacity-0";
    return "";
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --- Vertical card visuals (solid, professional palette) ---
const VERTICAL_ACCENTS = [
  { bg: "bg-[#C1121F]", soft: "bg-[#C1121F]/10 text-[#C1121F]", bar: "bg-[#C1121F]", glow: "bg-[#C1121F]/15" },
  { bg: "bg-[#2563EB]", soft: "bg-[#2563EB]/10 text-[#2563EB]", bar: "bg-[#2563EB]", glow: "bg-[#2563EB]/15" },
  { bg: "bg-[#7C3AED]", soft: "bg-[#7C3AED]/10 text-[#7C3AED]", bar: "bg-[#7C3AED]", glow: "bg-[#7C3AED]/15" },
];

function VerticalIcon({ name }: { name?: string }) {
  const common = { className: "w-7 h-7", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (name === "education") {
    // Heroicons: academic-cap
    return (
      <svg {...common}>
        <path d="M4.26 10.147a60.44 60.44 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    );
  }
  if (name === "code") {
    // Heroicons: code-bracket
    return (
      <svg {...common}>
        <path d="M17.25 6.75L22.5 12l-5.25 5.25M6.75 17.25L1.5 12l5.25-5.25M14.25 3.75L9.75 20.25" />
      </svg>
    );
  }
  if (name === "chip") {
    // Heroicons: cpu-chip
    return (
      <svg {...common}>
        <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    );
  }
  // research (default) — Heroicons: beaker
  return (
    <svg {...common}>
      <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

export default function AboutPage() {
  const [focusedVertical, setFocusedVertical] = useState<number | null>(null);
  const messageRef = useRef<HTMLQuoteElement>(null);
  const [messageHeight, setMessageHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    const update = () => setMessageHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const canonicalUrl = "https://nepatronix.org/partners";
  const ceoSocials = Object.values(aboutUsData.ceo.socials || {}).filter(Boolean) as string[];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nepatronix.org" },
      { "@type": "ListItem", position: 2, name: "Partners", item: canonicalUrl },
    ],
  };

  const ceoPersonJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://nepatronix.org/partners#ceo",
    name: aboutUsData.ceo.name,
    jobTitle: aboutUsData.ceo.role,
    image: `https://nepatronix.org${aboutUsData.ceo.image}`,
    worksFor: { "@id": "https://nepatronix.org/#organization" },
    description: aboutUsData.ceo.message.replace(/\s+/g, " ").trim(),
    sameAs: ceoSocials,
  };

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Nepatronix",
    url: canonicalUrl,
    inLanguage: "en",
    isPartOf: { "@id": "https://nepatronix.org/#website" },
    mainEntity: { "@id": "https://nepatronix.org/#organization" },
    about: {
      "@type": "EducationalOrganization",
      "@id": "https://nepatronix.org/#organization",
      name: "Nepatronix Engineering Solutions",
      url: "https://nepatronix.org",
      description: aboutUsData.about,
      foundingDate: "2021",
      founder: { "@id": "https://nepatronix.org/partners#ceo" },
      subOrganization: (aboutUsData.verticals || []).map((v) => ({
        "@type": "Organization",
        name: v.title,
        description: v.description,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ceoPersonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }} />
      <div className="overflow-hidden bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-44 pb-20 text-center overflow-hidden bg-[#020617] text-white">
        {/* Abstract Background Blobs - Simple CSS animation */}
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#C1121F] blur-[100px] pointer-events-none opacity-20" />
        <div className="absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-[#0A2A66] blur-[100px] pointer-events-none opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-6 inline-flex items-center rounded-full bg-[#C1121F]/10 px-3 py-1 text-sm font-medium text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/20">
              Innovating from Nepal
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-8">
              Empowering the Future of <span className="text-[#C1121F]">Technology</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="mx-auto max-w-2xl text-xl leading-8 text-slate-300">
              {aboutUsData.about}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="mx-auto max-w-6xl px-6 py-12 bg-white">
        <div className="grid gap-8 md:grid-cols-2">
           {/* Mission Card */}
           <FadeIn direction="left" delay={100} className="h-full">
             <div className="h-full rounded-[2rem] bg-white p-10 shadow-sm border border-slate-100 hover:shadow-[0_4px_20px_rgba(193,18,31,0.1)] transition-all hover:border-[#C1121F]/20">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2 w-fit">
                      <svg className="w-5 h-5 text-[#C1121F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
                        <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
                      </svg>
                      <span className="text-sm font-semibold uppercase tracking-widest text-[#C1121F]">Mission</span>
                    </div>
                    <p className="text-lg leading-relaxed text-slate-600">
                      {aboutUsData.mission}
                    </p>
                  </div>
                </div>
             </div>
           </FadeIn>

           {/* Vision Card */}
           <FadeIn direction="right" delay={300} className="h-full">
             <div className="h-full rounded-[2rem] bg-[#FFFFFF] p-10 shadow-[0_4px_20px_rgba(37,99,235,0.15)] border border-[#E5E7EB] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-shadow">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-4 py-2 w-fit">
                      <svg className="w-5 h-5 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <span className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">Vision</span>
                    </div>
                    <p className="text-lg leading-relaxed text-[#1F2937]">
                      {aboutUsData.vision}
                    </p>
                  </div>
                </div>
             </div>
           </FadeIn>
        </div>
      </section>

      {/* 3. VERTICALS SECTION */}
      <section className="relative py-24 bg-[#F8FAFC] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(#020617 0.6px, transparent 0.6px)", backgroundSize: "26px 26px" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Our Ecosystem</span>
              </div>
              <h2 className="text-3xl font-bold text-[#020617] sm:text-4xl">Our Strategic Verticals</h2>
              <p className="mt-4 text-[#6B7280] text-lg">Three pillars driving our ecosystem of innovation</p>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
             {aboutUsData.verticals.map((vertical, idx) => {
               const accent = VERTICAL_ACCENTS[idx % VERTICAL_ACCENTS.length];
               const isFocused = focusedVertical === idx;
               return (
               <FadeIn key={idx} delay={idx * 150} className="h-full">
                 <div
                   onMouseEnter={() => setFocusedVertical(idx)}
                   onMouseLeave={() => setFocusedVertical(null)}
                   className={`group h-full relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 ease-out cursor-default
                     ${isFocused ? "border-transparent shadow-2xl -translate-y-2" : "border-[#E5E7EB] hover:shadow-lg"}
                   `}
                 >
                    {/* Top accent bar */}
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
                    {/* Corner glow on hover */}
                    <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300 ${accent.glow} ${isFocused ? "opacity-100" : "opacity-0"}`} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div className={`h-14 w-14 rounded-2xl ${accent.bg} text-white flex items-center justify-center shadow-md`}>
                          <VerticalIcon name={vertical.icon} />
                        </div>
                        <span className="text-4xl font-black text-slate-100 leading-none select-none">0{idx + 1}</span>
                      </div>

                      {"tagline" in vertical && vertical.tagline && (
                        <p className={`mt-6 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${accent.soft}`}>
                          {vertical.tagline}
                        </p>
                      )}
                      <h3 className="mt-3 text-xl font-bold text-[#020617] leading-snug">{vertical.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{vertical.description}</p>
                    </div>
                 </div>
               </FadeIn>
             );})}
          </div>
        </div>
      </section>


      {/* 4. CEO MESSAGE */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn delay={200}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               
               {/* Left Column: Words & Info */}
               <div className="order-2 lg:order-1 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-6">
                     <span className="h-px w-8 bg-[#2563EB]"></span>
                     <span className="text-[#2563EB] font-medium tracking-wide text-sm uppercase">About Our Leadership</span>
                  </div>
                  
                  <h2 className="text-4xl font-bold tracking-tight text-[#020617] sm:text-5xl mb-8">
                     Message from the <span className="text-[#2563EB]">CEO</span>
                  </h2>
                  
                  <blockquote ref={messageRef} className="text-xl leading-relaxed text-[#6B7280] italic font-light mb-10 border-l-4 border-[#2563EB]/30 pl-6">
                     &quot;{aboutUsData.ceo.message}&quot;
                  </blockquote>
                  
                  <div className="flex items-center gap-4 mb-2">
                     <h3 className="text-xl font-bold text-[#020617]">{aboutUsData.ceo.name}</h3>
                     <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                     <span className="text-[#2563EB] font-medium">{aboutUsData.ceo.role}</span>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
                     <p className="text-sm text-[#9CA3AF] mb-4 font-medium uppercase tracking-wider">Connect with me</p>
                     <div className="flex gap-4">
                        <a href={aboutUsData.ceo.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 transition-colors hover:bg-green-100" aria-label="WhatsApp">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                        </a>
                        <a href={aboutUsData.ceo.socials.facebook} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] transition-colors hover:bg-[#2563EB]/20" aria-label="Facebook">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href={aboutUsData.ceo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="group flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100" aria-label="LinkedIn">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                     </div>
                  </div>
               </div>

               {/* Right Column: Image (height matches the quote message on desktop) */}
               <div className="order-1 lg:order-2 flex items-center justify-center">
                   <div
                     className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] bg-[#F8FAFC]"
                     style={isDesktop && messageHeight ? { height: messageHeight } : undefined}
                   >
                      <Image 
                        src={aboutUsData.ceo.image} 
                        alt={aboutUsData.ceo.name}
                        fill
                        className="object-cover"
                      />
                   </div>
               </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* 5. WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
           <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-16 text-[#020617]">Why Choose Nepatronix?</h2>
           </FadeIn>
           
           <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 md:grid-cols-3">
              {aboutUsData.whyChooseUs.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 100}>
                   <div className="group relative pl-16">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-600/20 group-hover:scale-110 group-hover:bg-[#1E40AF] transition-all duration-300">
                         {idx + 1}
                      </div>
                      <h3 className="text-lg font-bold text-[#020617] group-hover:text-[#2563EB] transition-colors">
                         {item.title}
                      </h3>
                      <p className="mt-2 text-[#6B7280] leading-relaxed">
                         {item.description}
                      </p>
                   </div>
                </FadeIn>
              ))}
           </div>
        </div>
      </section>

      {/* Spacing for footer */}
      <div className="h-24"></div>
    </div>
    </>
  );
}
