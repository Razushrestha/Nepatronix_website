import { client } from '@/sanity/lib/client'
import Link from 'next/link'

export const revalidate = 60

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

async function getStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [
    totalEnrollments, totalCertifications,
    pendingEnrollments, pendingCertifications,
    weekEnrollments, weekCertifications,
    recentEnrollments, recentCertifications,
  ] = await Promise.all([
    client.fetch<number>(`count(*[_type == "enrollment"])`),
    client.fetch<number>(`count(*[_type == "certificationApplication"])`),
    client.fetch<number>(`count(*[_type == "enrollment" && status == "pending"])`),
    client.fetch<number>(`count(*[_type == "certificationApplication" && status == "pending"])`),
    client.fetch<number>(`count(*[_type == "enrollment" && _createdAt > $d])`, { d: sevenDaysAgo }),
    client.fetch<number>(`count(*[_type == "certificationApplication" && submittedAt > $d])`, { d: sevenDaysAgo }),
    client.fetch(`*[_type == "enrollment"] | order(_createdAt desc)[0..4]{_id, fullName, courseName, status, _createdAt}`),
    client.fetch(`*[_type == "certificationApplication"] | order(submittedAt desc)[0..4]{_id, applicantName, courseName, status, submittedAt}`),
  ])
  return {
    totalEnrollments, totalCertifications,
    pendingEnrollments, pendingCertifications,
    weekEnrollments, weekCertifications,
    recentEnrollments, recentCertifications,
  }
}

const ENROLLMENT_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  contacted: 'bg-blue-500/10 text-blue-400',
  enrolled: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
}

const CERT_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  payment_verified: 'bg-blue-500/10 text-blue-400',
  approved: 'bg-green-500/10 text-green-400',
  certificate_generated: 'bg-purple-500/10 text-purple-400',
  rejected: 'bg-red-500/10 text-red-400',
}

export default async function AdminDashboard() {
  const {
    totalEnrollments, totalCertifications,
    pendingEnrollments, pendingCertifications,
    weekEnrollments, weekCertifications,
    recentEnrollments, recentCertifications,
  } = await getStats()

  const stats = [
    {
      label: 'Total Enrollments',
      value: totalEnrollments,
      sub: `${pendingEnrollments} pending`,
      week: weekEnrollments,
      href: '/admin/enrollments',
      color: 'text-blue-400',
      weekColor: 'text-blue-300',
      dot: 'bg-blue-400',
    },
    {
      label: 'Total Certifications',
      value: totalCertifications,
      sub: `${pendingCertifications} pending`,
      week: weekCertifications,
      href: '/admin/certifications',
      color: 'text-purple-400',
      weekColor: 'text-purple-300',
      dot: 'bg-purple-400',
    },
  ]

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of enrollments and certifications</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{s.label}</p>
              {s.week > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  +{s.week} this week
                </span>
              )}
            </div>
            <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
          </Link>
        ))}

        {/* Combined This Week card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-3">New This Week</p>
          <p className="text-4xl font-bold text-green-400">{weekEnrollments + weekCertifications}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-blue-400">{weekEnrollments} enrollments</span>
            <span className="text-xs text-gray-700">·</span>
            <span className="text-xs text-purple-400">{weekCertifications} certifications</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F] animate-pulse" />
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Recent Activity</h2>
          <span className="text-gray-600 text-xs ml-1">— latest 5 each</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Recent Enrollments */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h2 className="text-white font-semibold">Recent Enrollments</h2>
              </div>
              <Link href="/admin/enrollments" className="text-xs text-[#C1121F] hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {recentEnrollments.length === 0 && <p className="text-gray-500 text-sm">No enrollments yet.</p>}
              {recentEnrollments.map((e: { _id: string; fullName: string; courseName: string; status: string; _createdAt?: string }) => (
                <Link
                  key={e._id}
                  href={`/admin/enrollments/${e._id}`}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-800/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{e.fullName}</p>
                    <p className="text-gray-500 text-xs truncate">{e.courseName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ENROLLMENT_BADGE[e.status] || 'bg-gray-700 text-gray-300'}`}>
                      {e.status}
                    </span>
                    <span className="text-gray-600 text-[10px]">{timeAgo(e._createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Certifications */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h2 className="text-white font-semibold">Recent Certification Applications</h2>
              </div>
              <Link href="/admin/certifications" className="text-xs text-[#C1121F] hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {recentCertifications.length === 0 && <p className="text-gray-500 text-sm">No applications yet.</p>}
              {recentCertifications.map((c: { _id: string; applicantName: string; courseName: string; status: string; submittedAt?: string }) => (
                <Link
                  key={c._id}
                  href={`/admin/certifications/${c._id}`}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-800/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{c.applicantName}</p>
                    <p className="text-gray-500 text-xs truncate">{c.courseName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CERT_BADGE[c.status] || 'bg-gray-700 text-gray-300'}`}>
                      {c.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-600 text-[10px]">{timeAgo(c.submittedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
