'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HR_DEPARTMENTS, isHrAdminRole, isHrManagerRole } from '@/lib/hr/constants'
import type { HrSessionUser } from '@/lib/hr/auth'
import { Icon } from '@/app/(admin)/components/icons'
import NotificationBell from '@/app/(admin)/components/tasks/NotificationBell'

const NAV = [
  { href: '/hr', label: 'Dashboard', icon: 'dashboard' },
  { href: '/hr/attendance', label: 'Attendance', icon: 'clock' },
  { href: '/hr/tasks', label: 'Tasks', icon: 'clipboard' },
  { href: '/hr/leave', label: 'My Leave', icon: 'calendar' },
  { href: '/hr/approvals', label: 'Approvals', icon: 'checkCircle', manager: true },
  { href: '/hr/manage/employees', label: 'Employees', icon: 'users', hr: true },
  { href: '/hr/manage/attendance', label: 'All Attendance', icon: 'chart', hr: true },
  { href: '/hr/manage/leave', label: 'Leave Queue', icon: 'clipboard', hr: true },
  { href: '/hr/manage/settings', label: 'Office Settings', icon: 'settings', hr: true },
]

function navLinkClass(active: boolean) {
  return active
    ? 'bg-[#C1121F]/10 text-slate-900'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
}

export default function HrSidebar({ user }: { user: HrSessionUser }) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const dept = HR_DEPARTMENTS.find((d) => d.value === user.department)?.label || user.department

  async function logout() {
    await fetch('/api/hr/auth', { method: 'DELETE' })
    router.push('/hr/login')
    router.refresh()
  }

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-screen shadow-sm">
      <div className="px-5 pt-6 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center shadow-lg shadow-red-900/20">
            <span className="text-white font-black text-base tracking-tight">N</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold text-sm leading-tight tracking-wide">Nepatronix HR</p>
            <p className="text-slate-500 text-[11px] mt-0.5 truncate">{dept}</p>
          </div>
          <NotificationBell />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV.filter((item) => {
          if (item.hr && !isHrAdminRole(user.role)) return false
          if (item.manager && !isHrManagerRole(user.role)) return false
          return true
        }).map((item) => {
          const active = item.href === '/hr' ? pathname === '/hr' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${navLinkClass(active)}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />
              )}
              <span className={active ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-5 mb-3 h-px bg-slate-200" />
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center text-white text-xs font-bold">
            {user.fullName?.[0]?.toUpperCase() || 'H'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-slate-900 text-xs font-semibold truncate">{user.fullName}</p>
            <p className="text-slate-500 text-[10px] uppercase truncate">
              {user.employeeCode} · {user.role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-5 space-y-0.5">
        {isHrAdminRole(user.role) && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <Icon name="layout" className="w-4 h-4" />
            CMS Admin
          </Link>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 w-full transition-all"
        >
          <Icon name="logout" className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
