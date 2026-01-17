"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Slide = {
  id: number;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const slides: Slide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
    alt: "Mentor guiding a student on a laptop",
    eyebrow: "Cohort 12 opens February 3rd",
    title: "Build job-ready skills with mentors who stay until you succeed.",
    description:
      "Adaptive learning paths, weekly mentor sessions, and career matching help you land interviews faster and with more confidence.",
    primaryCta: { label: "Start your 14-day trial", href: "/contact" },
    secondaryCta: { label: "Explore programs", href: "#programs" },
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1587613865218-8d3f0c959088?auto=format&fit=crop&w=1600&q=80",
    alt: "Product team collaborating around a table",
    eyebrow: "Teams that trust NovaLearn",
    title: "Upskill product and engineering teams with guided sprints.",
    description:
      "We combine mentor-led workshops, analytics, and impact reporting so leaders can see measurable skill adoption across the org.",
    primaryCta: { label: "Talk to partnerships", href: "/partners" },
    secondaryCta: { label: "View services", href: "/services" },
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    alt: "Learners celebrating project launch",
    eyebrow: "Portfolio power",
    title: "Ship projects that showcase your craft and strategy.",
    description:
      "Capstone studios turn ideas into shipped case studies with feedback from hiring managers and peer critique loops.",
    primaryCta: { label: "See learner stories", href: "#stories" },
    secondaryCta: { label: "Meet the mentors", href: "#mentors" },
  },
];

const AUTO_ADVANCE_MS = 8000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, []);

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  const goNext = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  const goPrev = () => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[#e3f2fd] shadow-xl">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "z-20 opacity-100" : "z-10 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={isActive}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a3d62]/80 via-[#0a3d62]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <div className="max-w-2xl space-y-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                  {slide.eyebrow}
                </span>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="text-sm text-white/80 sm:text-base">
                  {slide.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={slide.primaryCta.href}
                    className="btn-primary w-full bg-[#e63946] px-6 py-3 text-sm text-white shadow-lg shadow-[#0a3d62]/40 sm:w-auto"
                  >
                    {slide.primaryCta.label}
                  </Link>
                  {slide.secondaryCta ? (
                    <Link
                      href={slide.secondaryCta.href}
                      className="btn-secondary w-full border-white px-6 py-3 text-sm text-white sm:w-auto"
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-6 sm:p-8">
        <button
          type="button"
          onClick={goPrev}
          className="pointer-events-auto rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#0a3d62] shadow transition hover:bg-white"
          aria-label="Previous slide"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#0a3d62] shadow transition hover:bg-white"
          aria-label="Next slide"
        >
          Next
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToIndex(index)}
            className={`pointer-events-auto h-2 rounded-full transition-all ${
              index === activeIndex ? "w-10 bg-white" : "w-4 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
