'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { CourseOverview } from '@/lib/course-overview'

function pdfEmbedSrc(url: string): string {
  if (!url) return ''
  if (url.startsWith('/') || url.includes('nepatronix.org')) {
    return `${url}#toolbar=0&navpanes=0`
  }
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
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

  const stats = useMemo(
    () => [
      { label: 'Duration', value: `${course.hours}h`, icon: '⏱' },
      { label: 'Delivery', value: course.deliveryMode, icon: '📍' },
      { label: 'Exam', value: course.examMode, icon: '📝' },
      { label: 'Level', value: course.level, icon: '🎯' },
    ],
    [course]
  )

  return (
    <div className="space-y-8">
      {/* Vibrant hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#020617] via-slate-900 to-[#1a0a0d] p-8 md:p-10 text-white border border-white/10 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C1121F]/30 blur-[80px] rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {course.popular && (
              <span className="px-3 py-1 rounded-full bg-[#C1121F] text-[10px] font-bold uppercase tracking-wider">Popular</span>
            )}
            {course.isFree && (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold uppercase tracking-wider">Free</span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-wider border border-white/10">
              Full course view
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3">{course.name}</h2>
          <p className="text-slate-300 max-w-3xl text-sm md:text-base leading-relaxed">{course.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <span className="text-3xl md:text-4xl font-black text-[#ff4d5a]">{course.price}</span>
              {course.priceUnit && <span className="text-slate-400 text-sm ml-2">{course.priceUnit}</span>}
            </div>
            <button
              type="button"
              onClick={onEnroll}
              className="px-6 py-3 rounded-xl bg-[#C1121F] hover:bg-[#A30F19] font-bold text-sm shadow-lg shadow-[#C1121F]/40 transition-all hover:scale-[1.02]"
            >
              Enroll Now
            </button>
            <Link
              href={`/services/courses/view/${course.id}`}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-sm border border-white/20 transition-colors"
            >
              Open full page
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{s.icon}</span>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{s.label}</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* PDF Viewer */}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold">Course syllabus PDF</p>
            <p className="text-slate-400 text-xs">Official overview document</p>
          </div>
          {course.pdfUrl && (
            <a
              href={course.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Open in new tab
            </a>
          )}
        </div>
        {course.pdfUrl ? (
          <iframe
            src={pdfEmbedSrc(course.pdfUrl)}
            className="w-full bg-slate-100"
            style={{ height: '70vh', minHeight: 480, border: 0 }}
            title={`${course.name} syllabus`}
          />
        ) : (
          <div className="py-20 px-6 text-center bg-slate-50">
            <p className="text-slate-600 font-medium">PDF overview coming soon</p>
            <p className="text-slate-400 text-sm mt-2">Explore the full course breakdown below or contact us for the syllabus.</p>
          </div>
        )}
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#C1121F]/10 flex items-center justify-center text-[#C1121F]">✦</span>
          What you&apos;ll gain
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {course.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 hover:border-[#C1121F]/30 hover:shadow-md transition-all"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#C1121F] text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm font-medium text-slate-700 leading-snug">{h}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic curriculum modules */}
      <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Course curriculum</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {course.modules.map((mod, i) => (
            <button
              key={mod.title}
              type="button"
              onClick={() => setActiveModule(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeModule === i
                  ? 'bg-[#C1121F] text-white shadow-lg shadow-[#C1121F]/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#C1121F]/40'
              }`}
            >
              {mod.title}
            </button>
          ))}
        </div>
        {course.modules[activeModule] && (
          <div
            className={`rounded-2xl bg-gradient-to-br ${course.modules[activeModule].accent} p-[1px] shadow-lg transition-opacity duration-300`}
          >
            <div className="rounded-2xl bg-white/95 backdrop-blur p-6 md:p-8">
              <h4 className="text-lg font-bold text-slate-900 mb-4">{course.modules[activeModule].title}</h4>
              <ul className="space-y-3">
                {course.modules[activeModule].topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-3 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#C1121F] shrink-0" />
                    <span className="font-medium">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
