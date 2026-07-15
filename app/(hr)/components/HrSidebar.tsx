'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HR_DEPARTMENTS, isHrAdminRole, isHrManagerRole } from '@/lib/hr/constants'
import type { HrSessionUser } from '@/lib/hr/auth'

const NAV = [
  { href: '/hr', label: 'Dashboard', icon: '🏠' },
  { href: '/hr/attendance', label: 'Attendance', icon: '🕐' },
  { href: '/hr/leave', label: 'My Leave', icon: '📅' },
  { href: '/hr/approvals', label: 'Approvals', icon: '✅', manager: true },
  { href: '/hr/manage/employees', label: 'Employees', icon: '👥', hr: true },
  { href: '/hr/manage/attendance', label: 'All Attendance', icon: '📊', hr: true },
  { href: '/hr/manage/leave', label: 'Leave Queue', icon: '📋', hr: true },
  { href: '/hr/manage/settings', label: 'Office Settings', icon: '⚙️', hr: true },
]

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
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-slate-200">
        <p className="text-xs font-bold text-[#C1121F] uppercase tracking-widest">Nepatronix HR</p>
        <p className="text-sm font-semibold text-slate-900 mt-1">{dept}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
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
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-[#C1121F]/10 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 space-y-2">
        {isHrAdminRole(user.role) && (
          <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50">
            <span>🌐</span>
            CMS Admin
          </Link>
        )}
        <div className="px-2">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName}</p>
          <p className="text-[10px] text-slate-500 uppercase">{user.employeeCode} · {user.role.replace(/_/g, ' ')}</p>
        </div>
        <button type="button" onClick={logout} className="w-full text-left text-sm text-slate-600 hover:text-red-600 px-2 py-1">
          Sign out
        </button>
      </div>
    </aside>
  )
}
