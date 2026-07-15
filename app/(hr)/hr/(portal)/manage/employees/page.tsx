'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

type Emp = {
  id: string
  employeeCode: string
  fullName: string
  email: string
  department: string
  position: string
  employmentType: string
  role: string
  monthlyPay?: number
}

export default function HrManageEmployeesPage() {
  const [employees, setEmployees] = useState<Emp[]>([])
  const [department, setDepartment] = useState('')

  function load() {
    const q = department ? `?department=${department}` : ''
    fetch(`/api/hr/employees${q}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => setEmployees(d.employees || []))
  }

  useEffect(() => { load() }, [department])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <Link href="/hr/manage/employees/new" className="hr-btn">+ New employee</Link>
      </div>
      <select className="hr-input max-w-xs" value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">All departments</option>
        {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
      <div className="hr-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="pb-2 pr-3">Code</th>
              <th className="pb-2 pr-3">Name</th>
              <th className="pb-2 pr-3">Department</th>
              <th className="pb-2 pr-3">Type</th>
              <th className="pb-2 pr-3">Role</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-slate-100">
                <td className="py-2 pr-3 font-mono text-xs">{e.employeeCode}</td>
                <td className="py-2 pr-3">{e.fullName}</td>
                <td className="py-2 pr-3 capitalize">{e.department.replace(/-/g, ' ')}</td>
                <td className="py-2 pr-3 capitalize">{e.employmentType.replace(/_/g, ' ')}</td>
                <td className="py-2 pr-3 capitalize">{e.role.replace(/_/g, ' ')}</td>
                <td className="py-2"><Link href={`/hr/manage/employees/${e.id}`} className="text-[#C1121F] text-xs hover:underline">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
