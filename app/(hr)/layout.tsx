import type { Metadata } from 'next'
import './hr-theme.css'

export const metadata: Metadata = {
  title: 'HR Portal — Nepatronix',
  robots: 'noindex,nofollow',
}

export default function HrRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
