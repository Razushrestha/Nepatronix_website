'use client'

import { useEffect, useState } from 'react'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

export default function HrManageAttendancePage() {
  const [employees, setEmployees] = useState<{ id: string; fullName: string; employeeCode: string }[]>([])

  useEffect(() => {
    fetch('/api/hr/employees', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setEmployees(d.employees || []))
  }, [])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Attendance overview</h1>
      <p className="text-sm text-slate-500">Select an employee to view monthly attendance (HR view).</p>
      <div className="hr-card divide-y divide-slate-100">
        {employees.map((e) => (
          <a
            key={e.id}
            href={`/hr/attendance?employeeId=${e.id}`}
            className="block py-3 text-sm hover:text-[#C1121F]"
          >
            {e.fullName} <span className="text-slate-400 font-mono text-xs">({e.employeeCode})</span>
          </a>
        ))}
      </div>
      <p className="text-xs text-slate-400">Departments: {HR_DEPARTMENTS.map((d) => d.label).join(', ')}</p>
    </div>
  )
}
