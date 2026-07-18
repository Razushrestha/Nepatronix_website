'use client'

import { useEffect, useState, type SVGProps } from 'react'
import Link from 'next/link'
import type { CourseOverview } from '@/lib/course-overview'

function pdfEmbedSrc(url: string): string {
  if (!url) return ''
  if (url.startsWith('/') || url.includes('nepatronix.org')) {
    return `${url}#toolbar=0&navpanes=0`
  }
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
}

/* ── Professional line icons (Heroicons-style) ───────────────────── */
type IconProps = SVGProps<SVGSVGElement>
const baseIcon = (props: IconProps) => ({
  fill: 'none' as const,
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})
const ClockIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
const DeliveryIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg>
)
const ExamIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 13l2 2 4-4" /></svg>
)
const LevelIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M5 20V10M12 20V4M19 20v-7" /></svg>
)
const AwardIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" /></svg>
)
const GlobeIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9S14.5 18.5 12 21C9.5 18.5 8.2 15.2 8.2 12S9.5 5.5 12 3z" /></svg>
)
const CheckCircleIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>
)
const DocumentIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M14 3v4a1 1 0 001 1h4" /><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" /><path d="M9 13h6M9 17h6" /></svg>
)
const DownloadIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M12 3v12M8 11l4 4 4-4" /><path d="M5 21h14" /></svg>
)
const ArrowRightIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
const BookIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z" /><path d="M18 3v18" /></svg>
)
const SparkIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></svg>
)
const LayersIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
)
const SupportIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" /></svg>
)
const UsersIcon = (p: IconProps) => (
  <svg {...baseIcon(p)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-4-5.6" /></svg>
)

/* ── Full-width page hero (matches other site heroes) ────────────── */
export function CourseHero({
  course,
  onEnroll,
}: {
  course: CourseOverview
  onEnroll: () => void
}) {
  const chips = [
    { icon: ClockIcon, text: `${course.hours} hours` },
    { icon: DeliveryIcon, text: course.deliveryMode },
    { icon: ExamIcon, text: `${course.examMode} assessment` },
    { icon: LayersIcon, text: `${course.modules.length} modules` },
  ]

  return (
    <section className="relative bg-[#020617] pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#C1121F]/15 blur-[110px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(white 0.6px, transparent 0.6px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
        <Link href="/services/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {course.popular && (
            <span className="px-3 py-1 rounded-full bg-[#C1121F] text-[10px] font-bold uppercase tracking-wider">Popular</span>
          )}
          {course.isFree && (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold uppercase tracking-wider">Free</span>
          )}
          <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-wider border border-white/15">
            {course.level}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 max-w-4xl">{course.name}</h1>
        <p className="text-slate-300 max-w-3xl text-sm md:text-base leading-relaxed">{course.description}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {chips.map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs font-medium text-slate-200">
              <chip.icon className="w-4 h-4 text-[#ff7a85]" />
              {chip.text}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div>
            <span className="text-3xl md:text-4xl font-black text-[#ff4d5a]">{course.price}</span>
            {course.priceUnit && <span className="text-slate-400 text-sm ml-2">{course.priceUnit}</span>}
          </div>
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] font-bold text-sm shadow-lg shadow-[#C1121F]/40 transition-all hover:scale-[1.02]"
          >
            Enroll Now
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          {course.pdfUrl && (
            <a
              href={course.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-sm border border-white/20 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              Download syllabus
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default function CourseDetailExplorer({
  course,
  onEnroll,
}: {
  course: CourseOverview
  onEnroll: () => void
}) {
  const [activeModule, setActiveModule] = useState(0)

  useEffect(() => {
    setActiveModule(0)
  }, [course.id])

  const facts = [
    { icon: ClockIcon, label: 'Duration', value: `${course.hours} hours` },
    { icon: DeliveryIcon, label: 'Delivery mode', value: course.deliveryMode },
    { icon: ExamIcon, label: 'Assessment', value: course.examMode },
    { icon: LevelIcon, label: 'Level', value: course.level },
    { icon: AwardIcon, label: 'Certification', value: 'National & International' },
    { icon: GlobeIcon, label: 'Language', value: 'English / Nepali' },
  ]

  const includes = [
    { icon: DocumentIcon, text: 'Official syllabus & course materials' },
    { icon: LayersIcon, text: 'Hands-on labs and real-world projects' },
    { icon: AwardIcon, text: 'Certificate of completion' },
    { icon: UsersIcon, text: 'Mentorship from expert instructors' },
    { icon: SupportIcon, text: 'Post-course guidance & support' },
  ]

  const totalTopics = course.modules.reduce((n, m) => n + m.topics.length, 0)

  return (
    <div className="space-y-10">
      {/* ── KEY FACTS GRID ───────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#C1121F]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{f.label}</p>
            <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">{f.value}</p>
          </div>
        ))}
      </section>

      {/* ── MAIN + SIDEBAR ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <section>
            <SectionHeading icon={BookIcon} title="Course overview" />
            <p className="text-slate-600 leading-relaxed">{course.description}</p>
            <p className="text-slate-600 leading-relaxed mt-4">
              This program blends structured theory with hands-on practice across{' '}
              <span className="font-semibold text-slate-800">{course.modules.length} modules</span> and{' '}
              <span className="font-semibold text-slate-800">{course.hours} hours</span> of guided learning. Delivered{' '}
              <span className="font-semibold text-slate-800">{course.deliveryMode.toLowerCase()}</span> and assessed via{' '}
              <span className="font-semibold text-slate-800">{course.examMode.toLowerCase()}</span> evaluation, learners
              graduate with a nationally and internationally recognised certificate from Nepatronix.
            </p>
          </section>

          {/* What you'll learn */}
          <section>
            <SectionHeading icon={SparkIcon} title="What you'll learn" />
            <div className="grid sm:grid-cols-2 gap-3">
              {course.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#C1121F]/30 hover:shadow-sm transition-all">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-slate-700 leading-snug">{h}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section>
            <SectionHeading
              icon={LayersIcon}
              title="Curriculum"
              hint={`${course.modules.length} modules · ${totalTopics} topics`}
            />
            <div className="rounded-3xl border border-slate-200 overflow-hidden">
              {course.modules.map((mod, i) => {
                const open = activeModule === i
                return (
                  <div key={mod.title} className="border-b border-slate-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setActiveModule(open ? -1 : i)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${open ? 'bg-[#C1121F] text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-slate-900">{mod.title}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">{mod.topics.length} topics</span>
                      </span>
                      <svg className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {open && (
                      <ul className="px-5 pb-5 pl-[4.5rem] space-y-2.5">
                        {mod.topics.map((topic) => (
                          <li key={topic} className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F] shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Syllabus PDF */}
          <section>
            <SectionHeading icon={DocumentIcon} title="Course syllabus" hint="Official overview document" />
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              {course.pdfUrl ? (
                <>
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <span className="text-sm font-semibold text-slate-700">{course.name} — Syllabus</span>
                    <a href={course.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C1121F] hover:underline">
                      <DownloadIcon className="w-4 h-4" /> Download
                    </a>
                  </div>
                  <iframe
                    src={pdfEmbedSrc(course.pdfUrl)}
                    className="w-full bg-slate-100"
                    style={{ height: '70vh', minHeight: 480, border: 0 }}
                    title={`${course.name} syllabus`}
                  />
                </>
              ) : (
                <div className="py-16 px-6 text-center">
                  <DocumentIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Syllabus document coming soon</p>
                  <p className="text-slate-400 text-sm mt-1">Contact us for the detailed course outline.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Enroll card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#C1121F]">{course.price}</span>
                {course.priceUnit && <span className="text-slate-400 text-sm mb-1">{course.priceUnit}</span>}
              </div>
              <button
                type="button"
                onClick={onEnroll}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] text-white font-bold text-sm shadow-lg shadow-[#C1121F]/30 transition-all hover:scale-[1.01]"
              >
                Enroll Now <ArrowRightIcon className="w-4 h-4" />
              </button>
              {course.pdfUrl && (
                <a
                  href={course.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" /> Download syllabus
                </a>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">This course includes</p>
                <ul className="space-y-3.5">
                  {includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center flex-shrink-0">
                        <inc.icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm text-slate-600 leading-snug pt-1">{inc.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick facts card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Course details</p>
              <dl className="space-y-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 flex items-center justify-between gap-3">
                      <dt className="text-xs text-slate-400 font-medium">{f.label}</dt>
                      <dd className="text-sm font-semibold text-slate-800 text-right">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SectionHeading({
  icon: Icon,
  title,
  hint,
}: {
  icon: (p: IconProps) => React.ReactElement
  title: string
  hint?: string
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-[#C1121F]/10 text-[#C1121F] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        {title}
      </h2>
      {hint && <span className="text-xs font-medium text-slate-400">{hint}</span>}
    </div>
  )
}
