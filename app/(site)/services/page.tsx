"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ourServices, servicesPageData } from "../data";

// --- SVG Icon Components ---
function MicroscopeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C1121F]">
      <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 1 1-2-2V6h6v8h2" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C1121F]">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C1121F]">
      <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" />
    </svg>
  );
}

function GlobalIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C1121F]">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}

const ICON_MAP: Record<string, () => ReactNode> = {
  microscope: () => <MicroscopeIcon />,
  wrench: () => <WrenchIcon />,
  lab: () => <LabIcon />,
  code: () => <GlobalIcon />,
  default: () => <MicroscopeIcon />,
};

// --- Animation Helper Component (Same as About Us) ---
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

export default function ServicesPage() {
  const [focusedService, setFocusedService] = useState<number | null>(null);

  // Destructure data for cleaner usage
  const { header, recognizedBy, whyChooseUs } = servicesPageData;

  return (
    <div className="overflow-hidden bg-white font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center lg:py-32 overflow-hidden bg-[#020617] text-white">
        {/* Background Effects */}
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#C1121F] blur-[120px] pointer-events-none opacity-20" />
        <div className="absolute top-[10%] -right-[10%] h-100 w-100 rounded-full bg-[#0A2A66] blur-[100px] pointer-events-none opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-1.5 text-sm font-medium text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C1121F]"></span>
              </span>
              Nepatronix Services
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
              {header.title}
            </h1>
            <p className="text-2xl md:text-3xl font-light text-slate-200 mb-8 max-w-3xl mx-auto">
              {header.subtitle}
            </p>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-slate-400 mb-12">
              {header.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => document.getElementById('stem-education')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-[#C1121F] px-8 py-4 text-sm md:text-base font-bold text-white shadow-lg hover:bg-[#A00F1A] hover:shadow-[#C1121F]/25 transition-all transform hover:-translate-y-0.5"
              >
                See More
              </button>
              <Link
                href="/partners"
                className="rounded-full bg-white/5 px-8 py-4 text-sm md:text-base font-bold text-white hover:bg-white/10 ring-1 ring-white/10 transition-all backdrop-blur-sm"
              >
                Partner With Us
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Recognized By Banner */}
        <div className="mt-20 pt-10 border-t border-white/10 w-full max-w-7xl mx-auto">
             <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Recognized By</p>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {recognizedBy.map((org, i) => (
                    <span key={i} className="text-lg md:text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default">{org}</span>
                ))}
             </div>
        </div>
      </section>

      {/* 2. CORE SERVICES SECTION (One Shot Look Grid) */}
      <section className="py-24 px-6 md:px-12 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto mb-20 text-center">
            <span className="text-[#C1121F] font-bold tracking-[0.2em] uppercase text-xs">Innovation Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#020617] mt-4 tracking-tight">Our Core <span className="text-[#C1121F]">Expertise</span></h2>
            <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg">Click to explore each service in detail. From STEM education to advanced R&D, we build the future of Nepal.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ourServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 100} className="h-full">
                <Link 
                  href={`/services/${service.id}`}
                  className="group relative block h-full bg-white rounded-3xl p-8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(193,18,31,0.08)] border border-slate-100 hover:border-[#C1121F]/10 transition-all duration-500"
                >
                  {/* Decorative Number */}
                  <div className="absolute top-6 right-8 text-7xl font-black text-slate-50 group-hover:text-[#C1121F]/5 transition-colors duration-500 pointer-events-none">
                    0{idx + 1}
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 w-fit">
                      {ICON_MAP[service.icon]?.() ?? ICON_MAP.default()}
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-[9px] font-bold text-[#C1121F] uppercase tracking-[0.15em] bg-[#C1121F]/5 px-3 py-1 rounded-full mb-3 inline-block">
                        {service.tagline}
                      </span>
                      <h3 className="text-xl font-bold text-[#020617] leading-tight tracking-tight group-hover:text-[#C1121F] transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="mt-auto flex items-center gap-3 text-[10px] font-black text-[#020617] uppercase tracking-[0.2em]">
                      Explore Detail
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#C1121F] group-hover:border-[#C1121F] group-hover:text-white transition-all duration-300">
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
        </div>
      </section>

      {/* 2.5 STRATEGIC PROCESS (HOW WE WORK) */}
      <section className="py-16 bg-white overflow-hidden relative border-t border-slate-100">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C1121F]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid-pattern.svg')]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <FadeIn>
              <span className="text-[#C1121F] font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Strategic Pipeline</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#020617] mt-4 tracking-tight">How We <span className="text-[#C1121F]">Work & Thrive</span></h2>
              <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                From initial consultation to long-term impact, our process is engineered for precision, transparency, and institutional excellence.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Discovery & Audit", 
                desc: "We dive deep into your requirements, infrastructure, and goals to build a scalable blueprint.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              { 
                step: "02", 
                title: "Custom R&D", 
                desc: "Our engineers design custom STEM kits and curriculum specifically aligned with your project scope.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.31a2 2 0 01-1.666 0l-.69-.31a6 6 0 00-3.86-.517l-2.388.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 00.586 3.414l1.16.232a2 2 0 001.022-.547l1.16-1.16a2 2 0 00.586-3.414l-1.16-.232a2 2 0 00-1.022.547z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11l3-3m0 0l3 3m-3-3v8" />
                  </svg>
                )
              },
              { 
                step: "03", 
                title: "Deployment", 
                desc: "Precision installation of labs and intensive hands-on training for educators and stakeholders.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              { 
                step: "04", 
                title: "Impact Analysis", 
                desc: "We continuously monitor outcomes, provide support, and scale the impact of our certifications.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="relative h-full group">
                  {/* Step Connector (Visible on LG screens) */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-12 left-[80%] w-full h-[1px] bg-gradient-to-r from-slate-200 to-transparent z-0"></div>
                  )}
                  
                  <div className="relative z-10 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-[#C1121F]/20 group-hover:shadow-[0_20px_50px_rgba(193,18,31,0.06)] transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#C1121F] mb-8 shadow-sm ring-1 ring-slate-100 group-hover:bg-[#C1121F] group-hover:text-white group-hover:ring-[#C1121F] transition-all duration-500">
                      {item.icon}
                    </div>
                    
                    <div className="absolute top-8 right-10 text-4xl font-black text-slate-100 group-hover:text-[#C1121F]/10 transition-colors pointer-events-none">
                      {item.step}
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#020617] mb-4 group-hover:text-[#C1121F] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{item.desc}</p>
                    
                    <div className="h-1 w-0 bg-[#C1121F] group-hover:w-16 transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
             <div className="mt-12 p-1 rounded-3xl bg-gradient-to-r from-transparent via-slate-200 to-transparent">
                <div className="bg-white px-8 py-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                         {[1,2,3].map(n => (
                            <div key={n} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {n === 3 ? 'RS' : 'NP'}
                            </div>
                         ))}
                      </div>
                      <p className="text-sm text-slate-600">Trusted by institutions across <strong>7 provinces</strong> of Nepal.</p>
                   </div>
                   <Link href="/contact" className="text-xs font-bold text-[#020617] uppercase tracking-[0.2em] hover:text-[#C1121F] transition-colors flex items-center gap-2">
                      Start your project now
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                   </Link>
                </div>
             </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Subtle Decorative elements */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <FadeIn direction="left">
                    <div className="max-w-lg">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/5 px-4 py-1.5 whitespace-nowrap">
                           <span className="h-1.5 w-1.5 rounded-full bg-[#C1121F] animate-pulse"></span>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C1121F]">Why Choose Us</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#020617] mb-6 leading-tight tracking-tight">
                           Innovation Driven by <br />
                           <span className="text-[#C1121F]">Impact</span>
                        </h2>
                        <p className="text-base text-slate-500 mb-8 leading-relaxed">
                            Our commitment to local innovation and global standards sets us apart in the STEM ecosystem of Nepal.
                        </p>
                        
                        <div className="space-y-4 mb-10">
                           {whyChooseUs.map((reason, i) => (
                              <div key={i} className="flex gap-4 items-start group">
                                 <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-all group-hover:bg-[#C1121F] group-hover:text-white group-hover:scale-110">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                 </div>
                                 <span className="text-sm font-semibold text-slate-700 leading-snug transition-colors group-hover:text-[#020617]">{reason}</span>
                              </div>
                           ))}
                        </div>
                        
                        <Link href="/partners" className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#C1121F] text-white rounded-full font-bold text-xs shadow-lg shadow-[#C1121F]/15 hover:bg-[#A30F19] hover:shadow-[#C1121F]/25 transition-all hover:-translate-y-0.5 active:scale-95">
                            Learn about our mission
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </FadeIn>

                <FadeIn direction="right" className="relative">
                    <div className="relative group max-w-md mx-auto lg:ml-auto">
                        {/* Decorative Frames */}
                        <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-[#C1121F]/20 rounded-tl-[2rem] pointer-events-none group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-700"></div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-slate-200 rounded-br-[2rem] pointer-events-none group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-700"></div>
                        
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100 border-[8px] border-white z-10">
                           <Image 
                              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
                              alt="STEM Innovation at Nepatronix"
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                           />
                           {/* Overlay gradient */}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/10 via-transparent to-transparent opacity-40"></div>
                           
                           {/* Floating Insight Card */}
                           <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 transform group-hover:-translate-y-1 transition-transform duration-700">
                              <p className="text-[9px] font-black text-[#C1121F] uppercase tracking-[0.3em] mb-2">Nepatronix Ecosystem</p>
                              <p className="text-base font-bold text-[#020617] leading-tight">
                                 "Bridging the gap between theory <br className="hidden md:block" /> and practical innovation."
                              </p>
                           </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-8 px-6 bg-white">
         <div className="max-w-3xl mx-auto rounded-2xl bg-[#C1121F] relative overflow-hidden text-center px-6 py-8 md:py-10 text-white shadow-lg">
            <div className="relative z-10 max-w-xl mx-auto">
                <FadeIn>
                    <h2 className="text-xl md:text-2xl font-bold mb-3">Ready to Get Started?</h2>
                    <p className="text-sm md:text-base text-red-50 mb-6 leading-relaxed opacity-90">
                        Build Future-Ready STEM Solutions With Us. Partner with us to implement certified STEM education and engineering solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="group bg-white text-[#C1121F] px-6 py-2.5 rounded-full font-bold text-sm hover:translate-y-[-1px] transition-all shadow-sm active:scale-95"
                        >
                            See More
                        </button>
                        <Link href="/partners" className="group bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/5 transition-all active:scale-95">
                            Partner With Us
                        </Link>
                    </div>
                </FadeIn>
            </div>
         </div>
      </section>

    </div>
  );
}
