"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#020617]">
      {/* Animated radar pulse rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-radar-pulse h-150 w-150 rounded-full border border-[#C1121F]/20" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-radar-pulse-delay-1 h-150 w-150 rounded-full border border-[#C1121F]/20" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-radar-pulse-delay-2 h-150 w-150 rounded-full border border-[#C1121F]/20" />
      </div>

      {/* Circuit / grid pattern overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="circuit-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#C1121F"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="2" fill="#C1121F" />
            <circle cx="60" cy="0" r="2" fill="#C1121F" />
            <circle cx="0" cy="60" r="2" fill="#C1121F" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
      </svg>

      {/* Flowing circuit lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 200 Q 400 100 800 200 T 1600 200"
          fill="none"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          className="animate-circuit"
        />
        <path
          d="M0 400 Q 300 300 600 400 T 1200 400"
          fill="none"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          className="animate-circuit"
          style={{ animationDelay: "2s" }}
        />
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C1121F" stopOpacity="0" />
            <stop offset="50%" stopColor="#C1121F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C1121F" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glowing orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C1121F]/10 blur-3xl" />


      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C1121F]/30 bg-[#C1121F]/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#e63946]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-200">
              Empowering Future Innovators
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Certified IoT, Robotics & STEM <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#C1121F] to-red-500 bg-clip-text text-transparent">
              Education in Nepal
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#94a3b8] sm:text-xl">
            From classrooms to real-world engineering — Nepatronix empowers the
            next generation of innovators.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#e63946] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition hover:bg-[#c62828] hover:shadow-xl"
            >
              <span className="text-lg">🔴</span>
              Explore Programs
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e88e5] px-8 py-4 text-sm font-semibold text-[#1e88e5] transition hover:bg-[#1e88e5] hover:text-white"
            >
              <span className="text-lg">🔵</span>
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
