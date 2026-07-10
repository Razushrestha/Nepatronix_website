'use client'
import { useState } from 'react'

type AnyObj = Record<string, unknown>

const SITE = process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function Meter({ value, min, max, label }: { value: number; min: number; max: number; label: string }) {
  const ok = value >= min && value <= max
  const near = value > 0 && !ok
  const color = ok ? 'text-green-400' : near ? 'text-yellow-400' : 'text-gray-500'
  const bar = ok ? 'bg-green-500' : near ? 'bg-yellow-500' : 'bg-gray-600'
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="mt-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-gray-500">{label}</span>
        <span className={color}>{value} / {min}–{max}</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-flex w-4 h-4 rounded-full items-center justify-center text-[10px] ${ok ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
        {ok ? '✓' : '·'}
      </span>
      <span className={ok ? 'text-gray-300' : 'text-gray-500'}>{children}</span>
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
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
  const scoreRing = score >= 80 ? 'border-green-500' : score >= 50 ? 'border-yellow-500' : 'border-red-500'

  const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C1121F]'

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
    <div className="rounded-2xl border border-gray-700 bg-gray-800/40 p-5 space-y-5">
      {/* Header + score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">SEO</h3>
          <p className="text-gray-500 text-xs">Optimize how this post appears in Google &amp; social media.</p>
        </div>
        <div className={`w-14 h-14 rounded-full border-2 ${scoreRing} flex flex-col items-center justify-center`}>
          <span className={`text-lg font-bold ${scoreColor}`}>{score}</span>
          <span className="text-[9px] text-gray-500 -mt-1">score</span>
        </div>
      </div>

      {/* Focus keyword */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Focus Keyword</label>
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
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Meta Title</label>
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
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Meta Description</label>
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
          <label className="block text-sm font-medium text-gray-300">Keywords</label>
          <button type="button" onClick={suggestFromTitle} className="text-xs text-[#C1121F] hover:underline">Suggest from title</button>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 flex flex-wrap gap-2">
          {keywords.map((k, i) => (
            <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${focus && k.toLowerCase() === focus ? 'bg-[#C1121F] text-white' : 'bg-gray-700 text-white'}`}>
              {k}
              <button type="button" onClick={() => onChange('keywords', keywords.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-300">×</button>
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
            className="flex-1 min-w-[140px] bg-transparent text-white text-sm focus:outline-none px-1"
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">{keywords.length} keyword{keywords.length === 1 ? '' : 's'} · aim for 3–8 relevant ones.</p>
      </div>

      {/* Google preview */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Search result preview</p>
        <div className="bg-white rounded-lg p-4">
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
