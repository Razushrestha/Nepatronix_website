"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ourServices, servicesPageData } from "../data";

const ICON_MAP: Record<string, string> = {
  microscope: "🔬",
  chip: "🔧",
  lab: "🧪",
  code: "🤝",
  default: "⭐",
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
        <div className="absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-[#0A2A66] blur-[100px] pointer-events-none opacity-30" />
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
              <Link
                href="/contact"
                className="rounded-full bg-[#C1121F] px-8 py-4 text-sm md:text-base font-bold text-white shadow-lg hover:bg-[#A00F1A] hover:shadow-[#C1121F]/25 transition-all transform hover:-translate-y-0.5"
              >
                Get a Quote
              </Link>
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

      {/* 2. CORE SERVICES SECTION */}
      <section className="py-24 px-6 md:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto mb-20 text-center">
            <span className="text-[#C1121F] font-bold tracking-wider uppercase text-sm">Our Core Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#020617] mt-3">Excellence in Every Solution</h2>
        </div>

        <div className="flex flex-col">
            {ourServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 150}>
                <div 
                  id={service.id}
                  onMouseEnter={() => setFocusedService(idx)}
                  onMouseLeave={() => setFocusedService(null)}
                  className="group relative py-20 lg:py-28 border-b border-slate-200 last:border-0 scroll-mt-24"
                >
                   {/* Background Number */}
                   <div className="hidden lg:block absolute top-12 right-0 text-[10rem] xl:text-[14rem] font-bold text-slate-50 opacity-60 select-none -z-10 leading-none font-mono tracking-tighter">
                      {String(idx + 1).padStart(2, '0')}
                   </div>
                   
                   <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                      {/* Left Sticky Column */}
                      <div className="lg:col-span-4 lg:sticky lg:top-32">
                         <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-bold text-[#C1121F]">0{idx + 1}</span>
                            <div className="h-0.5 w-16 bg-[#C1121F]"></div>
                         </div>
                         
                         <h3 className="text-4xl lg:text-5xl font-extrabold mb-10 leading-tight text-[#C1121F]">
                            {service.title.split(' ').slice(0, 2).join(' ')} <br />
                            <span className="text-[#C1121F]">{service.title.split(' ').slice(2).join(' ')}</span>
                         </h3>

                         <div className="text-6xl mb-12 transform scale-100 transition-transform origin-left hover:scale-110">
                            {ICON_MAP[service.icon] ?? ICON_MAP.default}
                         </div>

                         <div className="hidden lg:block">
                            <Link href="/contact" className="group/link inline-flex items-center gap-3 text-sm font-bold text-[#020617] uppercase tracking-widest hover:text-[#C1121F] transition-colors">
                               Get Started
                               <span className="text-xl leading-none transform group-hover/link:translate-x-1 transition-transform">→</span>
                            </Link>
                         </div>
                      </div>

                      {/* Right Content Column */}
                      <div className="lg:col-span-8 flex flex-col gap-14">
                         {/* Overview */}
                         <div className="prose prose-lg max-w-none">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-slate-300"></span>
                                Overview
                             </h4>
                             <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
                                {(service as any).overview}
                             </p>
                         </div>

                         <div className="grid md:grid-cols-2 gap-8">
                             {/* Deliverables Card */}
                             <div className="h-full bg-slate-50/50 rounded-[2rem] p-10 border border-slate-100/80 hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                                <h4 className="text-xs font-bold text-[#020617] uppercase tracking-widest mb-8 flex items-center gap-4">
                                   <div className="p-2 rounded-lg bg-[#020617] text-white shadow-lg shadow-black/10">
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                   </div>
                                   What We Deliver
                                </h4>
                                <ul className="space-y-5">
                                   {(service as any).scopeOfServices?.map((item: string, i: number) => (
                                      <li key={i} className="flex gap-4 items-start text-slate-600 group/list">
                                         <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-400 group-hover/list:bg-[#C1121F] transition-colors flex-shrink-0"></span>
                                         <span className="text-lg leading-snug font-medium">{item}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>

                             {/* Impact Card */}
                             {(service as any).impact && (
                                 <div className="h-full bg-[#f0fdf4] rounded-[2rem] p-10 border border-emerald-100/50 hover:border-emerald-200 hover:shadow-sm transition-all duration-300">
                                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-8 flex items-center gap-4">
                                       <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                       </div>
                                       Key Impact
                                    </h4>
                                    <ul className="space-y-5">
                                        {(service as any).impact.map((imp: string, i: number) => (
                                            <li key={i} className="flex gap-4 items-start text-emerald-900/90 group/list">
                                                <div className="mt-1 relative flex items-center justify-center">
                                                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500/30 group-hover/list:border-emerald-500 transition-colors"></div>
                                                    <svg className="absolute w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                                <span className="text-lg leading-snug font-medium">{imp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                 </div>
                             )}
                         </div>
                         
                         {/* Mobile CTA */}
                         <div className="lg:hidden mt-2">
                             <Link href="/contact" className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-[#020617] text-white py-4 font-bold active:scale-95 transition-transform">
                                Get a Quote
                             </Link>
                         </div>
                      </div>
                   </div>
                </div>
              </FadeIn>
            ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <FadeIn direction="left">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2">
                           <span className="h-2 w-2 rounded-full bg-[#C1121F]"></span>
                           <span className="text-xs font-bold uppercase tracking-widest text-[#C1121F]">Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#020617] mb-6 leading-tight">
                           Innovation Driven by <span className="text-[#C1121F]">Impact</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Our commitment to local innovation and global standards sets us apart in the STEM ecosystem of Nepal.
                        </p>
                        
                        <div className="space-y-6 mb-10">
                           {whyChooseUs.map((reason, i) => (
                              <div key={i} className="flex gap-4 items-start group">
                                 <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-[#C1121F] group-hover:text-white">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                 </div>
                                 <span className="text-base font-medium text-slate-700 leading-snug transition-colors group-hover:text-[#020617]">{reason}</span>
                              </div>
                           ))}
                        </div>
                        
                        <Link href="/partners" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C1121F] text-white rounded-full font-bold text-sm shadow-lg shadow-red-910/20 hover:bg-[#A30F19] transition-all hover:-translate-y-1">
                            Learn about our mission
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </FadeIn>

                <FadeIn direction="right">
                    <div className="relative group">
                        {/* Decorative background blobs */}
                        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-[#C1121F]/5 blur-3xl group-hover:bg-[#C1121F]/10 transition-colors"></div>
                        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
                        
                        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
                           <Image 
                              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
                              alt="STEM Innovation at Nepatronix"
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-110"
                           />
                           {/* Overlay gradient */}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 via-transparent to-transparent"></div>
                           
                           {/* Floating Stats or Element */}
                           <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                              <p className="text-xs font-bold text-[#C1121F] uppercase tracking-widest mb-1">Nepatronix Ecosystem</p>
                              <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
                                 "Bridging the gap between theory and practical innovation."
                              </p>
                           </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-10 px-6 bg-white">
         <div className="max-w-3xl mx-auto rounded-2xl bg-[#C1121F] relative overflow-hidden text-center px-6 py-10 md:py-12 text-white shadow-lg">
            <div className="relative z-10 max-w-xl mx-auto">
                <FadeIn>
                    <h2 className="text-xl md:text-2xl font-bold mb-3">Ready to Get Started?</h2>
                    <p className="text-sm md:text-base text-red-50 mb-6 leading-relaxed opacity-90">
                        Build Future-Ready STEM Solutions With Us. Partner with us to implement certified STEM education and engineering solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Link href="/contact" className="group bg-white text-[#C1121F] px-6 py-2.5 rounded-full font-bold text-sm hover:translate-y-[-1px] transition-all shadow-sm active:scale-95">
                            Get a Quote
                        </Link>
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
