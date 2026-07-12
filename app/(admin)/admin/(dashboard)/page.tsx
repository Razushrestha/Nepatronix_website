'use client'
import useSWR from 'swr'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { fetcher, StatusBadge, timeAgo, Spinner } from '@/app/(admin)/components/ui'
import { collectionMap } from '@/lib/admin-collections'

const PIE_COLORS = ['#eab308', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#64748b']

interface Stats {
  kpis: Record<string, number>
  enrollmentStatus: { status: string; count: number }[]
  certStatus: { status: string; count: number }[]
  series: { date: string; enrollments: number; certifications: number }[]
  recent: {
    enrollments: { _id: string; fullName: string; courseName: string; status: string; createdAt: string }[]
    certifications: { _id: string; applicantName: string; courseName: string; status: string; submittedAt: string }[]
    messages: { _id: string; name: string; email: string; status: string; createdAt: string }[]
  }
}

function KpiCard({ label, value, sub, href, accent }: { label: string; value: number; sub?: string; href?: string; accent: string }) {
  const inner = (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors h-full">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{value ?? 0}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const { data, isLoading } = useSWR<Stats>('/api/admin/stats', fetcher, { refreshInterval: 30000 })

  if (isLoading || !data) return <Spinner />
  const k = data.kpis

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Live overview of your website and operations</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <KpiCard label="Enrollments" value={k.totalEnrollments} sub={`${k.pendingEnrollments} pending`} href="/admin/c/enrollments" accent="text-blue-400" />
        <KpiCard label="Certifications" value={k.totalCertifications} sub={`${k.pendingCertifications} pending`} href="/admin/c/certifications" accent="text-purple-400" />
        <KpiCard label="Courses" value={k.totalCourses} href="/admin/c/courses" accent="text-emerald-400" />
        <KpiCard label="Blog Posts" value={k.totalPosts} href="/admin/c/posts" accent="text-orange-400" />
        <KpiCard label="Homepage Stats" value={k.totalHomeStats} href="/admin/c/stats" accent="text-cyan-400" />
        <KpiCard label="Subscribers" value={k.totalSubscribers} href="/admin/c/subscribers" accent="text-pink-400" />
        <KpiCard label="New Messages" value={k.newMessages} href="/admin/c/contactforms" accent="text-yellow-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Activity — last 30 days</h2>
          <p className="text-gray-500 text-xs mb-4">New enrollments and certification applications per day</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.series} margin={{ left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="gEnroll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(d) => d.slice(5)} interval={4} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f2937', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="enrollments" stroke="#3b82f6" fill="url(#gEnroll)" strokeWidth={2} />
              <Area type="monotone" dataKey="certifications" stroke="#a855f7" fill="url(#gCert)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Enrollment status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.enrollmentStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.enrollmentStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, textTransform: 'capitalize' }} />
              <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f2937', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RecentPanel
          title="Recent Enrollments"
          href="/admin/c/enrollments"
          dot="bg-blue-400"
          items={data.recent.enrollments.map((e) => ({
            id: e._id, title: e.fullName, sub: e.courseName, status: e.status, time: e.createdAt,
            statusOptions: collectionMap.enrollments.statusOptions,
            link: `/admin/c/enrollments/${e._id}`,
          }))}
        />
        <RecentPanel
          title="Recent Certifications"
          href="/admin/c/certifications"
          dot="bg-purple-400"
          items={data.recent.certifications.map((c) => ({
            id: c._id, title: c.applicantName, sub: c.courseName, status: c.status, time: c.submittedAt,
            statusOptions: collectionMap.certifications.statusOptions,
            link: `/admin/c/certifications/${c._id}`,
          }))}
        />
        <RecentPanel
          title="Recent Messages"
          href="/admin/c/contactforms"
          dot="bg-yellow-400"
          items={data.recent.messages.map((m) => ({
            id: m._id, title: m.name || m.email, sub: m.email, status: m.status, time: m.createdAt,
            statusOptions: collectionMap.contactforms.statusOptions,
            link: `/admin/c/contactforms/${m._id}`,
          }))}
        />
      </div>
    </div>
  )
}

function RecentPanel({
  title, href, dot, items,
}: {
  title: string; href: string; dot: string
  items: { id: string; title: string; sub: string; status: string; time: string; statusOptions?: { value: string; label: string; color: string }[]; link: string }[]
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <h2 className="text-white font-semibold text-sm">{title}</h2>
        </div>
        <Link href={href} className="text-xs text-[#C1121F] hover:underline">View all →</Link>
      </div>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-gray-500 text-sm">Nothing yet.</p>}
        {items.map((it) => (
          <Link key={it.id} href={it.link} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-800/70 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{it.title}</p>
              <p className="text-gray-500 text-xs truncate">{it.sub}</p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
              <StatusBadge value={it.status} options={it.statusOptions} />
              <span className="text-gray-600 text-[10px]">{timeAgo(it.time)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
