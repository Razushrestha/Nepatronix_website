'use client'
import { usePathname } from 'next/navigation'
import { getCollection } from '@/lib/admin-collections'

function useTitle(pathname: string) {
  if (pathname === '/admin') return { title: 'Dashboard', description: 'Overview of all activity' }
  if (pathname === '/admin/analytics') return { title: 'Statistics & Analytics', description: 'Visitor traffic and engagement' }
  const m = pathname.match(/^\/admin\/c\/([^/]+)(\/(.+))?/)
  if (m) {
    const config = getCollection(m[1])
    if (config) {
      if (m[3] === 'new') return { title: `New ${config.singular}`, description: `Create a new ${config.singular.toLowerCase()}` }
      if (m[3]) return { title: `Edit ${config.singular}`, description: `Update this ${config.singular.toLowerCase()}` }
      return { title: config.label, description: `Manage ${config.label.toLowerCase()}` }
    }
  }
  return { title: 'Admin', description: '' }
}

export default function TopBar() {
  const pathname = usePathname()
  const { title, description } = useTitle(pathname)
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 pl-10 lg:pl-0">
        <div>
          <h2 className="text-slate-900 text-sm font-semibold leading-tight">{title}</h2>
          {description && <p className="text-slate-500 text-[11px] leading-tight mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-500 text-xs hidden md:block">{dateStr}</span>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>
    </header>
  )
}
