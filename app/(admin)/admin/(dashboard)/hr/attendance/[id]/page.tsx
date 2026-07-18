'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useHrPaths } from '@/lib/hr/ui-context'

export default function AdminHrEmployeeAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const paths = useHrPaths()
  const [data, setData] = useState<{
    employee?: { fullName: string; employeeCode: string }
    records: { date: string; status: string; checkIn?: string; lateMinutes?: number; lateDeduction?: number }[]
    summary: { present: number; lateMinutes: number; lateDeduction: number; absent: number }
  } | null>(null)

  useEffect(() => {
    fetch(`/api/hr/attendance?employeeId=${id}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then(setData)
  }, [id])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <Link href={paths.attendance} className="text-sm text-[#C1121F] hover:underline">← All employees</Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          {data?.employee?.fullName || 'Attendance'}
        </h1>
        {data?.employee?.employeeCode && (
          <p className="text-sm text-slate-500 font-mono">{data.employee.employeeCode}</p>
        )}
      </div>
      {data?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Present', data.summary.present],
            ['Absent', data.summary.absent],
            ['Late minutes', data.summary.lateMinutes],
            ['Deductions (NPR)', data.summary.lateDeduction],
          ].map(([label, val]) => (
            <div key={String(label)} className="hr-card py-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-900">{val}</p>
            </div>
          ))}
        </div>
      )}
      <div className="hr-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Check in</th>
              <th className="pb-2 pr-4">Late</th>
              <th className="pb-2">Deduction</th>
            </tr>
          </thead>
          <tbody>
            {(data?.records || []).map((r) => (
              <tr key={r.date} className="border-b border-slate-100">
                <td className="py-2 pr-4">{r.date}</td>
                <td className="py-2 pr-4 capitalize">{r.status}</td>
                <td className="py-2 pr-4">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' }) : '—'}</td>
                <td className="py-2 pr-4">{r.lateMinutes || 0} min</td>
                <td className="py-2">NPR {r.lateDeduction || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.records?.length && <p className="text-slate-500 text-sm py-4">No records this month yet.</p>}
      </div>
    </div>
  )
}
