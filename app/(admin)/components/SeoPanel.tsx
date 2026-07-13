'use client'
import { useState } from 'react'
import { adminInput } from './ui'

type AnyObj = Record<string, unknown>

const SITE = process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function Meter({ value, min, max, label }: { value: number; min: number; max: number; label: string }) {
  const ok = value >= min && value <= max
  const near = value > 0 && !ok
  const color = ok ? 'text-green-600' : near ? 'text-amber-600' : 'text-slate-400'
  const bar = ok ? 'bg-green-500' : near ? 'bg-amber-500' : 'bg-slate-300'
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="mt-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className={color}>{value} / {min}–{max}</span>
      </div>
      <div className="h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-flex w-4 h-4 rounded-full items-center justify-center text-[10px] ${ok ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-400'}`}>
        {ok ? '✓' : '·'}
      </span>
      <span className={ok ? 'text-slate-700' : 'text-slate-500'}>{children}</span>
    </div>
  )
}

export default function SeoPanel({
  data,
  onChange,
}: {
  data: AnyObj
  onChange: (name: string, value: unknown) => void
}) {
  const [kwInput, setKwInput] = useState('')

  const title = str(data.title)
  const seoTitle = str(data.seoTitle)
  const seoDescription = str(data.seoDescription)
  const excerpt = str(data.excerpt)
  const slug = str(data.slug)
  const focus = str(data.focusKeyword).toLowerCase().trim()
  const keywords = Array.isArray(data.keywords) ? (data.keywords as string[]) : []

  const effTitle = seoTitle || title
  const effDesc = seoDescription || excerpt
  const previewUrl = `${SITE}/blog/${slug || 'your-post-slug'}`

  const inTitle = focus ? effTitle.toLowerCase().includes(focus) : false
  const inDesc = focus ? effDesc.toLowerCase().includes(focus) : false
  const inSlug = focus ? slug.toLowerCase().includes(focus.replace(/\s+/g, '-')) : false
  const inKeywords = focus ? keywords.some((k) => k.toLowerCase() === focus) : false
  const hasImage = Boolean((data.mainImage as AnyObj)?.url || (data.ogImage as AnyObj)?.url)

  // Rough SEO score
  const checks = [Boolean(focus), inTitle, inDesc, inSlug, effTitle.length >= 40 && effTitle.length <= 60, effDesc.length >= 120 && effDesc.length <= 160, keywords.length >= 3, hasImage]
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100)
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'
  const scoreRing = score >= 80 ? 'border-green-500' : score >= 50 ? 'border-amber-500' : 'border-red-500'

  const inputCls = adminInput

  function addKeyword(k: string) {
    const v = k.trim()
    if (!v || keywords.some((x) => x.toLowerCase() === v.toLowerCase())) return
    onChange('keywords', [...keywords, v])
  }
  function suggestFromTitle() {
    const stop = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'your', 'you', 'is', 'are', 'how', 'why', 'what'])
    const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stop.has(w))
    const uniq = Array.from(new Set(words)).slice(0, 6)
    const merged = [...keywords]
    for (const w of uniq) if (!merged.some((x) => x.toLowerCase() === w)) merged.push(w)
    onChange('keywords', merged)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-5">
      {/* Header + score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-900 font-semibold">SEO</h3>
          <p className="text-slate-500 text-xs">Optimize how this post appears in Google &amp; social media.</p>
        </div>
        <div className={`w-14 h-14 rounded-full border-2 ${scoreRing} flex flex-col items-center justify-center bg-white`}>
          <span className={`text-lg font-bold ${scoreColor}`}>{score}</span>
          <span className="text-[9px] text-slate-400 -mt-1">score</span>
        </div>
      </div>

      {/* Focus keyword */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Focus Keyword</label>
        <input
          value={str(data.focusKeyword)}
          onChange={(e) => onChange('focusKeyword', e.target.value)}
          placeholder="e.g. robotics course in nepal"
          className={inputCls}
        />
        <p className="text-gray-500 text-xs mt-1">The main phrase you want this post to rank for.</p>
      </div>

      {/* Meta title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Title</label>
        <input
          value={seoTitle}
          onChange={(e) => onChange('seoTitle', e.target.value)}
          placeholder={title || 'Defaults to the post title'}
          className={inputCls}
        />
        <Meter value={effTitle.length} min={40} max={60} label="Title length" />
      </div>

      {/* Meta description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
        <textarea
          rows={3}
          value={seoDescription}
          onChange={(e) => onChange('seoDescription', e.target.value)}
          placeholder={excerpt || 'Defaults to the excerpt'}
          className={inputCls}
        />
        <Meter value={effDesc.length} min={120} max={160} label="Description length" />
      </div>

      {/* Keywords */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700">Keywords</label>
          <button type="button" onClick={suggestFromTitle} className="text-xs text-[#C1121F] hover:underline">Suggest from title</button>
        </div>
        <div className="bg-white border border-slate-300 rounded-lg px-2 py-2 flex flex-wrap gap-2">
          {keywords.map((k, i) => (
            <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${focus && k.toLowerCase() === focus ? 'bg-[#C1121F] text-white' : 'bg-slate-100 text-slate-800'}`}>
              {k}
              <button type="button" onClick={() => onChange('keywords', keywords.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600">×</button>
            </span>
          ))}
          <input
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && kwInput.trim()) {
                e.preventDefault()
                addKeyword(kwInput)
                setKwInput('')
              } else if (e.key === 'Backspace' && !kwInput && keywords.length) {
                onChange('keywords', keywords.slice(0, -1))
              }
            }}
            placeholder="Type a keyword, press Enter"
            className="flex-1 min-w-[140px] bg-transparent text-slate-900 text-sm focus:outline-none px-1"
          />
        </div>
        <p className="text-slate-500 text-xs mt-1">{keywords.length} keyword{keywords.length === 1 ? '' : 's'} · aim for 3–8 relevant ones.</p>
      </div>

      {/* Google preview */}
      <div>
        <p className="text-xs text-slate-500 mb-2">Search result preview</p>
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-[#1a0dab] text-lg leading-tight truncate">{effTitle || 'Your post title appears here'}</p>
          <p className="text-[#006621] text-xs mt-0.5 truncate">{previewUrl}</p>
          <p className="text-[#545454] text-sm mt-1 line-clamp-2">{effDesc || 'Your meta description appears here. Write a compelling 120–160 character summary.'}</p>
        </div>
      </div>

      {/* Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Check ok={Boolean(focus)}>Focus keyword set</Check>
        <Check ok={inTitle}>Keyword in title</Check>
        <Check ok={inDesc}>Keyword in description</Check>
        <Check ok={inSlug}>Keyword in URL slug</Check>
        <Check ok={inKeywords}>Focus keyword in keyword list</Check>
        <Check ok={effTitle.length >= 40 && effTitle.length <= 60}>Title length optimal</Check>
        <Check ok={effDesc.length >= 120 && effDesc.length <= 160}>Description length optimal</Check>
        <Check ok={hasImage}>Social/share image set</Check>
      </div>
    </div>
  )
}
