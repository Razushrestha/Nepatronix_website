import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import {
  Enrollment,
  Certification,
  Course,
  Post,
  Subscriber,
  ContactForm,
  Gallery,
  TeamMember,
  Stat,
} from '@/lib/models'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

async function dailySeries(Model: typeof Enrollment, dateField: string, days = 30) {
  const start = daysAgo(days - 1)
  const rows = await Model.aggregate([
    { $match: { [dateField]: { $gte: start } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
  ])
  const map = new Map(rows.map((r) => [r._id, r.count]))
  const out: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i)
    const key = d.toISOString().slice(0, 10)
    out.push({ date: key, count: map.get(key) || 0 })
  }
  return out
}

async function statusBreakdown(Model: typeof Enrollment, field = 'status') {
  const rows = await Model.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ])
  return rows.map((r) => ({ status: r._id || 'unknown', count: r.count }))
}

export async function GET() {
  const user = await requireRole()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()
  const weekAgo = daysAgo(7)

  const [
    totalEnrollments,
    totalCertifications,
    totalCourses,
    totalPosts,
    totalSubscribers,
    newMessages,
    totalGalleries,
    totalTeam,
    totalHomeStats,
    pendingEnrollments,
    pendingCertifications,
    weekEnrollments,
    weekCertifications,
    enrollmentStatus,
    certStatus,
    enrollSeries,
    certSeries,
    recentEnrollments,
    recentCertifications,
    recentMessages,
  ] = await Promise.all([
    Enrollment.countDocuments(),
    Certification.countDocuments(),
    Course.countDocuments(),
    Post.countDocuments(),
    Subscriber.countDocuments({ status: 'active' }),
    ContactForm.countDocuments({ status: 'new' }),
    Gallery.countDocuments(),
    TeamMember.countDocuments(),
    Stat.countDocuments(),
    Enrollment.countDocuments({ status: 'pending' }),
    Certification.countDocuments({ status: 'pending' }),
    Enrollment.countDocuments({ createdAt: { $gte: weekAgo } }),
    Certification.countDocuments({ submittedAt: { $gte: weekAgo } }),
    statusBreakdown(Enrollment),
    statusBreakdown(Certification),
    dailySeries(Enrollment, 'createdAt'),
    dailySeries(Certification, 'submittedAt'),
    Enrollment.find().sort('-createdAt').limit(6).select('fullName courseName status createdAt').lean(),
    Certification.find().sort('-submittedAt').limit(6).select('applicantName courseName status submittedAt').lean(),
    ContactForm.find().sort('-createdAt').limit(6).select('name email status createdAt').lean(),
  ])

  const series = enrollSeries.map((e, i) => ({
    date: e.date,
    enrollments: e.count,
    certifications: certSeries[i]?.count || 0,
  }))

  return NextResponse.json({
    kpis: {
      totalEnrollments,
      totalCertifications,
      totalCourses,
      totalPosts,
      totalSubscribers,
      newMessages,
      totalGalleries,
      totalTeam,
      totalHomeStats,
      pendingEnrollments,
      pendingCertifications,
      weekEnrollments,
      weekCertifications,
    },
    enrollmentStatus,
    certStatus,
    series,
    recent: {
      enrollments: JSON.parse(JSON.stringify(recentEnrollments)),
      certifications: JSON.parse(JSON.stringify(recentCertifications)),
      messages: JSON.parse(JSON.stringify(recentMessages)),
    },
  })
}
