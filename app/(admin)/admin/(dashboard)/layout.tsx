import { redirect } from 'next/navigation'
import Sidebar from '@/app/(admin)/components/Sidebar'
import TopBar from '@/app/(admin)/components/TopBar'
import { getSession } from '@/lib/auth'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#0d0d14]">
      <Sidebar user={{ name: user.name, email: user.email, role: user.role }} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
