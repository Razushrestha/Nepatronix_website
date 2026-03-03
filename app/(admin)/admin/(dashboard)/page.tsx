import { client } from '@/sanity/lib/client'
import Link from 'next/link'

export const revalidate = 60

async function getStats() {
  const [totalEnrollments, totalCertifications, pendingEnrollments, pendingCertifications, recentEnrollments, recentCertifications] = await Promise.all([
    client.fetch<number>(`count(*[_type == "enrollment"])`),
    client.fetch<number>(`count(*[_type == "certificationApplication"])`),
    client.fetch<number>(`count(*[_type == "enrollment" && status == "pending"])`),
    client.fetch<number>(`count(*[_type == "certificationApplication" && status == "pending"])`),
    client.fetch(`*[_type == "enrollment"] | order(_createdAt desc)[0..4]{_id, fullName, courseName, status, createdAt}`),
    client.fetch(`*[_type == "certificationApplication"] | order(submittedAt desc)[0..4]{_id, applicantName, courseName, status, submittedAt}`),
  ])
  return { totalEnrollments, totalCertifications, pendingEnrollments, pendingCertifications, recentEnrollments, recentCertifications }
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
    totalEnrollments,
    totalCertifications,
    pendingEnrollments,
    pendingCertifications,
    recentEnrollments,
    recentCertifications,
  } = await getStats()

  const stats = [
    { label: 'Total Enrollments', value: totalEnrollments, sub: `${pendingEnrollments} pending`, href: '/admin/enrollments', color: 'text-blue-400' },
    { label: 'Total Certifications', value: totalCertifications, sub: `${pendingCertifications} pending`, href: '/admin/certifications', color: 'text-purple-400' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of enrollments and certifications</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
          >
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-4xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Enrollments</h2>
            <Link href="/admin/enrollments" className="text-xs text-[#C1121F] hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentEnrollments.length === 0 && <p className="text-gray-500 text-sm">No enrollments yet.</p>}
            {recentEnrollments.map((e: { _id: string; fullName: string; courseName: string; status: string }) => (
              <Link
                key={e._id}
                href={`/admin/enrollments/${e._id}`}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium">{e.fullName}</p>
                  <p className="text-gray-400 text-xs">{e.courseName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${ENROLLMENT_BADGE[e.status] || 'bg-gray-700 text-gray-300'}`}>
                  {e.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Certifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Certification Applications</h2>
            <Link href="/admin/certifications" className="text-xs text-[#C1121F] hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentCertifications.length === 0 && <p className="text-gray-500 text-sm">No applications yet.</p>}
            {recentCertifications.map((c: { _id: string; applicantName: string; courseName: string; status: string }) => (
              <Link
                key={c._id}
                href={`/admin/certifications/${c._id}`}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium">{c.applicantName}</p>
                  <p className="text-gray-400 text-xs">{c.courseName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${CERT_BADGE[c.status] || 'bg-gray-700 text-gray-300'}`}>
                  {c.status?.replace(/_/g, ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
