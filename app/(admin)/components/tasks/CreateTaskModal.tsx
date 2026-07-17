'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_VISIBILITIES,
} from '@/lib/tasks/constants'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'
import type { AssignableEmployee } from './shared-types'
import { api } from './ui'

const RichTextEditor = dynamic(() => import('@/app/(admin)/components/RichTextEditor'), { ssr: false })

export default function CreateTaskModal({
  employees,
  employeesError,
  onReloadEmployees,
  defaultDepartment,
  onClose,
  onCreated,
}: {
  employees: AssignableEmployee[]
  employeesError?: string
  onReloadEmployees?: () => void
  defaultDepartment?: string
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    department: defaultDepartment || 'nepatronix',
    project: '',
    visibility: 'team',
    startDate: '',
    dueDate: '',
    estimatedHours: '',
  })
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }
  function toggleAssignee(id: string) {
    setAssigneeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function submit() {
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await api('/api/tasks', 'POST', {
        ...form,
        estimatedHours: Number(form.estimatedHours) || 0,
        category: form.category || undefined,
        assigneeIds,
      })
      const task = res.task as { id: string }
      onCreated(task.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create task')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900">New task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-slate-500">Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#C1121F] focus:outline-none" placeholder="e.g. Develop CRM Dashboard" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <div className="mt-1">
              <RichTextEditor value={form.description} onChange={(html) => set('description', html)} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Priority">
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className="modal-select">
                {TASK_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Visibility">
              <select value={form.visibility} onChange={(e) => set('visibility', e.target.value)} className="modal-select">
                {TASK_VISIBILITIES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="modal-select">
                <option value="">—</option>
                {TASK_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </Field>
            <Field label="Department">
              <select value={form.department} onChange={(e) => set('department', e.target.value)} className="modal-select">
                {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Project">
              <input value={form.project} onChange={(e) => set('project', e.target.value)} className="modal-select" placeholder="Project name" />
            </Field>
            <Field label="Est. hours">
              <input type="number" value={form.estimatedHours} onChange={(e) => set('estimatedHours', e.target.value)} className="modal-select" placeholder="0" />
            </Field>
            <Field label="Start date">
              <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className="modal-select" />
            </Field>
            <Field label="Due date">
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className="modal-select" />
            </Field>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Assign to</label>
            <div className="mt-1 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
              {employeesError ? (
                <div className="px-1 py-2 space-y-1">
                  <p className="text-xs text-red-600">Couldn&apos;t load employees: {employeesError}</p>
                  {onReloadEmployees && (
                    <button type="button" onClick={onReloadEmployees} className="text-xs font-semibold text-[#C1121F] hover:underline">
                      Retry
                    </button>
                  )}
                </div>
              ) : (
                employees.length === 0 && <p className="text-xs text-slate-400 px-1 py-2">No assignable employees found.</p>
              )}
              {employees.map((e) => (
                <label key={e.id} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" checked={assigneeIds.includes(e.id)} onChange={() => toggleAssignee(e.id)} className="accent-[#C1121F]" />
                  <span className="text-sm text-slate-700">{e.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-auto ${e.type === 'freelancer' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{e.type}</span>
                </label>
              ))}
            </div>
            {assigneeIds.length > 0 && <p className="text-[11px] text-slate-400 mt-1">{assigneeIds.length} selected</p>}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="text-sm font-semibold px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={submit} disabled={busy} className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#C1121F] text-white hover:bg-[#a50f1a] disabled:opacity-50">
            {busy ? 'Creating…' : 'Create task'}
          </button>
        </div>
      </div>
      <style>{`.modal-select{margin-top:.25rem;width:100%;border:1px solid #cbd5e1;border-radius:.5rem;padding:.5rem;font-size:.875rem}.modal-select:focus{outline:none;border-color:#C1121F}`}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  )
}
