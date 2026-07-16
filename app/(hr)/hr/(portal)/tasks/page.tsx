import { redirect } from 'next/navigation'
import { getHrSession } from '@/lib/hr/auth'
import TaskModule from '@/app/(admin)/components/tasks/TaskModule'

export const dynamic = 'force-dynamic'

export default async function HrTasksPage() {
  const user = await getHrSession()
  if (!user) redirect('/hr/login')

  return (
    <TaskModule
      role={user.role}
      currentUserId={user.id}
      department={user.department}
      variant="staff"
    />
  )
}
