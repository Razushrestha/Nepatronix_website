import type { FaqQA } from '@/lib/seo/jsonLd'

interface FaqSectionProps {
  eyebrow?: string
  title?: string
  description?: string
  items: FaqQA[]
  id?: string
  className?: string
}

/**
 * Visible FAQ block that mirrors any FAQPage JSON-LD on the same page.
 * Uses <details> so it works without JS and remains crawlable/accessible.
 */
export function FaqSection({
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  description,
  items,
  id = 'faq',
  className = '',
}: FaqSectionProps) {
  if (!items?.length) return null
  return (
    <section id={id} className={`mx-auto max-w-4xl px-6 py-16 ${className}`}>
      <div className="text-center mb-10">
        {eyebrow ? (
          <p className="text-[10px] font-semibold text-[#C1121F] uppercase tracking-[0.3em] mb-3">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-bold text-[#020617] tracking-tight">{title}</h2>
        ) : null}
        {description ? (
          <p className="mt-3 text-slate-500 text-base">{description}</p>
        ) : null}
      </div>
      <div className="space-y-3">
        {items.map((qa, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 open:shadow-md open:border-[#C1121F]/40 transition-all"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
              <span className="text-base font-semibold text-[#020617]">{qa.question}</span>
              <svg
                className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
              {qa.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
