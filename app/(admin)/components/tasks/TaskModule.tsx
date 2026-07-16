'use client'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  canCreateTask,
} from '@/lib/tasks/constants'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'
import type { AssignableEmployee, TaskDTO, TaskListResponse } from './shared-types'
import CreateTaskModal from './CreateTaskModal'
import TaskDrawer from './TaskDrawer'
import {
  Avatar,
  EmptyState,
  InlineSpinner,
  PriorityBadge,
  ProgressBar,
  TaskStatusBadge,
  api,
  fetchJson,
  fmtDate,
} from './ui'

const KANBAN_COLUMNS: { status: string; label: string }[] = [
  { status: 'overdue', label: 'Overdue' },
  { status: 'pending', label: 'Pending' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review', label: 'Review' },
  { status: 'completed', label: 'Completed' },
]

export default function TaskModule({
  role,
  currentUserId,
  department,
  variant = 'admin',
}: {
  role: string
  currentUserId: string
  department?: string
  variant?: 'admin' | 'staff'
}) {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [page, setPage] = useState(1)
  const [openTask, setOpenTask] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [employees, setEmployees] = useState<AssignableEmployee[]>([])
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    department: variant === 'staff' ? '' : '',
    project: '',
    overdue: false,
    completed: false,
    archived: false,
  })

  const canCreate = canCreateTask(role)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (!canCreate) return
    fetchJson('/api/tasks/assignable')
      .then((d) => setEmployees((d.employees as AssignableEmployee[]) || []))
      .catch(() => setEmployees([]))
  }, [canCreate])

  // Read ?task= on first mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('task')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t) setOpenTask(t)
  }, [])

  const query = useMemo(() => {
    const p = new URLSearchParams()
    p.set('page', String(page))
    p.set('limit', view === 'kanban' ? '100' : '25')
    if (debounced) p.set('q', debounced)
    if (filters.status) p.set('status', filters.status)
    if (filters.priority) p.set('priority', filters.priority)
    if (filters.department) p.set('department', filters.department)
    if (filters.project) p.set('project', filters.project)
    if (filters.overdue) p.set('overdue', 'true')
    if (filters.completed) p.set('completed', 'true')
    if (filters.archived) p.set('archived', 'true')
    return p.toString()
  }, [page, view, debounced, filters])

  const { data, isLoading, mutate } = useSWR<TaskListResponse>(`/api/tasks?${query}`, fetchJson, {
    refreshInterval: 20000,
    keepPreviousData: true,
  })
  const { data: dash, mutate: mutateDash } = useSWR<{ stats: Record<string, number> }>(
    '/api/tasks/dashboard',
    fetchJson,
    { refreshInterval: 30000 }
  )

  const tasks = data?.tasks || []
  const stats = dash?.stats || {}

  function refreshAll() {
    mutate()
    mutateDash()
  }

  async function quickStatus(task: TaskDTO, status: string) {
    try {
      await api(`/api/tasks/${task.id}`, 'PATCH', { status })
      refreshAll()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update')
    }
  }

  const statCards =
    variant === 'staff'
      ? [
          { label: 'My tasks', val: stats.total ?? 0, color: 'text-slate-900' },
          { label: 'Due today', val: stats.dueToday ?? 0, color: 'text-amber-600' },
          { label: 'In progress', val: stats.inProgress ?? 0, color: 'text-blue-600' },
          { label: 'Pending checklist', val: stats.pendingChecklist ?? 0, color: 'text-violet-600' },
          { label: 'Completed', val: stats.completed ?? 0, color: 'text-emerald-600' },
          { label: 'My progress', val: `${stats.myProgress ?? 0}%`, color: 'text-[#C1121F]' },
        ]
      : [
          { label: 'Total', val: stats.total ?? 0, color: 'text-slate-900' },
          { label: 'In progress', val: stats.inProgress ?? 0, color: 'text-blue-600' },
          { label: 'Review', val: stats.review ?? 0, color: 'text-violet-600' },
          { label: 'Completed', val: stats.completed ?? 0, color: 'text-emerald-600' },
          { label: 'Overdue', val: stats.overdue ?? 0, color: 'text-red-600' },
          { label: 'Completion', val: `${stats.completionRate ?? 0}%`, color: 'text-[#C1121F]' },
        ]

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{variant === 'staff' ? 'My Tasks' : 'Task Management'}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {variant === 'staff' ? 'Tasks assigned to you' : 'Plan, assign and track work across teams'}
          </p>
        </div>
        {canCreate && (
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-[#C1121F] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-[#a50f1a] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New task
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-black mt-1 tabular-nums ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search tasks…" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#C1121F] focus:outline-none" />
        </div>
        <select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1) }} className="text-sm border border-slate-300 rounded-lg px-2 py-2">
          <option value="">All status</option>
          {TASK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => { setFilters({ ...filters, priority: e.target.value }); setPage(1) }} className="text-sm border border-slate-300 rounded-lg px-2 py-2">
          <option value="">All priority</option>
          {TASK_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        {variant === 'admin' && (
          <select value={filters.department} onChange={(e) => { setFilters({ ...filters, department: e.target.value }); setPage(1) }} className="text-sm border border-slate-300 rounded-lg px-2 py-2">
            <option value="">All depts</option>
            {HR_DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        )}
        <label className="flex items-center gap-1.5 text-sm text-slate-600 px-2">
          <input type="checkbox" checked={filters.overdue} onChange={(e) => { setFilters({ ...filters, overdue: e.target.checked }); setPage(1) }} className="accent-[#C1121F]" />
          Overdue
        </label>
        <label className="flex items-center gap-1.5 text-sm text-slate-600 px-2">
          <input type="checkbox" checked={filters.archived} onChange={(e) => { setFilters({ ...filters, archived: e.target.checked }); setPage(1) }} className="accent-[#C1121F]" />
          Archived
        </label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden ml-auto">
          <button onClick={() => setView('kanban')} className={`px-3 py-2 text-sm font-medium ${view === 'kanban' ? 'bg-[#C1121F] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Board</button>
          <button onClick={() => setView('table')} className={`px-3 py-2 text-sm font-medium ${view === 'table' ? 'bg-[#C1121F] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Table</button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex justify-center py-16"><InlineSpinner className="w-8 h-8" /></div>
      ) : tasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl">
          <EmptyState title="No tasks found" hint={canCreate ? 'Create your first task to get started.' : 'Nothing assigned to you yet.'} />
        </div>
      ) : view === 'kanban' ? (
        <KanbanView tasks={tasks} onOpen={setOpenTask} />
      ) : (
        <TableView tasks={tasks} onOpen={setOpenTask} onStatus={quickStatus} canCreate={canCreate} />
      )}

      {/* Pagination (table view) */}
      {view === 'table' && data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 disabled:opacity-40">Prev</button>
          <span className="text-sm text-slate-500">Page {data.page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 disabled:opacity-40">Next</button>
        </div>
      )}

      {showCreate && (
        <CreateTaskModal
          employees={employees}
          defaultDepartment={department}
          onClose={() => setShowCreate(false)}
          onCreated={(id) => { setShowCreate(false); refreshAll(); setOpenTask(id) }}
        />
      )}
      {openTask && (
        <TaskDrawer
          taskId={openTask}
          role={role}
          currentUserId={currentUserId}
          employees={employees}
          onClose={() => setOpenTask(null)}
          onChanged={refreshAll}
        />
      )}
    </div>
  )
}

function KanbanView({ tasks, onOpen }: { tasks: TaskDTO[]; onOpen: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
      {KANBAN_COLUMNS.map((col) => {
        const items = tasks.filter((t) => t.effectiveStatus === col.status)
        return (
          <div key={col.status} className="bg-slate-100/70 rounded-2xl p-2 min-h-[120px]">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{col.label}</p>
              <span className="text-[11px] font-bold text-slate-400">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((t) => (
                <button key={t.id} onClick={() => onOpen(t.id)} className="w-full text-left bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md hover:border-[#C1121F]/30 transition-all">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <PriorityBadge value={t.priority} />
                    {t.overdue && col.status !== 'overdue' && <span className="text-[10px] text-red-600 font-bold">Overdue</span>}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-2">{t.title}</p>
                  {t.project && <p className="text-[11px] text-slate-400 mt-0.5">{t.project}</p>}
                  <div className="mt-2"><ProgressBar percent={t.completionPercent} showLabel={false} /></div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex -space-x-1.5">
                      {(t.assignees || []).slice(0, 3).map((a) => <Avatar key={a.id} name={a.assigneeName} size={20} />)}
                      {(t.assignees?.length || 0) > 3 && <span className="w-5 h-5 rounded-full bg-slate-200 text-[9px] flex items-center justify-center text-slate-500">+{(t.assignees!.length - 3)}</span>}
                    </div>
                    {t.dueDate && <span className={`text-[10px] ${t.overdue ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{fmtDate(t.dueDate)}</span>}
                  </div>
                  {typeof t.checklistTotal === 'number' && t.checklistTotal > 0 && (
                    <p className="text-[10px] text-slate-400 mt-1">☑ {t.checklistDone}/{t.checklistTotal}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TableView({
  tasks,
  onOpen,
  onStatus,
  canCreate,
}: {
  tasks: TaskDTO[]
  onOpen: (id: string) => void
  onStatus: (t: TaskDTO, s: string) => void
  canCreate: boolean
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200">
              <th className="px-4 py-3 font-semibold">Task</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold w-40">Progress</th>
              <th className="px-4 py-3 font-semibold">Assignees</th>
              <th className="px-4 py-3 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => onOpen(t.id)}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{t.title}</p>
                  <p className="text-[11px] text-slate-400">{t.project || t.department || '—'}</p>
                </td>
                <td className="px-4 py-3"><PriorityBadge value={t.priority} /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  {canCreate ? (
                    <select value={t.status} onChange={(e) => onStatus(t, e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1">
                      {TASK_STATUSES.filter((s) => s.value !== 'overdue').map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  ) : (
                    <TaskStatusBadge value={t.effectiveStatus} />
                  )}
                </td>
                <td className="px-4 py-3"><ProgressBar percent={t.completionPercent} /></td>
                <td className="px-4 py-3">
                  <div className="flex -space-x-1.5">
                    {(t.assignees || []).slice(0, 4).map((a) => <Avatar key={a.id} name={a.assigneeName} size={22} />)}
                    {!(t.assignees?.length) && <span className="text-xs text-slate-400">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${t.overdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>{fmtDate(t.dueDate)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
