'use client'

import { Icon } from '@/app/(admin)/components/icons'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

export type AttendanceView = 'dashboard' | 'attendance' | 'salary' | 'task' | 'profile'

type User = {
  fullName: string
  employeeCode: string
  department: string
  role: string
}

const NAV: { id: AttendanceView; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'attendance', label: 'Attendance', icon: 'clock' },
  { id: 'salary', label: 'Salary', icon: 'numbers' },
  { id: 'task', label: 'Task', icon: 'clipboard' },
  { id: 'profile', label: 'Profile', icon: 'user' },
]

function navClass(active: boolean) {
  return active
    ? 'bg-[#C1121F]/10 text-slate-900'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
}

export default function AttendanceSidebar({
  user,
  active,
  onNavigate,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: {
  user: User
  active: AttendanceView
  onNavigate: (v: AttendanceView) => void
  onLogout: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const dept = HR_DEPARTMENTS.find((d) => d.value === user.department)?.label || user.department

  const content = (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center shadow-lg shadow-red-900/20">
            <span className="text-white font-black text-base tracking-tight">N</span>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm leading-tight tracking-wide">Employee Portal</p>
            <p className="text-slate-500 text-[11px] mt-0.5">{dept}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onNavigate(item.id)
              onCloseMobile()
            }}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${navClass(active === item.id)}`}
          >
            {active === item.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C1121F] rounded-full" />
            )}
            <span className={active === item.id ? 'text-[#C1121F]' : 'text-slate-500 group-hover:text-slate-700'}>
              <Icon name={item.icon} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mx-5 mb-3 h-px bg-slate-200" />
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C1121F] to-[#8B0D15] flex items-center justify-center text-white text-xs font-bold">
            {user.fullName?.[0]?.toUpperCase() || 'E'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-slate-900 text-xs font-semibold truncate">{user.fullName}</p>
            <p className="text-slate-500 text-[10px] font-mono truncate">{user.employeeCode}</p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 w-full transition-all"
        >
          <Icon name="logout" className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={onCloseMobile} aria-hidden />
      )}
      <aside
        className={`w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-screen shadow-sm z-50 fixed lg:sticky top-0 h-screen transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {content}
      </aside>
    </>
  )
}
