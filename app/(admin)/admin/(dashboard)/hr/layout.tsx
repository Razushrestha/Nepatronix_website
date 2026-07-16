import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { HrUiProvider } from '@/lib/hr/ui-context'
import '@/app/(hr)/hr-theme.css'

export default async function AdminHrLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/admin/login')
  if (user.role !== 'admin') redirect('/admin')

  return (
    <HrUiProvider root="admin">
      <div className="hr-theme">{children}</div>
    </HrUiProvider>
  )
}
