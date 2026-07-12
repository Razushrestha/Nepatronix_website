import Image from 'next/image'
import type { IncubatorItem } from '@/lib/site-content'

export function IncubatorsGrid({ items }: { items: IncubatorItem[] }) {
  return (
    <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((org) => (
        <div
          key={org.name}
          className="flex h-44 flex-col items-center justify-center p-4 text-center transition-transform duration-300 hover:scale-105"
        >
          {org.logoUrl ? (
            <Image
              src={org.logoUrl}
              alt={`${org.name} logo`}
              width={260}
              height={130}
              className="h-auto max-h-36 w-auto max-w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
            />
          ) : (
            <span className="text-sm font-bold text-[#020617]">{org.name}</span>
          )}
        </div>
      ))}
    </div>
  )
}
