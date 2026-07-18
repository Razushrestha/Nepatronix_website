'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  ASSIGNABLE_STATUSES,
  isTaskAdmin,
} from '@/lib/tasks/constants'
import type {
  AssignableEmployee,
  AttachmentDTO,
  ChecklistDTO,
  CommentDTO,
  DailyPlanDTO,
  HistoryDTO,
  TaskDetailResponse,
  TaskDTO,
} from './shared-types'
import { parseDescriptionToChecklistItems } from '@/lib/tasks/parse-description-checklist'
import { taskUpload } from '@/lib/tasks/upload'
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
  fmtDateTime,
  relTime,
} from './ui'

type Tab = 'overview' | 'plan' | 'comments' | 'files' | 'timeline'

export default function TaskDrawer({
  taskId,
  role,
  currentUserId,
  employees,
  onClose,
  onChanged,
}: {
  taskId: string
  role: string
  currentUserId: string
  employees: AssignableEmployee[]
  onClose: () => void
  onChanged: () => void
}) {
  const [data, setData] = useState<TaskDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')

  const load = useCallback(async () => {
    try {
      const json = await fetchJson(`/api/tasks/${taskId}`)
      setData(json as TaskDetailResponse)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const task = data?.task
  const isAdmin = isTaskAdmin(role)
  const isCreator = Boolean(task && task.createdBy?.id === currentUserId)
  const canManage = isAdmin || isCreator
  const isAssignee = Boolean(data?.assignments.some((a) => a.assigneeId === currentUserId))

  async function refresh() {
    await load()
    onChanged()
  }

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'plan', label: 'Plan & Checklist', count: data?.checklists.length },
    { id: 'comments', label: 'Discussion', count: data?.comments.filter((c) => !c.deleted).length },
    { id: 'files', label: 'Attachments', count: data?.attachments.length },
    { id: 'timeline', label: 'Timeline', count: data?.history.length },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-50 h-full shadow-2xl flex flex-col animate-[slideIn_.2s_ease]">
        <style>{`@keyframes slideIn{from{transform:translateX(30px);opacity:.6}to{transform:translateX(0);opacity:1}}`}</style>

        {loading && !task ? (
          <div className="flex-1 flex items-center justify-center"><InlineSpinner className="w-8 h-8" /></div>
        ) : error && !task ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={onClose} className="text-sm text-slate-500 underline">Close</button>
          </div>
        ) : task ? (
          <>
            <DrawerHeader
              task={task}
              canManage={canManage}
              isAdmin={isAdmin}
              onClose={onClose}
              onAction={async (action) => {
                await api(`/api/tasks/${task.id}`, 'PATCH', { action })
                await refresh()
              }}
              onDelete={async () => {
                if (!confirm('Delete this task permanently? This cannot be undone.')) return
                await api(`/api/tasks/${task.id}?hard=true`, 'DELETE')
                onChanged()
                onClose()
              }}
            />

            <div className="flex gap-1 px-4 border-b border-slate-200 bg-white overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === t.id ? 'text-[#C1121F]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                  {typeof t.count === 'number' && t.count > 0 && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{t.count}</span>
                  )}
                  {tab === t.id && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C1121F] rounded-full" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tab === 'overview' && (
                <OverviewTab
                  data={data!}
                  canManage={canManage}
                  isAssignee={isAssignee}
                  currentUserId={currentUserId}
                  employees={employees}
                  onChanged={refresh}
                  onGoToPlan={() => setTab('plan')}
                />
              )}
              {tab === 'plan' && (
                <PlanTab data={data!} canManage={canManage} isAssignee={isAssignee} employees={employees} onChanged={refresh} />
              )}
              {tab === 'comments' && (
                <CommentsTab data={data!} currentUserId={currentUserId} isAdmin={isAdmin} employees={employees} onChanged={refresh} />
              )}
              {tab === 'files' && (
                <FilesTab data={data!} currentUserId={currentUserId} canManage={canManage} onChanged={refresh} />
              )}
              {tab === 'timeline' && <TimelineTab history={data!.history} />}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function DrawerHeader({
  task,
  canManage,
  isAdmin,
  onClose,
  onAction,
  onDelete,
}: {
  task: TaskDTO
  canManage: boolean
  isAdmin: boolean
  onClose: () => void
  onAction: (action: string) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [busy, setBusy] = useState('')
  async function run(action: string, fn: () => Promise<void>) {
    setBusy(action)
    try {
      await fn()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setBusy('')
    }
  }
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge value={task.priority} />
            <TaskStatusBadge value={task.effectiveStatus} />
            {task.archived && <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Archived</span>}
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-2 break-words">{task.title}</h2>
          <p className="text-xs text-slate-400 mt-1">
            #{task.id.slice(-6)} · created by {task.createdBy?.name} · {relTime(task.createdAt)}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="mt-3"><ProgressBar percent={task.completionPercent} /></div>
      {isAdmin && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button disabled={!!busy} onClick={() => run('approve', () => onAction('approve'))} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy === 'approve' ? '…' : 'Approve'}
          </button>
          {task.archived ? (
            <button disabled={!!busy} onClick={() => run('restore', () => onAction('restore'))} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50">Restore</button>
          ) : (
            <button disabled={!!busy} onClick={() => run('archive', () => onAction('archive'))} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50">Archive</button>
          )}
          <button disabled={!!busy} onClick={() => run('delete', onDelete)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">Delete</button>
        </div>
      )}
      {!canManage && (
        <p className="text-[11px] text-slate-400 mt-2">
          Update your progress below — tick checklist items or set completion % on the Overview tab.
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function OverviewTab({
  data,
  canManage,
  isAssignee,
  currentUserId,
  employees,
  onChanged,
  onGoToPlan,
}: {
  data: TaskDetailResponse
  canManage: boolean
  isAssignee: boolean
  currentUserId: string
  employees: AssignableEmployee[]
  onChanged: () => Promise<void>
  onGoToPlan: () => void
}) {
  const task = data.task
  const myAssignment = data.assignments.find((a) => a.assigneeId === currentUserId)
  const [addingAssignee, setAddingAssignee] = useState('')
  const [importingChecklist, setImportingChecklist] = useState(false)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const assignedIds = new Set(data.assignments.map((a) => a.assigneeId))
  const available = employees.filter((e) => !assignedIds.has(e.id))
  const parsedFromDescription = task.description ? parseDescriptionToChecklistItems(task.description) : []
  const existingTitles = new Set(data.checklists.map((c) => c.title.toLowerCase().trim()))
  const importableCount = parsedFromDescription.filter((t) => !existingTitles.has(t.toLowerCase())).length

  async function addAssignee() {
    if (!addingAssignee) return
    await api(`/api/tasks/${task.id}/assignments`, 'POST', { assigneeIds: [addingAssignee] })
    setAddingAssignee('')
    await onChanged()
  }
  async function removeAssignee(assignmentId: string) {
    await api(`/api/tasks/${task.id}/assignments/${assignmentId}`, 'DELETE')
    await onChanged()
  }

  async function importDescriptionToChecklist() {
    setImportingChecklist(true)
    setImportMsg(null)
    try {
      const res = await api(`/api/tasks/${task.id}/checklists/import-description`, 'POST')
      const created = Array.isArray(res.created) ? res.created.length : 0
      const skipped = typeof res.skipped === 'number' ? res.skipped : 0
      if (created > 0) {
        setImportMsg(String(res.message || `Added ${created} checklist item(s).`))
        await onChanged()
        onGoToPlan()
      } else if (skipped > 0) {
        setImportMsg('All items from the description are already in the checklist.')
      } else {
        setImportMsg('No list items found in the description.')
      }
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setImportingChecklist(false)
    }
  }

  return (
    <div className="space-y-4">
      {isAssignee && !canManage && (
        <AssigneeProgressPanel
          task={task}
          assignment={myAssignment}
          checklistTotal={data.checklists.length}
          checklistDone={data.checklists.filter((c) => c.completed).length}
          onChanged={onChanged}
          onGoToPlan={onGoToPlan}
        />
      )}

      {task.description ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Description</p>
            {canManage && parsedFromDescription.length > 0 && (
              <button
                type="button"
                onClick={importDescriptionToChecklist}
                disabled={importingChecklist || importableCount === 0}
                className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                title={
                  importableCount === 0
                    ? 'All description items are already in the checklist'
                    : `Create ${importableCount} checklist item(s) from numbered lines or bullets in the description`
                }
              >
                {importingChecklist ? 'Importing…' : importableCount === 0 ? 'Already in checklist' : `Convert to checklist (${importableCount})`}
              </button>
            )}
          </div>
          {importMsg && <p className="text-xs text-slate-500 mb-2">{importMsg}</p>}
          <div className="admin-prose text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: task.description }} />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Meta label="Project" value={task.project || '—'} />
        <Meta label="Category" value={task.category || '—'} />
        <Meta label="Department" value={task.department || '—'} />
        <Meta label="Visibility" value={task.visibility} />
        <Meta label="Start date" value={fmtDate(task.startDate)} />
        <Meta label="Due date" value={fmtDate(task.dueDate)} highlight={task.overdue} />
        <Meta label="Estimated" value={`${task.estimatedHours}h`} />
        <Meta label="Actual" value={`${task.actualHours}h`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Assignees · {data.assignments.length}</p>
        </div>
        <div className="space-y-2">
          {data.assignments.length === 0 && <p className="text-sm text-slate-400">No one assigned yet.</p>}
          {data.assignments.map((a) => (
            <div key={a.id} className="flex items-center gap-3">
              <Avatar name={a.assigneeName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-800 truncate">{a.assigneeName}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.assigneeType === 'freelancer' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{a.assigneeType}</span>
                  <TaskStatusBadge value={a.status} />
                </div>
                <div className="mt-1"><ProgressBar percent={a.completionPercent} /></div>
              </div>
              {canManage && (
                <button onClick={() => removeAssignee(a.id)} className="text-slate-300 hover:text-red-500 p-1" title="Remove">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {canManage && available.length > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <select value={addingAssignee} onChange={(e) => setAddingAssignee(e.target.value)} className="flex-1 text-sm border border-slate-300 rounded-lg px-2 py-1.5">
              <option value="">Add assignee…</option>
              {available.map((e) => (
                <option key={e.id} value={e.id}>{e.name} · {e.type}</option>
              ))}
            </select>
            <button onClick={addAssignee} disabled={!addingAssignee} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#C1121F] text-white disabled:opacity-40">Assign</button>
          </div>
        )}
      </div>

      {canManage && <QuickEdit task={task} onChanged={onChanged} />}
    </div>
  )
}

function Meta({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm font-medium capitalize mt-0.5 ${highlight ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

function AssigneeProgressPanel({
  task,
  assignment,
  checklistTotal,
  checklistDone,
  onChanged,
  onGoToPlan,
}: {
  task: TaskDTO
  assignment?: { id: string; status: string; completionPercent: number }
  checklistTotal: number
  checklistDone: number
  onChanged: () => Promise<void>
  onGoToPlan: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(task.status)
  const [percent, setPercent] = useState(
    checklistTotal > 0 ? task.completionPercent : (assignment?.completionPercent ?? task.completionPercent)
  )
  const usesChecklist = checklistTotal > 0

  async function saveStatus(next: string) {
    setStatus(next as typeof status)
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}`, 'PATCH', { status: next })
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update status')
      setStatus(task.status)
    } finally {
      setBusy(false)
    }
  }

  async function savePercent(next: number) {
    setPercent(next)
    if (usesChecklist) return
    if (!assignment) {
      alert('You must be assigned to this task to update progress.')
      return
    }
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}/assignments/${assignment.id}`, 'PATCH', {
        completionPercent: next,
      })
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update progress')
      setPercent(assignment.completionPercent)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-[#C1121F]/20 p-4 space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#C1121F]">My progress</p>
        <p className="text-xs text-slate-500 mt-1">
          {usesChecklist
            ? `Overall completion is ${task.completionPercent}% — average of all checklist item progress (partial % counts too).`
            : 'Set your completion % below, or add checklist items for automatic tracking.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-slate-500">
          Task status
          <select
            value={status}
            disabled={busy}
            onChange={(e) => saveStatus(e.target.value)}
            className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5"
          >
            {ASSIGNABLE_STATUSES.map((s) => {
              const label = TASK_STATUSES.find((x) => x.value === s)?.label || s
              return (
                <option key={s} value={s}>
                  {label}
                </option>
              )
            })}
          </select>
        </label>

        <div>
          <label className="text-xs text-slate-500">
            Completion {usesChecklist ? '(from checklist)' : ''}
          </label>
          {usesChecklist ? (
            <div className="mt-2">
              <ProgressBar percent={task.completionPercent} />
              <button
                type="button"
                onClick={onGoToPlan}
                className="mt-2 text-xs font-semibold text-[#C1121F] hover:underline"
              >
                Open Plan & Checklist →
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={percent}
                disabled={busy || !assignment}
                onChange={(e) => setPercent(Number(e.target.value))}
                onMouseUp={(e) => savePercent(Number(e.currentTarget.value))}
                onTouchEnd={(e) => savePercent(Number(e.currentTarget.value))}
                className="w-full accent-[#C1121F]"
              />
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{percent}% complete</span>
                <button
                  type="button"
                  disabled={busy || !assignment}
                  onClick={() => savePercent(percent)}
                  className="font-semibold text-[#C1121F] hover:underline disabled:opacity-40"
                >
                  Save
                </button>
              </div>
              <button
                type="button"
                onClick={onGoToPlan}
                className="text-xs text-slate-500 hover:text-[#C1121F] hover:underline"
              >
                Or add checklist items for step-by-step tracking →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickEdit({ task, onChanged }: { task: TaskDTO; onChanged: () => Promise<void> }) {
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate || '',
    project: task.project || '',
    estimatedHours: String(task.estimatedHours),
    actualHours: String(task.actualHours),
  })
  async function save() {
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}`, 'PATCH', {
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
        project: form.project,
        estimatedHours: Number(form.estimatedHours) || 0,
        actualHours: Number(form.actualHours) || 0,
      })
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Quick edit</p>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-500">Priority
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as typeof form.priority })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5">
            {TASK_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-500">Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5">
            {TASK_STATUSES.filter((s) => s.value !== 'overdue').map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-500">Due date
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5" />
        </label>
        <label className="text-xs text-slate-500">Project
          <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5" />
        </label>
        <label className="text-xs text-slate-500">Est. hours
          <input type="number" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5" />
        </label>
        <label className="text-xs text-slate-500">Actual hours
          <input type="number" value={form.actualHours} onChange={(e) => setForm({ ...form, actualHours: e.target.value })} className="mt-1 w-full text-sm border border-slate-300 rounded-lg px-2 py-1.5" />
        </label>
      </div>
      <button onClick={save} disabled={busy} className="w-full text-sm font-semibold py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50">
        {busy ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function PlanTab({
  data,
  canManage,
  isAssignee,
  employees,
  onChanged,
}: {
  data: TaskDetailResponse
  canManage: boolean
  isAssignee: boolean
  employees: AssignableEmployee[]
  onChanged: () => Promise<void>
}) {
  const task = data.task
  const [newDay, setNewDay] = useState({ title: '', description: '', dueDate: '' })
  const [newItem, setNewItem] = useState<{ dayId: string; title: string }>({ dayId: '', title: '' })
  const [busy, setBusy] = useState(false)

  const unplanned = data.checklists.filter((c) => !c.dailyPlanId)

  async function addDay() {
    if (!newDay.title.trim()) return
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}/daily-plans`, 'POST', newDay)
      setNewDay({ title: '', description: '', dueDate: '' })
      await onChanged()
    } finally {
      setBusy(false)
    }
  }
  async function addItem(dayId?: string) {
    const title = dayId ? newItem.title : newItem.title
    if (!title.trim()) return
    await api(`/api/tasks/${task.id}/checklists`, 'POST', { title, dailyPlanId: dayId })
    setNewItem({ dayId: '', title: '' })
    await onChanged()
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Add day plan</p>
          <input value={newDay.title} onChange={(e) => setNewDay({ ...newDay, title: e.target.value })} placeholder="e.g. Day 1 — Setup project" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2" />
          <div className="flex gap-2">
            <input value={newDay.description} onChange={(e) => setNewDay({ ...newDay, description: e.target.value })} placeholder="Notes (optional)" className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2" />
            <input type="date" value={newDay.dueDate} onChange={(e) => setNewDay({ ...newDay, dueDate: e.target.value })} className="text-sm border border-slate-300 rounded-lg px-2 py-2" />
            <button onClick={addDay} disabled={busy} className="text-sm font-semibold px-3 rounded-lg bg-[#C1121F] text-white disabled:opacity-40">Add</button>
          </div>
        </div>
      )}

      {data.dailyPlans.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          items={data.checklists.filter((c) => c.dailyPlanId === day.id)}
          task={task}
          canManage={canManage}
          canComplete={canManage || isAssignee}
          employees={employees}
          onChanged={onChanged}
        />
      ))}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">
          {data.dailyPlans.length ? 'General checklist' : 'Checklist'}
        </p>
        <div className="space-y-1">
          {unplanned.length === 0 && <p className="text-sm text-slate-400">No checklist items.</p>}
          {unplanned.map((item) => (
            <ChecklistRow key={item.id} item={item} task={task} canManage={canManage} canComplete={canManage || isAssignee} employees={employees} onChanged={onChanged} />
          ))}
        </div>
        {(canManage || isAssignee) && (
          <div className="flex gap-2 mt-3">
            <input
              value={newItem.dayId === '' ? newItem.title : ''}
              onChange={(e) => setNewItem({ dayId: '', title: e.target.value })}
              placeholder="Add checklist item…"
              onKeyDown={(e) => { if (e.key === 'Enter') addItem(undefined) }}
              className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2"
            />
            <button onClick={() => addItem(undefined)} className="text-sm font-semibold px-3 rounded-lg bg-slate-800 text-white">Add</button>
          </div>
        )}
      </div>
    </div>
  )
}

function DayCard({
  day,
  items,
  task,
  canManage,
  canComplete,
  employees,
  onChanged,
}: {
  day: DailyPlanDTO
  items: ChecklistDTO[]
  task: TaskDTO
  canManage: boolean
  canComplete: boolean
  employees: AssignableEmployee[]
  onChanged: () => Promise<void>
}) {
  const [adding, setAdding] = useState('')
  const done = items.filter((i) => i.completed).length
  async function addItem() {
    if (!adding.trim()) return
    await api(`/api/tasks/${task.id}/checklists`, 'POST', { title: adding, dailyPlanId: day.id })
    setAdding('')
    await onChanged()
  }
  async function removeDay() {
    if (!confirm('Remove this day plan?')) return
    await api(`/api/tasks/${task.id}/daily-plans/${day.id}`, 'DELETE')
    await onChanged()
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800">{day.title}</p>
          {day.description && <p className="text-xs text-slate-500 mt-0.5">{day.description}</p>}
          <p className="text-[11px] text-slate-400 mt-1">{day.dueDate ? `Due ${fmtDate(day.dueDate)} · ` : ''}{done}/{items.length} done</p>
        </div>
        {canManage && (
          <button onClick={removeDay} className="text-slate-300 hover:text-red-500 p-1" title="Remove day">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <ChecklistRow key={item.id} item={item} task={task} canManage={canManage} canComplete={canComplete} employees={employees} onChanged={onChanged} />
        ))}
      </div>
      {canManage && (
        <div className="flex gap-2 mt-2">
          <input value={adding} onChange={(e) => setAdding(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addItem() }} placeholder="Add item to this day…" className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5" />
          <button onClick={addItem} className="text-xs font-semibold px-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Add</button>
        </div>
      )}
    </div>
  )
}

function ChecklistRow({
  item,
  task,
  canManage,
  canComplete,
  employees,
  onChanged,
}: {
  item: ChecklistDTO
  task: TaskDTO
  canManage: boolean
  canComplete: boolean
  employees: AssignableEmployee[]
  onChanged: () => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [remarks, setRemarks] = useState(item.remarks || '')
  const [percent, setPercent] = useState(item.completionPercent ?? (item.completed ? 100 : 0))
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const itemProgress = item.completed ? 100 : (item.completionPercent ?? 0)

  useEffect(() => {
    setRemarks(item.remarks || '')
    setPercent(item.completed ? 100 : (item.completionPercent ?? 0))
  }, [item.id, item.remarks, item.completionPercent, item.completed])

  async function toggle() {
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}/checklists/${item.id}`, 'PATCH', { completed: !item.completed })
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setBusy(false)
    }
  }

  async function saveProgress() {
    setBusy(true)
    try {
      await api(`/api/tasks/${task.id}/checklists/${item.id}`, 'PATCH', {
        completionPercent: percent,
        remarks: remarks.trim() || undefined,
      })
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save progress')
    } finally {
      setBusy(false)
    }
  }

  async function assignTo(id: string) {
    await api(`/api/tasks/${task.id}/checklists/${item.id}`, 'PATCH', { assignedToId: id || null })
    await onChanged()
  }
  async function uploadProof(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      const up = await taskUpload(f)
      await api(`/api/tasks/${task.id}/checklists/${item.id}`, 'PATCH', { proofFileId: up.id, proofFileName: up.name })
      await onChanged()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }
  async function remove() {
    if (!confirm('Remove this checklist item?')) return
    await api(`/api/tasks/${task.id}/checklists/${item.id}`, 'DELETE')
    await onChanged()
  }

  return (
    <div className="rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-start gap-2 py-1.5 px-1">
        <button
          onClick={toggle}
          disabled={busy || !canComplete}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'
          } disabled:opacity-50`}
        >
          {item.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.title}</p>
            {!item.completed && itemProgress > 0 && itemProgress < 100 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {itemProgress}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {item.assignedToName && <span className="text-[10px] text-slate-400">→ {item.assignedToName}</span>}
            {item.completedBy && item.completed && (
              <span className="text-[10px] text-emerald-600">✓ {item.completedBy.name} · {relTime(item.completedAt)}</span>
            )}
            {!item.completed && item.remarks && (
              <span className="text-[10px] text-slate-500 italic truncate max-w-[200px]">{item.remarks}</span>
            )}
            {item.proofUrl && <a href={item.proofUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline">proof</a>}
            {canComplete && (
              <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-slate-400 hover:text-slate-600">
                {expanded ? 'less' : 'update progress'}
              </button>
            )}
          </div>
          {!item.completed && itemProgress > 0 && (
            <div className="mt-1.5 max-w-xs">
              <ProgressBar percent={itemProgress} />
            </div>
          )}
        </div>
        {canManage && (
          <button onClick={remove} className="text-slate-300 hover:text-red-500 p-0.5" title="Remove">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {expanded && canComplete && (
        <div className="pl-8 pb-2 space-y-3">
          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}

          <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label className="text-xs font-semibold text-slate-600">Work completed</label>
                <span className="text-xs font-bold text-[#C1121F]">{percent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={percent}
                disabled={busy}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="w-full accent-[#C1121F]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Set partial progress if not fully done. 100% marks this item complete.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="What is done so far? Any blockers?"
                rows={2}
                disabled={busy}
                className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveProgress}
                disabled={busy}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#C1121F] text-white hover:bg-[#8B0D15] disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Save progress'}
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              >
                Proof
              </button>
              <input ref={fileRef} type="file" hidden onChange={uploadProof} />
            </div>
          </div>

          {canManage && (
            <select value={item.assignedToId || ''} onChange={(e) => assignTo(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1">
              <option value="">Assign to…</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function CommentsTab({
  data,
  currentUserId,
  isAdmin,
  employees,
  onChanged,
}: {
  data: TaskDetailResponse
  currentUserId: string
  isAdmin: boolean
  employees: AssignableEmployee[]
  onChanged: () => Promise<void>
}) {
  const task = data.task
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [mentionIds, setMentionIds] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const roots = data.comments.filter((c) => !c.parentId)
  const repliesByParent = (id: string) => data.comments.filter((c) => c.parentId === id)

  async function submit() {
    if (!body.trim() && !file) return
    setBusy(true)
    try {
      let files: { fileId: string; fileName: string; contentType?: string; size?: number }[] = []
      if (file) {
        const up = await taskUpload(file)
        files = [{ fileId: up.id, fileName: up.name, contentType: up.contentType, size: up.size }]
      }
      await api(`/api/tasks/${task.id}/comments`, 'POST', { body, files, mentions: mentionIds })
      setBody('')
      setFile(null)
      setMentionIds([])
      await onChanged()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to comment')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {roots.length === 0 && <EmptyState title="No comments yet" hint="Start the discussion below." />}
        {roots.map((c) => (
          <CommentItem key={c.id} comment={c} replies={repliesByParent(c.id)} taskId={task.id} currentUserId={currentUserId} isAdmin={isAdmin} onChanged={onChanged} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3 sticky bottom-0">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="Write a comment…" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:border-[#C1121F] focus:outline-none" />
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <select onChange={(e) => { if (e.target.value && !mentionIds.includes(e.target.value)) setMentionIds([...mentionIds, e.target.value]); e.target.value = '' }} className="text-xs border border-slate-200 rounded-lg px-2 py-1">
            <option value="">@ mention…</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          {mentionIds.map((id) => {
            const e = employees.find((x) => x.id === id)
            return <span key={id} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">@{e?.name || 'user'}<button onClick={() => setMentionIds(mentionIds.filter((m) => m !== id))} className="ml-1">×</button></span>
          })}
          <button onClick={() => fileRef.current?.click()} className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">{file ? file.name.slice(0, 14) : 'Attach'}</button>
          <input ref={fileRef} type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button onClick={submit} disabled={busy} className="ml-auto text-sm font-semibold px-4 py-1.5 rounded-lg bg-[#C1121F] text-white disabled:opacity-40">{busy ? '…' : 'Send'}</button>
        </div>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  replies,
  taskId,
  currentUserId,
  isAdmin,
  onChanged,
}: {
  comment: CommentDTO
  replies: CommentDTO[]
  taskId: string
  currentUserId: string
  isAdmin: boolean
  onChanged: () => Promise<void>
}) {
  const [replying, setReplying] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const isAuthor = comment.author?.id === currentUserId

  async function sendReply() {
    if (!replyBody.trim()) return
    await api(`/api/tasks/${taskId}/comments`, 'POST', { body: replyBody, parentId: comment.id })
    setReplyBody('')
    setReplying(false)
    await onChanged()
  }
  async function saveEdit() {
    await api(`/api/tasks/${taskId}/comments/${comment.id}`, 'PATCH', { body: editBody })
    setEditing(false)
    await onChanged()
  }
  async function del() {
    if (!confirm('Delete this comment?')) return
    await api(`/api/tasks/${taskId}/comments/${comment.id}`, 'DELETE')
    await onChanged()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3">
      <div className="flex items-start gap-2">
        <Avatar name={comment.author?.name} size={26} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800">{comment.author?.name}</p>
            <span className="text-[10px] text-slate-400">{relTime(comment.createdAt)}{comment.edited && ' · edited'}</span>
          </div>
          {comment.deleted ? (
            <p className="text-sm text-slate-400 italic mt-1">This comment was deleted</p>
          ) : editing ? (
            <div className="mt-1">
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1" />
              <div className="flex gap-2 mt-1">
                <button onClick={saveEdit} className="text-[11px] font-semibold text-[#C1121F]">Save</button>
                <button onClick={() => setEditing(false)} className="text-[11px] text-slate-400">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: comment.body }} />
              {comment.files.map((f) => (
                <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 underline mt-1 mr-2">📎 {f.fileName}</a>
              ))}
            </>
          )}
          {!comment.deleted && (
            <div className="flex gap-3 mt-1.5">
              <button onClick={() => setReplying(!replying)} className="text-[11px] text-slate-400 hover:text-slate-700">Reply</button>
              {isAuthor && <button onClick={() => setEditing(true)} className="text-[11px] text-slate-400 hover:text-slate-700">Edit</button>}
              {(isAuthor || isAdmin) && <button onClick={del} className="text-[11px] text-slate-400 hover:text-red-500">Delete</button>}
            </div>
          )}
          {replying && (
            <div className="flex gap-2 mt-2">
              <input value={replyBody} onChange={(e) => setReplyBody(e.target.value)} placeholder="Reply…" className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1" />
              <button onClick={sendReply} className="text-[11px] font-semibold px-2 rounded-lg bg-[#C1121F] text-white">Send</button>
            </div>
          )}
          {replies.length > 0 && (
            <div className="mt-2 pl-3 border-l-2 border-slate-100 space-y-2">
              {replies.map((r) => (
                <div key={r.id}>
                  <div className="flex items-center gap-2">
                    <Avatar name={r.author?.name} size={20} />
                    <p className="text-xs font-semibold text-slate-700">{r.author?.name}</p>
                    <span className="text-[10px] text-slate-400">{relTime(r.createdAt)}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5 pl-7 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: r.deleted ? '<i>deleted</i>' : r.body }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function FilesTab({
  data,
  currentUserId,
  canManage,
  onChanged,
}: {
  data: TaskDetailResponse
  currentUserId: string
  canManage: boolean
  onChanged: () => Promise<void>
}) {
  const task = data.task
  const [busy, setBusy] = useState(false)
  const [meta, setMeta] = useState({ title: '', description: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      const up = await taskUpload(f)
      await api(`/api/tasks/${task.id}/attachments`, 'POST', {
        fileId: up.id,
        fileName: up.name,
        contentType: up.contentType,
        size: up.size,
        title: meta.title || undefined,
        description: meta.description || undefined,
      })
      setMeta({ title: '', description: '' })
      await onChanged()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }
  async function remove(a: AttachmentDTO) {
    if (!confirm(`Delete ${a.fileName}?`)) return
    await api(`/api/tasks/${task.id}/attachments/${a.id}`, 'DELETE')
    await onChanged()
  }

  const isImage = (a: AttachmentDTO) => a.contentType?.startsWith('image/')

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="Title (optional)" className="text-sm border border-slate-200 rounded-lg px-2 py-1.5" />
          <input value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} placeholder="Description (optional)" className="text-sm border border-slate-200 rounded-lg px-2 py-1.5" />
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={busy} className="w-full text-sm font-semibold py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#C1121F] hover:text-[#C1121F] disabled:opacity-50">
          {busy ? 'Uploading…' : '+ Upload file (image, PDF, Word, Excel, ZIP, video)'}
        </button>
        <input ref={fileRef} type="file" hidden onChange={upload} />
      </div>

      {data.attachments.length === 0 ? (
        <EmptyState title="No attachments" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {data.attachments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
              {isImage(a) ? (
                <a href={a.url} target="_blank" rel="noreferrer"><img src={a.url} alt={a.fileName} className="w-full h-28 object-cover" /></a>
              ) : (
                <a href={a.url} target="_blank" rel="noreferrer" className="flex h-28 items-center justify-center bg-slate-50 text-4xl">📄</a>
              )}
              <div className="p-2">
                <p className="text-xs font-semibold text-slate-800 truncate">{a.title || a.fileName}</p>
                <p className="text-[10px] text-slate-400 truncate">{a.uploadedBy?.name} · {relTime(a.createdAt)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <a href={a.url} download className="text-[11px] text-blue-600 hover:underline">Download</a>
                  {(canManage || a.uploadedBy?.id === currentUserId) && (
                    <button onClick={() => remove(a)} className="text-[11px] text-red-500 hover:underline ml-auto">Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function TimelineTab({ history }: { history: HistoryDTO[] }) {
  if (!history.length) return <EmptyState title="No activity yet" />
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="relative pl-5">
        <span className="absolute left-1.5 top-1 bottom-1 w-px bg-slate-200" />
        {history.map((h) => (
          <div key={h.id} className="relative pb-4 last:pb-0">
            <span className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#C1121F] ring-2 ring-white" />
            <p className="text-sm text-slate-700">{h.message}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{h.actor?.name} · {fmtDateTime(h.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
