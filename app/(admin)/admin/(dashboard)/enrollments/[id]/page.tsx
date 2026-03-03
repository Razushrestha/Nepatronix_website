import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EnrollmentActions from '../EnrollmentActions'

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  enrolled: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default async function EnrollmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const enrollment = await client.fetch(
    `*[_type == "enrollment" && _id == $id][0]{
      _id, fullName, email, phone, organization, courseName, coursePrice, message, status, createdAt, notes
    }`,
    { id }
  )

  if (!enrollment) notFound()

  const fields = [
    { label: 'Full Name', value: enrollment.fullName },
    { label: 'Email', value: enrollment.email },
    { label: 'Phone', value: enrollment.phone },
    { label: 'Organization', value: enrollment.organization || '—' },
    { label: 'Course', value: enrollment.courseName },
    { label: 'Price', value: enrollment.coursePrice || '—' },
    { label: 'Submitted', value: enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleString() : '—' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/admin/enrollments" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Back to Enrollments
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{enrollment.fullName}</h1>
          <p className="text-gray-400 text-sm mt-1">{enrollment.courseName}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full border font-medium capitalize ${BADGE[enrollment.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
          {enrollment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Applicant Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.label}>
                  <dt className="text-gray-400 text-xs mb-1">{f.label}</dt>
                  <dd className="text-white text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {enrollment.message && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-3">Message</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{enrollment.message}</p>
            </div>
          )}
        </div>

        <div>
          <EnrollmentActions enrollment={enrollment} />
        </div>
      </div>
    </div>
  )
}
