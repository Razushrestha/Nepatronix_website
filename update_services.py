from pathlib import Path

content = r"""
"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { ourServices, servicesPageData } from "../data";

const ICON_MAP: Record<string, string> = {
  microscope: "🔬",
  chip: "🔧",
  lab: "🧪",
  code: "🤝",
  default: "⭐",
};

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
    if (direction === "up") return "translate-y-8 opacity-0";
    if (direction === "left") return "-translate-x-8 opacity-0";
    if (direction === "right") return "translate-x-8 opacity-0";
    return "";
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ServicesPage() {
  const [focusedService, setFocusedService] = useState<number | null>(null);
  const { header, recognizedBy, whyChooseUs, ourImpact } = servicesPageData;

  return (
    <div className="bg-white font-sans text-slate-900 selection:bg-[#C1121F] selection:text-white">
      
      {/* 1. HERO SECTION - Clean, Minimalist, Apple-style */}
      <section className="relative px-6 py-32 lg:py-40 max-w-7xl mx-auto">
        <FadeIn>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              {header.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-slate-500 mb-10 leading-snug">
               {header.subtitle}
            </h2>
            <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light max-w-3xl border-l-4 border-[#C1121F] pl-6 py-2">
              {header.description}
            </p>
          </div>
        </FadeIn>

        {/* Recognized By */}
        <div className="mt-20">
             <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Recognized By</p>
             <div className="flex flex-wrap items-center gap-8 md:gap-16 opacity-80">
                {recognizedBy.map((org, i) => (
                    <span key={i} className="text-lg md:text-xl font-bold text-slate-600 cursor-default uppercase tracking-tight">{org}</span>
                ))}
             </div>
        </div>
      </section>

      {/* 2. ECOSYSTEM BANNER */}
      <section className="bg-slate-50 border-y border-slate-100 py-24 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
                <div className="inline-block mb-6">
                    <span className="text-sm font-bold tracking-widest text-[#C1121F] uppercase">Our Service Ecosystem</span>
                </div>
                <blockquote className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight">
                   "An integrated approach that connects education, engineering, and infrastructure to create sustainable impact."
                </blockquote>
            </FadeIn>
         </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            {ourServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 100}>
                <div 
                  id={service.id}
                  className="group"
                >
                   {/* Header Row */}
                   <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-12 border-b border-slate-200 pb-12">
                       <span className="text-lg font-mono font-bold text-slate-300">0{idx + 1}</span>
                       <div className="flex-1">
                           <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">{service.title}</h3>
                           <p className="text-xl md:text-2xl font-serif italic text-slate-500">{(service as any).tagline}</p>
                       </div>
                       <div className="hidden md:block text-5xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                          {ICON_MAP[service.icon]}
                       </div>
                   </div>

                   {/* Content Grid */}
                   <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
                       {/* What It Is */}
                       <div className="md:col-span-4">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">What It Is</h4>
                           <p className="text-lg leading-relaxed text-slate-600">
                               {(service as any).overview}
                           </p>
                       </div>

                       {/* What We Deliver */}
                       <div className="md:col-span-4">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">What We Deliver</h4>
                           <ul className="space-y-4">
                               {(service as any).scopeOfServices?.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3 items-start text-slate-700">
                                     <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C1121F] flex-shrink-0"></span>
                                     <span className="text-base font-medium leading-snug">{item}</span>
                                  </li>
                               ))}
                           </ul>
                       </div>

                       {/* Why It Matters */}
                       <div className="md:col-span-4">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Why It Matters</h4>
                           <ul className="space-y-4">
                               {(service as any).impact?.map((imp: string, i: number) => (
                                   <li key={i} className="flex gap-3 items-start text-slate-700">
                                       <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                       <span className="text-base font-medium leading-snug">{imp}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>
                   </div>
                </div>
              </FadeIn>
            ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-32 px-6">
        <div className="max-w-5xl mx-auto">
            <FadeIn>
                <div className="mb-16">
                    <span className="text-[#C1121F] font-bold tracking-widest uppercase text-sm">Our Advantage</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">Why Institutions Choose Us</h2>
                </div>
                
                <div className="grid gap-8">
                     {whyChooseUs.map((reason, i) => (
                        <div key={i} className="flex gap-6 items-start border-b border-white/10 pb-8 last:border-0">
                             <span className="text-[#C1121F] text-2xl mt-1">✦</span>
                             <p className="text-xl md:text-2xl font-light text-slate-200">{reason}</p>
                        </div>
                     ))}
                </div>
            </FadeIn>
        </div>
      </section>

      {/* 5. IMPACT PHILOSOPHY */}
      <section className="py-32 px-6 bg-white text-center">
         <div className="max-w-4xl mx-auto">
            <FadeIn>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block">Our Impact Philosophy</span>
                <h3 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
                   "{ourImpact}"
                </h3>
            </FadeIn>
         </div>
      </section>

      {/* 6. PARTNER CTA */}
      <section className="pb-32 px-6 bg-white">
         <FadeIn>
             <div className="max-w-5xl mx-auto rounded-3xl bg-slate-50 border border-slate-100 p-12 md:p-20 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Partner With Us</h2>
                    <h3 className="text-xl md:text-2xl text-slate-500 font-medium mb-8">Build Future-Ready Education & Innovation Systems</h3>
                    <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
                        Whether you are a school, government body, NGO, or institution, we help you implement certified, scalable, and future-focused STEM solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact" className="inline-flex justify-center items-center px-10 py-5 rounded-full bg-[#C1121F] text-white font-bold text-lg hover:bg-red-800 transition-colors shadow-xl shadow-red-900/10">
                            Get a Proposal
                        </Link>
                        <Link href="/partners" className="inline-flex justify-center items-center px-10 py-5 rounded-full bg-white text-slate-900 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-colors">
                            Partner With Us
                        </Link>
                    </div>
                </div>
             </div>
         </FadeIn>
      </section>

    </div>
  );
}
""".strip()

Path('app/services/page.tsx').write_text(content, encoding='utf-8')
