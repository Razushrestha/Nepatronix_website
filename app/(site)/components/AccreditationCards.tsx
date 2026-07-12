import Image from 'next/image'
import type { AccreditationItem } from '@/lib/site-content'

export function AccreditationCards({ items }: { items: AccreditationItem[] }) {
  return (
    <div className="mx-auto mt-14 grid max-w-4xl gap-12 sm:gap-14 md:grid-cols-2 md:gap-10">
      {items.map((item, index) => {
        const badgeClass =
          item.badgeTone === 'emerald'
            ? 'bg-emerald-500/10 text-emerald-700'
            : 'bg-[#1e88e5]/10 text-[#1e88e5]'
        const borderClass = index === 0 ? 'md:border-r md:border-slate-200 md:pr-8 md:pt-0' : 'md:pl-8 md:pt-0'
        const topBorder = index > 0 ? 'border-t border-slate-200 pt-10 md:border-t-0' : ''

        return (
          <div
            key={item.title}
            className={`flex flex-col items-center text-center ${topBorder} ${borderClass}`}
          >
            <div className="mb-6 flex h-28 w-full items-center justify-center">
              {item.logoUrl ? (
                <Image
                  src={item.logoUrl}
                  alt={item.title}
                  width={220}
                  height={180}
                  loading="lazy"
                  sizes="(max-width: 768px) 140px, 220px"
                  className="h-auto max-h-24 w-auto max-w-full object-contain"
                />
              ) : null}
            </div>
            {item.badge ? (
              <span className={`mb-3 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${badgeClass}`}>
                {item.badge}
              </span>
            ) : null}
            <h3 className="mb-3 text-xl font-bold text-[#020617]">{item.title}</h3>
            <p className="max-w-sm text-base leading-relaxed text-[#64748b]">{item.description}</p>
          </div>
        )
      })}
    </div>
  )
}
