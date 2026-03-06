import { client } from '@/sanity/lib/client'
import Link from 'next/link'

export const revalidate = 60

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  enrolled: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

async function getEnrollments() {
  return client.fetch(`
    *[_type == "enrollment"] | order(_createdAt desc) {
      _id, fullName, email, phone, organization, courseName, coursePrice, status, _createdAt, notes
    }
  `)
}

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments()

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
  const counts = enrollments.reduce((acc: Record<string, number>, e: { status: string }) => {
    acc[e.status] = (acc[e.status] || 0) + 1
    return acc
  }, {})
  const recentCount = enrollments.filter(
    (e: { _createdAt?: string }) => e._createdAt && Date.now() - new Date(e._createdAt).getTime() <= SEVEN_DAYS_MS
  ).length

  const STATUS_FILTERS = [
    { value: 'all', label: 'All', count: enrollments.length, dot: 'bg-white', card: 'border-white/20 bg-white/8', text: 'text-white' },
    { value: 'recent', label: 'Last 7 Days', count: recentCount, dot: 'bg-emerald-400', card: 'border-emerald-500/30 bg-emerald-500/8', text: 'text-emerald-300' },
    { value: 'pending', label: 'Pending', count: counts['pending'] || 0, dot: 'bg-yellow-400', card: 'border-yellow-500/30 bg-yellow-500/8', text: 'text-yellow-300' },
    { value: 'contacted', label: 'Contacted', count: counts['contacted'] || 0, dot: 'bg-blue-400', card: 'border-blue-500/30 bg-blue-500/8', text: 'text-blue-300' },
    { value: 'enrolled', label: 'Enrolled', count: counts['enrolled'] || 0, dot: 'bg-green-400', card: 'border-green-500/30 bg-green-500/8', text: 'text-green-300' },
    { value: 'cancelled', label: 'Cancelled', count: counts['cancelled'] || 0, dot: 'bg-red-400', card: 'border-red-500/30 bg-red-500/8', text: 'text-red-300' },
  ]

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Course Enrollments</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            <span className="text-white font-medium">{enrollments.length}</span> total
            {recentCount > 0 && (
              <span className="ml-2 text-emerald-400 font-medium">+{recentCount} this week</span>
            )}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUS_FILTERS.map((s) => (
          <div
            key={s.value}
            className={`flex flex-col items-start gap-1 px-3.5 py-2.5 rounded-xl border text-left ${s.card}`}
          >
            <div className="flex items-center gap-1.5 w-full">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.value === 'recent' ? 'animate-pulse' : ''}`} />
              <span className="text-[11px] font-medium text-white truncate">{s.label}</span>
            </div>
            <span className={`text-lg font-bold leading-none ${s.text}`}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">#</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Course</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden lg:table-cell">Phone</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Date</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Status</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">No enrollments found.</td>
              </tr>
            )}
            {enrollments.map((e: { _id: string; fullName: string; courseName: string; email: string; phone: string; status: string; _createdAt?: string }, i: number) => {
              const isRecent = e._createdAt && Date.now() - new Date(e._createdAt).getTime() <= SEVEN_DAYS_MS
              return (
                <tr
                  key={e._id}
                  className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}
                >
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{e.fullName}</span>
                      {isRecent && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">New</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300 max-w-48 truncate">{e.courseName}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{e.email}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{e.phone}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                    {e._createdAt ? (
                      <>
                        <div>{new Date(e._createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-gray-600">{new Date(e._createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-emerald-600/80 text-[10px] mt-0.5">{timeAgo(e._createdAt)}</div>
                      </>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${BADGE[e.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/enrollments/${e._id}`} className="text-[#C1121F] hover:underline text-xs font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
