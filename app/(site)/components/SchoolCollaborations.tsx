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

function PartnerTile({ school }: { school: School }) {
  return (
    <div className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-3 text-center transition-colors hover:border-[#C1121F]/35">
      <div className="flex h-[52px] w-full items-center justify-center sm:h-14">
        <Image
          src={school.logo}
          alt={`${school.name} logo`}
          width={120}
          height={56}
          className="max-h-12 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:max-h-14"
          loading="lazy"
        />
      </div>
      <p className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">{school.name}</p>
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
  const embedUrl = useMemo(() => getEmbeddedYouTubeUrl(schoolVideoUrl), [])

  return (
    <section className="mt-16 rounded-3xl bg-white p-6 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C1121F] sm:text-sm">Partners</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Our school & college partners
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            We work with leading educational institutions across Nepal, driving hands-on STEM learning and innovation.
          </p>

          <ul
            className="mt-8 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4"
            aria-label="Partner schools and colleges"
          >
            {schools.map((school) => (
              <li key={school.name}>
                <PartnerTile school={school} />
              </li>
            ))}
          </ul>
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
