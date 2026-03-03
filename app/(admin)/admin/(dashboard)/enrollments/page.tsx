import { client } from '@/sanity/lib/client'
import Link from 'next/link'

export const revalidate = 60

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  enrolled: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

async function getEnrollments() {
  return client.fetch(`
    *[_type == "enrollment"] | order(_createdAt desc) {
      _id, fullName, email, phone, organization, courseName, coursePrice, status, createdAt, notes
    }
  `)
}

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments()

  const counts = enrollments.reduce((acc: Record<string, number>, e: { status: string }) => {
    acc[e.status] = (acc[e.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Course Enrollments</h1>
        <p className="text-gray-400 text-sm mt-1">{enrollments.length} total submissions</p>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(counts).map(([status, count]) => (
          <span key={status} className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${BADGE[status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
            {status}: {count as number}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Course</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden lg:table-cell">Phone</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Status</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">No enrollments found.</td>
              </tr>
            )}
            {enrollments.map((e: { _id: string; fullName: string; courseName: string; email: string; phone: string; status: string }, i: number) => (
              <tr key={e._id} className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                <td className="px-5 py-3.5 text-white font-medium">{e.fullName}</td>
                <td className="px-5 py-3.5 text-gray-300">{e.courseName}</td>
                <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{e.email}</td>
                <td className="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{e.phone}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
