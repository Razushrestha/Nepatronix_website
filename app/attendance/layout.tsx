import type { Metadata } from 'next'
import '@/app/(hr)/hr-theme.css'

export const metadata: Metadata = {
  title: 'Staff Attendance',
  description: 'Nepatronix employee attendance check-in',
  robots: 'noindex,nofollow',
}

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return <div className="hr-theme min-h-screen bg-slate-100">{children}</div>
}
