'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'

interface School {
  name: string
  logo: string
}

const schools: School[] = [
  { name: 'BIT', logo: '/school_College/BIT-removebg-preview.png' },
  { name: 'Bramarupa', logo: '/school_College/bramarupa-removebg-preview.png' },
  { name: 'Candid Career', logo: '/school_College/candidcareer-removebg-preview.png' },
  { name: 'Himchuli', logo: '/school_College/himchuli-removebg-preview.png' },
  { name: 'Marvellous', logo: '/school_College/marvellous-removebg-preview.png' },
  { name: 'Mrigashira', logo: '/school_College/mrigashira-removebg-preview.png' },
  { name: 'National Infotech', logo: '/school_College/nationalinfotech-removebg-preview.png' },
  { name: 'NCCS', logo: '/school_College/nccs-removebg-preview.png' },
  { name: 'Prime College', logo: '/school_College/primecollege-removebg-preview.png' },
  { name: 'Rainbow', logo: '/school_College/rainbow-removebg-preview.png' },
  { name: 'Siddhartha Vidyapeeth', logo: '/school_College/siddhartha_vidyapeeth-removebg-preview.png' },
  { name: 'Texas College', logo: '/school_College/texas_college.png' },
]

const schoolVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

const schoolTestimonial = {
  quote:
    'Nepatronix helped our students build confidence in robotics and IoT. Their school workshops are well-tailored to our syllabus, and our learners are now more motivated than ever.',
  attribution: 'Principal, Kathmandu Modern School',
}

function getEmbeddedYouTubeUrl(url: string): string {
  if (!url) return ''

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]+)/)

  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&showinfo=0&autoplay=0&modestbranding=1`
  }

  return url
}

function MarqueeRow({
  items,
  direction,
  durationSec,
}: {
  items: School[]
  direction: 'forward' | 'reverse'
  durationSec: number
}) {
  const doubled = [...items, ...items]
  const animationClass = direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'

  return (
    <div className="relative py-1">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div className="overflow-hidden">
        <div
          className={`flex w-max items-center gap-6 sm:gap-10 motion-reduce:animate-none ${animationClass}`}
          style={{ animationDuration: `${durationSec}s` }}
        >
          {doubled.map((school, index) => (
            <div
              key={`${school.name}-${index}`}
              className="flex h-[72px] w-[140px] shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50/80 px-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors duration-200 hover:border-[#C1121F]/35 hover:bg-white"
            >
              <Image
                src={school.logo}
                alt=""
                width={112}
                height={48}
                className="h-10 w-auto max-w-[120px] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PartnerTile({ school }: { school: School }) {
  return (
    <div className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 text-center transition-all duration-200 hover:border-[#C1121F]/40 hover:bg-white hover:shadow-md">
      <div className="flex h-14 w-full items-center justify-center">
        <Image
          src={school.logo}
          alt={`${school.name} logo`}
          width={96}
          height={48}
          className="max-h-11 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <p className="line-clamp-2 min-h-8 text-[11px] font-medium leading-snug text-slate-600 sm:text-xs">
        {school.name}
      </p>
    </div>
  )
}

function YouTubePlayer({ url }: { url: string }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="overflow-hidden rounded-[32px] bg-black shadow-2xl">
      <div className="relative aspect-video bg-slate-900">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 animate-pulse text-white/40" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title="School partner testimonial video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default function SchoolCollaborations() {
  const [isExpanded, setIsExpanded] = useState(false)
  const embedUrl = useMemo(() => getEmbeddedYouTubeUrl(schoolVideoUrl), [])

  const { rowA, rowB } = useMemo(() => {
    const half = Math.ceil(schools.length / 2)
    return {
      rowA: schools.slice(0, half),
      rowB: schools.slice(half),
    }
  }, [])

  return (
    <section className="mt-16 rounded-3xl border border-slate-200/60 bg-gradient-to-b from-slate-50 to-slate-100/80 p-6 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
        {/* Partners — single surface */}
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C1121F] sm:text-sm">Partners</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Our school & college partners
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            We work with leading educational institutions across Nepal, driving hands-on STEM learning and innovation.
          </p>

          <div className="mt-8 space-y-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Scrolling showcase</p>
            <MarqueeRow items={rowA} direction="forward" durationSec={32} />
            <MarqueeRow items={rowB} direction="reverse" durationSec={38} />
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Full directory</p>
                <p className="mt-1 text-sm text-slate-600">Every institution we collaborate with</p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#C1121F]/30 hover:bg-white md:hidden"
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Hide grid' : 'Show all logos'}
              </button>
            </div>

            <div
              className={`mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${
                isExpanded ? 'grid' : 'hidden'
              } md:mt-6 md:grid md:grid-cols-4`}
            >
              {schools.map((school) => (
                <PartnerTile key={school.name} school={school} />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C1121F] sm:text-sm">
              What our schools say
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Hear from our education partners
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Watch a short story from one of our partner schools and learn how Nepatronix brings STEM to life inside
              classrooms.
            </p>
          </div>

          {embedUrl ? (
            <YouTubePlayer url={embedUrl} />
          ) : (
            <div className="overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl">
              <div className="relative flex aspect-video items-center justify-center">
                <p className="text-sm text-white">Video URL not available</p>
              </div>
            </div>
          )}

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#C1121F]/25 hover:shadow-md sm:p-8">
            <blockquote className="text-base font-medium italic leading-relaxed text-slate-700 sm:text-lg">
              &ldquo;{schoolTestimonial.quote}&rdquo;
            </blockquote>
            <p className="mt-5 text-sm font-semibold text-slate-900">&ndash; {schoolTestimonial.attribution}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
