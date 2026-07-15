import { redirect } from 'next/navigation'
import { getHrSession } from '@/lib/hr/auth'
import HrSidebar from '@/app/(hr)/components/HrSidebar'

export default async function HrPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getHrSession()
  if (!user) redirect('/hr/login')

  return (
    <div className="hr-theme flex min-h-screen bg-slate-100">
      <HrSidebar user={user} />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
