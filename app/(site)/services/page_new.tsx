"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { ourServices } from "../data";

const ICON_MAP: Record<string, string> = {
  microscope: "🔬",
  chip: "⚙️",
  lab: "🧪",
  code: "💻",
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

  return (
    <div className="overflow-hidden bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center lg:py-32 overflow-hidden bg-[#020617] text-white">
        {/* Abstract Background Blobs - Simple CSS animation */}
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#C1121F] blur-[100px] pointer-events-none opacity-20" />
        <div className="absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-[#0A2A66] blur-[100px] pointer-events-none opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-6 inline-flex items-center rounded-full bg-[#C1121F]/10 px-3 py-1 text-sm font-medium text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/20">
              Nepatronix Services
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-8">
              Engineering Brilliance & <span className="text-[#C1121F]">STEM Excellence</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="mx-auto max-w-2xl text-xl leading-8 text-slate-300 mb-10">
              Certified STEM education, product engineering, and lab infrastructure for schools, institutions, and innovation partners.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-[#C1121F] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#A00F1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1121F] transition-colors"
                aria-label="Contact us to talk to an expert"
              >
                Talk to an Expert
              </Link>
              <Link
                href="/partners"
                className="rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                aria-label="View our partners"
              >
                Our Partners
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#020617] sm:text-4xl">Comprehensive Solutions</h2>
              <p className="mt-4 text-[#6B7280] text-lg">Detailed offerings tailored for growth and innovation</p>
            </div>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2">
            {ourServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 150} className="h-full">
                <div
                  onMouseEnter={() => setFocusedService(idx)}
                  onMouseLeave={() => setFocusedService(null)}
                  className={`group relative h-full flex flex-col overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border transition-all duration-300 ease-in-out
                    ${focusedService === idx 
                      ? 'border-[#C1121F]/50 shadow-[0_4px_25px_rgba(193,18,31,0.15)] -translate-y-1' 
                      : 'border-slate-100 shadow-sm hover:border-[#C1121F]/20'
                    }
                  `}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`h-16 w-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl transition-colors duration-300
                      ${focusedService === idx ? 'bg-[#C1121F] text-white' : 'bg-[#C1121F]/10 text-[#C1121F]'}
                    `}>
                      {ICON_MAP[service.icon] ?? ICON_MAP.default}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7280] mb-1">
                        {service.id.replace(/-/g, ' ')}
                      </p>
                      <h3 className="text-2xl font-bold text-[#020617] group-hover:text-[#C1121F] transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed mb-8 border-b border-slate-100 pb-8 flex-grow">
                    {service.description}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-[#020617]">Key Deliverables</h4>
                    <ul className="space-y-3">
                      {service.scopeOfServices.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <svg className={`mt-1 h-5 w-5 flex-shrink-0 ${focusedService === idx ? 'text-[#C1121F]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                     <span className={`text-sm font-semibold flex items-center gap-2 transition-colors ${focusedService === idx ? 'text-[#C1121F]' : 'text-slate-400'}`}>
                        Learn more 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                     </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA / PARTNERSHIP SECTION (Replacing CEO Message style) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn delay={200}>
            <div className="rounded-[2.5rem] bg-[#020617] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#2563EB] rounded-full blur-[120px] opacity-20"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#C1121F] rounded-full blur-[120px] opacity-20"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-white/10 px-4 py-2 w-fit mx-auto md:mx-0">
                    <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                    <span className="text-blue-100 font-medium tracking-wide text-sm">Ready to Collaborate?</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                     Partner with Nepatronix for <span className="text-[#2563EB]">Scalable Impact</span>
                  </h2>
                  
                  <p className="text-lg text-slate-300 leading-relaxed mb-8">
                     Whether you are an educational institution aiming to upgrade your STEM facilities or a company looking for specialized engineering support, our team is ready to deliver excellence.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                     <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95">
                        Start Your Project
                     </Link>
                     <Link href="/teams" className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all">
                        Meet the Experts
                     </Link>
                  </div>
                </div>
                
                {/* Stats / Visual Element */}
                <div className="w-full md:w-auto flex-shrink-0">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                         <div className="text-3xl font-bold text-white mb-1">50+</div>
                         <div className="text-xs text-slate-400 uppercase tracking-wider">Partner Schools</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                         <div className="text-3xl font-bold text-white mb-1">100%</div>
                         <div className="text-xs text-slate-400 uppercase tracking-wider">Project Success</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center col-span-2">
                         <div className="text-3xl font-bold text-[#C1121F] mb-1">24/7</div>
                         <div className="text-xs text-slate-400 uppercase tracking-wider">Support & Maintenance</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
