'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { collections, groupOrder, canView } from '@/lib/admin-collections'
import { Icon } from './icons'

interface SidebarUser {
  name: string
  email: string
  role: string
}

function navLinkClass(active: boolean) {
  return active
    ? 'bg-[#C1121F]/10 text-slate-900'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
}

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  const grouped = groupOrder
    .map((g) => ({ group: g, items: collections.filter((c) => c.group === g && canView(c.slug, user.role)) }))
    .filter((g) => g.items.length > 0)

  const content = (
    <>
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="text-white font-black text-base tracking-tight">N</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm leading-tight tracking-wide">Nepatronix</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-slate-200" />

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${navLinkClass(pathname === '/admin')}`}
        >
          {pathname === '/admin' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />}
          <span className={pathname === '/admin' ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
            <Icon name="dashboard" />
          </span>
          Dashboard
        </Link>

        <Link
          href="/admin/analytics"
          onClick={() => setOpen(false)}
          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${navLinkClass(pathname === '/admin/analytics')}`}
        >
          {pathname === '/admin/analytics' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />}
          <span className={pathname === '/admin/analytics' ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
            <Icon name="chart" />
          </span>
          Statistics
        </Link>

        {user.role === 'admin' && (
          <div>
            <p className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">HR</p>
            <div className="space-y-0.5">
              {[
                { href: '/admin/hr', label: 'HR Overview', icon: 'dashboard', exact: true },
                { href: '/admin/hr/employees', label: 'Employees', icon: 'users' },
                { href: '/admin/hr/attendance', label: 'Attendance', icon: 'clock' },
                { href: '/admin/hr/leave', label: 'Leave', icon: 'calendar' },
                { href: '/admin/hr/settings', label: 'Office Settings', icon: 'settings' },
              ].map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${navLinkClass(active)}`}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />}
                    <span className={active ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
                      <Icon name={item.icon} />
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {grouped.map(({ group, items }) => (
          <div key={group}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{group}</p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const href = `/admin/c/${item.slug}`
                const active = pathname.startsWith(href)
                return (
                  <Link
                    key={item.slug}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${navLinkClass(active)}`}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />}
                    <span className={active ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
                      <Icon name={item.icon} />
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-5 mb-3 h-px bg-slate-200" />
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center text-white text-xs font-bold">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-slate-900 text-xs font-semibold truncate">{user.name || 'Admin'}</p>
            <p className="text-slate-500 text-[10px] capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-5 space-y-0.5">
        <Link
          href="/attendance"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <Icon name="clock" className="w-4 h-4" />
          Staff Attendance
        </Link>
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View Site
        </a>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 w-full transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setOpen(false)} />}

      <aside className={`w-64 flex flex-col bg-white border-r border-slate-200 z-40 fixed lg:sticky top-0 h-screen transition-transform shadow-sm ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {content}
      </aside>
    </>
  )
}
