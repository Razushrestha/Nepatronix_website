import Link from 'next/link'
import type { HomeServiceItem } from '@/lib/site-content'
import { HomeServiceIcon } from './HomeServiceIcons'

export function HomeServicesGrid({ services }: { services: HomeServiceItem[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service) => (
        <Link
          href={service.href}
          key={service.title}
          className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-[#C1121F]/20"
        >
          <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${service.colorClass}`}>
            <div className="w-10 h-10">
              <HomeServiceIcon iconKey={service.iconKey} />
            </div>
          </div>
          <h3 className="mb-4 text-center text-lg font-bold text-[#020617] group-hover:text-[#C1121F] transition-colors">
            {service.title}
          </h3>
          <p className="text-center text-sm leading-relaxed text-slate-500 font-medium">
            {service.description}
          </p>
          <div className="mt-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C1121F] flex items-center gap-2">
              Learn More
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
