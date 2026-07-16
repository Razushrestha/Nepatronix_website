'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'
import { useHrPaths } from '@/lib/hr/ui-context'

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
  isStipend?: boolean
  totalWorkingDays?: number
  totalWorkingHours?: number
  hoursPerDay?: number
}

export default function HrManageEmployeesPage() {
  const paths = useHrPaths()
  const [employees, setEmployees] = useState<Emp[]>([])
  const [department, setDepartment] = useState('')
  const [search, setSearch] = useState('')
  const [monthLabel, setMonthLabel] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function load() {
    const params = new URLSearchParams()
    if (department) params.set('department', department)
    if (search.trim()) params.set('q', search.trim())
    const qs = params.toString() ? `?${params}` : ''
    fetch(`/api/hr/employees${qs}`, { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        setEmployees(d.employees || [])
        setMonthLabel(d.month || '')
      })
  }

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [department, search])

  async function removeEmployee(emp: Emp) {
    if (!confirm(`Remove ${emp.fullName}? They will be deactivated and hidden from the active list.`)) return
    setDeletingId(emp.id)
    const res = await fetch(`/api/hr/employees/${emp.id}`, { method: 'DELETE', credentials: 'same-origin' })
    if (res.ok) load()
    setDeletingId(null)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          {monthLabel && (
            <p className="text-slate-500 text-sm mt-1">
              Working days &amp; hours calculated for {monthLabel}
            </p>
          )}
        </div>
        <Link href={paths.employeesNew} className="hr-btn">+ New employee</Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="hr-input max-w-sm flex-1 min-w-[200px]"
          placeholder="Search name, email, or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="hr-input max-w-xs" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      <div className="hr-card overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="pb-3 pr-3 font-semibold">Code</th>
              <th className="pb-3 pr-3 font-semibold">Name</th>
              <th className="pb-3 pr-3 font-semibold">Department</th>
              <th className="pb-3 pr-3 font-semibold">Type</th>
              <th className="pb-3 pr-3 font-semibold">Role</th>
              <th className="pb-3 pr-3 font-semibold text-right">Salary</th>
              <th className="pb-3 pr-3 font-semibold text-right">Work days</th>
              <th className="pb-3 pr-3 font-semibold text-right">Work hours</th>
              <th className="pb-3 pr-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">No employees found.</td>
              </tr>
            )}
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="py-3 pr-3 font-mono text-xs text-slate-600">{e.employeeCode}</td>
                <td className="py-3 pr-3">
                  <Link href={paths.employeeView(e.id)} className="font-medium text-slate-900 hover:text-[#C1121F]">
                    {e.fullName}
                  </Link>
                  <p className="text-xs text-slate-400">{e.position}</p>
                </td>
                <td className="py-3 pr-3 capitalize">{e.department.replace(/-/g, ' ')}</td>
                <td className="py-3 pr-3 capitalize">{e.employmentType.replace(/_/g, ' ')}</td>
                <td className="py-3 pr-3 capitalize">{e.role.replace(/_/g, ' ')}</td>
                <td className="py-3 pr-3 text-right font-medium whitespace-nowrap">
                  {e.monthlyPay && e.monthlyPay > 0 ? (
                    <>
                      <span className="text-[#C1121F]">NPR {e.monthlyPay.toLocaleString('en-NP')}</span>
                      {e.isStipend && <span className="block text-[10px] text-slate-400 font-normal">stipend</span>}
                    </>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3 pr-3 text-right tabular-nums">
                  <span className="font-semibold text-slate-900">{e.totalWorkingDays ?? '—'}</span>
                  <span className="block text-[10px] text-slate-400">this month</span>
                </td>
                <td className="py-3 pr-3 text-right tabular-nums">
                  <span className="font-semibold text-slate-900">{e.totalWorkingHours ?? '—'}</span>
                  <span className="block text-[10px] text-slate-400">
                    {e.hoursPerDay ? `${e.hoursPerDay}h/day` : 'hrs/month'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={paths.employeeView(e.id)}
                      className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View"
                    >
                      View
                    </Link>
                    <Link
                      href={paths.employeeEdit(e.id)}
                      className="px-2 py-1 text-xs font-semibold text-[#C1121F] hover:bg-[#C1121F]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeEmployee(e)}
                      disabled={deletingId === e.id}
                      className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === e.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
