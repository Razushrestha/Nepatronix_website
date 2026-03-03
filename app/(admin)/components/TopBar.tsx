'use client'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/admin': { title: 'Dashboard', description: 'Overview of all activity' },
  '/admin/enrollments': { title: 'Enrollments', description: 'Manage course enrollment requests' },
  '/admin/certifications': { title: 'Certifications', description: 'Manage certificate applications' },
}

function getPageInfo(pathname: string) {
  if (pathname.startsWith('/admin/certifications/') && pathname !== '/admin/certifications') {
    return { title: 'Certificate Detail', description: 'View & manage this application' }
  }
  if (pathname.startsWith('/admin/enrollments/') && pathname !== '/admin/enrollments') {
    return { title: 'Enrollment Detail', description: 'View & manage this enrollment' }
  }
  return PAGE_TITLES[pathname] ?? { title: 'Admin', description: '' }
}

export default function TopBar() {
  const pathname = usePathname()
  const { title, description } = getPageInfo(pathname)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="h-14 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Page title */}
      <div className="flex items-center gap-3 flex-1">
        <div>
          <h2 className="text-white text-sm font-semibold leading-tight">{title}</h2>
          {description && <p className="text-gray-500 text-[11px] leading-tight mt-0.5">{description}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <span className="text-gray-600 text-xs hidden md:block">{dateStr}</span>

        {/* Divider */}
        <div className="h-5 w-px bg-white/5" />

        {/* Status badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center shadow-md shadow-red-900/20">
          <span className="text-white text-xs font-bold">A</span>
        </div>
      </div>
    </header>
  )
}
