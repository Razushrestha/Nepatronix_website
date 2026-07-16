import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import TaskModule from '@/app/(admin)/components/tasks/TaskModule'

export const dynamic = 'force-dynamic'

export default async function AdminTasksPage() {
  const user = await getSession()
  if (!user) redirect('/admin/login')

  if (user.role !== 'admin') {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h1 className="text-lg font-bold text-slate-900">Tasks are admin-only here</h1>
          <p className="text-sm text-slate-500 mt-2">
            Your CMS role ({user.role}) doesn&apos;t have task management access in the admin console.
          </p>
        </div>
      </div>
    )
  }

  return <TaskModule role="super_hr_admin" currentUserId={user.id} variant="admin" />
}
