import type { Metadata } from 'next'
import './admin-theme.css'

export const metadata: Metadata = {
  title: 'Admin Panel — Nepatronix',
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
