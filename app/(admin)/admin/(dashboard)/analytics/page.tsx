'use client'
import useSWR from 'swr'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { fetcher, Spinner } from '@/app/(admin)/components/ui'

const PIE_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ef4444']

interface Analytics {
  kpis: Record<string, number>
  series: { date: string; visits: number; visitors: number }[]
  months: { month: string; visits: number; visitors: number }[]
  topPages: { path: string; count: number }[]
  devices: { device: string; count: number }[]
  topReferrers: { referrer: string; count: number }[]
}

function Kpi({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{(value ?? 0).toLocaleString()}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const { data, isLoading } = useSWR<Analytics>('/api/admin/analytics', fetcher, { refreshInterval: 30000 })
  if (isLoading || !data) return <Spinner />
  const k = data.kpis

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Statistics &amp; Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Visitor traffic, engagement and enquiries</p>
      </div>

      {/* Visitor KPIs */}
      <div>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Visitors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Today" value={k.visitsToday} sub={`${k.uniqueToday} unique`} accent="text-blue-400" />
          <Kpi label="This Week" value={k.visitsWeek} sub={`${k.uniqueWeek} unique`} accent="text-emerald-400" />
          <Kpi label="This Month" value={k.visitsMonth} sub={`${k.uniqueMonth} unique`} accent="text-purple-400" />
          <Kpi label="Total Visits" value={k.totalVisits} sub={`${k.uniqueTotal} unique visitors`} accent="text-pink-400" />
        </div>
      </div>

      {/* Engagement KPIs */}
      <div>
        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Engagement</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Kpi label="Total Enquiries" value={k.totalEnquiries} sub={`${k.newEnquiries} new`} accent="text-yellow-400" />
          <Kpi label="Enrollments" value={k.totalEnrollments} sub={`${k.weekEnrollments} this week`} accent="text-blue-400" />
          <Kpi label="Certifications" value={k.totalCertifications} accent="text-purple-400" />
          <Kpi label="Subscribers" value={k.totalSubscribers} accent="text-pink-400" />
          <Kpi label="Courses" value={k.totalCourses} accent="text-emerald-400" />
          <Kpi label="Blog Posts" value={k.totalPosts} accent="text-orange-400" />
        </div>
      </div>

      {/* Daily traffic */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1">Traffic — last 30 days</h2>
        <p className="text-gray-500 text-xs mb-4">Page views and unique visitors per day</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.series} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="aVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(d) => d.slice(5)} interval={4} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f2937', borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="visits" name="Page views" stroke="#3b82f6" fill="url(#aVisits)" strokeWidth={2} />
            <Area type="monotone" dataKey="visitors" name="Unique visitors" stroke="#22c55e" fill="url(#aVisitors)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Monthly — last 12 months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.months} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f2937', borderRadius: 12, fontSize: 12 }} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="visits" name="Page views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="visitors" name="Unique" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Devices */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Devices</h2>
          {data.devices.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.devices} dataKey="count" nameKey="device" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {data.devices.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, textTransform: 'capitalize' }} />
                <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid #1f2937', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Top Pages</h2>
          <div className="space-y-2">
            {data.topPages.length === 0 && <p className="text-gray-500 text-sm">No data yet.</p>}
            {data.topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                <span className="text-gray-300 text-sm truncate">{p.path}</span>
                <span className="text-white text-sm font-semibold ml-3">{p.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top referrers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Top Referrers</h2>
          <div className="space-y-2">
            {data.topReferrers.length === 0 && <p className="text-gray-500 text-sm">No external referrers yet.</p>}
            {data.topReferrers.map((r) => (
              <div key={r.referrer} className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                <span className="text-gray-300 text-sm truncate">{r.referrer}</span>
                <span className="text-white text-sm font-semibold ml-3">{r.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
