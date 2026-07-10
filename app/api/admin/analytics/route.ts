import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import {
  Visit,
  Enrollment,
  Certification,
  ContactForm,
  Subscriber,
  Course,
  Post,
} from '@/lib/models'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function daysAgo(n: number) {
  const d = startOfToday()
  d.setDate(d.getDate() - n)
  return d
}
function monthsAgo(n: number) {
  const d = startOfToday()
  d.setDate(1)
  d.setMonth(d.getMonth() - n)
  return d
}

async function uniqueCount(match: Record<string, unknown>) {
  const rows = await Visit.aggregate([
    { $match: match },
    { $group: { _id: '$visitorId' } },
    { $count: 'n' },
  ])
  return rows[0]?.n || 0
}

export async function GET() {
  const user = await requireRole()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectToDatabase()

  const today = startOfToday()
  const weekStart = daysAgo(6)
  const monthStart = daysAgo(29)

  const [
    totalVisits,
    visitsToday,
    visitsWeek,
    visitsMonth,
    uniqueTotal,
    uniqueToday,
    uniqueWeek,
    uniqueMonth,
    totalEnquiries,
    newEnquiries,
    totalEnrollments,
    weekEnrollments,
    totalCertifications,
    totalSubscribers,
    totalCourses,
    totalPosts,
    dailyRows,
    monthlyRows,
    topPages,
    devices,
    topReferrers,
  ] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({ createdAt: { $gte: today } }),
    Visit.countDocuments({ createdAt: { $gte: weekStart } }),
    Visit.countDocuments({ createdAt: { $gte: monthStart } }),
    uniqueCount({}),
    uniqueCount({ createdAt: { $gte: today } }),
    uniqueCount({ createdAt: { $gte: weekStart } }),
    uniqueCount({ createdAt: { $gte: monthStart } }),
    ContactForm.countDocuments(),
    ContactForm.countDocuments({ status: 'new' }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ createdAt: { $gte: weekStart } }),
    Certification.countDocuments(),
    Subscriber.countDocuments({ status: 'active' }),
    Course.countDocuments(),
    Post.countDocuments(),
    Visit.aggregate([
      { $match: { createdAt: { $gte: daysAgo(29) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          visits: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
        },
      },
    ]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: monthsAgo(11) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          visits: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
        },
      },
    ]),
    Visit.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Visit.aggregate([{ $group: { _id: '$device', count: { $sum: 1 } } }]),
    Visit.aggregate([
      { $match: { referrer: { $ne: '' } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
  ])

  // Build 30-day series
  const dailyMap = new Map(dailyRows.map((r) => [r._id, { visits: r.visits, visitors: r.visitors.length }]))
  const series: { date: string; visits: number; visitors: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const v = dailyMap.get(key)
    series.push({ date: key, visits: v?.visits || 0, visitors: v?.visitors || 0 })
  }

  // Build 12-month series
  const monthMap = new Map(monthlyRows.map((r) => [r._id, { visits: r.visits, visitors: r.visitors.length }]))
  const months: { month: string; visits: number; visitors: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = monthsAgo(i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const v = monthMap.get(key)
    months.push({ month: label, visits: v?.visits || 0, visitors: v?.visitors || 0 })
  }

  return NextResponse.json({
    kpis: {
      totalVisits,
      visitsToday,
      visitsWeek,
      visitsMonth,
      uniqueTotal,
      uniqueToday,
      uniqueWeek,
      uniqueMonth,
      totalEnquiries,
      newEnquiries,
      totalEnrollments,
      weekEnrollments,
      totalCertifications,
      totalSubscribers,
      totalCourses,
      totalPosts,
    },
    series,
    months,
    topPages: topPages.map((p) => ({ path: p._id || '/', count: p.count })),
    devices: devices.map((d) => ({ device: d._id || 'unknown', count: d.count })),
    topReferrers: topReferrers.map((r) => ({ referrer: r._id, count: r.count })),
  })
}
