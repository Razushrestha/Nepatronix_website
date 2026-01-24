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

export default function AboutPage() {
  const [focusedVertical, setFocusedVertical] = useState<number | null>(null);

  return (
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
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#020617] sm:text-4xl">Our Strategic Verticals</h2>
              <p className="mt-4 text-[#6B7280] text-lg">Four pillars driving our ecosystem of innovation</p>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {aboutUsData.verticals.map((vertical, idx) => (
               <FadeIn key={idx} delay={idx * 150} className="h-full">
                 <div 
                   onMouseEnter={() => setFocusedVertical(idx)}
                   onMouseLeave={() => setFocusedVertical(null)}
                   className={`h-full relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ease-in-out cursor-default
                     ${focusedVertical === idx 
                        ? 'border-[#2563EB] shadow-xl scale-105 z-10' 
                        : 'border-[#E5E7EB] hover:border-[#2563EB]/50 hover:shadow-md'
                     }
                   `}
                 >
                    <div className="mb-4 h-12 w-12 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-xl">
                       0{idx + 1}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-[#020617]">{vertical.title}</h3>
                    <p className="text-sm leading-relaxed text-[#6B7280]">{vertical.description}</p>
                 </div>
               </FadeIn>
             ))}
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
                  
                  <blockquote className="text-xl leading-relaxed text-[#6B7280] italic font-light mb-10 border-l-4 border-[#2563EB]/30 pl-6">
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

               {/* Right Column: Image */}
               <div className="order-1 lg:order-2 lg:h-[600px] flex items-center justify-center relative">
                   <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB]">
                      <div className="absolute inset-0 bg-[#F8FAFC] flex items-center justify-center text-[#9CA3AF] font-medium text-lg">
                         <Image 
                           src={aboutUsData.ceo.image} 
                           alt={aboutUsData.ceo.name}
                           fill
                           className="object-cover"
                         />
                      </div>
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
  );
}
