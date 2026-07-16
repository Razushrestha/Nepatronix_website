'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TaskItem = {
  id: string
  title: string
  description?: string
  status: string
  dueDate?: string
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

export default function HrTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  function load() {
    fetch('/api/hr/tasks', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => { if (d.tasks) setTasks(d.tasks) })
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    setBusy(id)
    await fetch(`/api/hr/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ status }),
    })
    load()
    setBusy(null)
  }

  const open = tasks.filter((t) => t.status !== 'completed').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My tasks</h1>
          <p className="text-sm text-slate-500 mt-1">{open} open · {tasks.length} total</p>
        </div>
        <Link href="/hr" className="text-sm text-[#C1121F] font-medium hover:underline">← Dashboard</Link>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="hr-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{t.title}</p>
                {t.description && <p className="text-sm text-slate-500 mt-1">{t.description}</p>}
                {t.dueDate && <p className="text-xs text-slate-400 mt-2">Due: {t.dueDate}</p>}
              </div>
              <span className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full ${STATUS_STYLES[t.status] || STATUS_STYLES.pending}`}>
                {t.status.replace(/_/g, ' ')}
              </span>
            </div>
            {t.status !== 'completed' && (
              <div className="flex gap-2 mt-4">
                {t.status === 'pending' && (
                  <button
                    type="button"
                    disabled={busy === t.id}
                    onClick={() => updateStatus(t.id, 'in_progress')}
                    className="hr-btn-secondary text-sm py-2 px-4"
                  >
                    Start task
                  </button>
                )}
                {t.status === 'in_progress' && (
                  <button
                    type="button"
                    disabled={busy === t.id}
                    onClick={() => updateStatus(t.id, 'completed')}
                    className="hr-btn text-sm py-2 px-4"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {!tasks.length && (
          <div className="hr-card py-12 text-center text-slate-500 text-sm">
            No tasks assigned yet. Your manager or HR will add tasks here when needed.
          </div>
        )}
      </div>
    </div>
  )
}
