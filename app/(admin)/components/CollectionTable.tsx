'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { CollectionConfig } from '@/lib/admin-collections'
import { fetcher, StatusBadge, formatDate, Spinner, adminInput, adminCard, adminHeading, adminSubtext } from './ui'

type Row = Record<string, unknown>

function getVal(row: Row, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, k) => (acc as Row)?.[k], row)
}

export default function CollectionTable({ config }: { config: CollectionConfig }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const key = `/api/admin/collections/${config.slug}?q=${encodeURIComponent(q)}&status=${status}&page=${page}&limit=25`
  const { data, isLoading, mutate, error } = useSWR<{ items: Row[]; total: number; pages: number }>(key, fetcher, { keepPreviousData: true })

  const items = data?.items || []

  if (error) {
    return <div className="p-8 text-slate-500">You don&apos;t have access to this section.</div>
  }

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleAll() {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map((i) => String(i._id))))
  }

  async function bulk(action: string, statusVal?: string) {
    if (selected.size === 0) return
    if (action === 'delete' && !confirm(`Delete ${selected.size} item(s)? This cannot be undone.`)) return
    await fetch(`/api/admin/collections/${config.slug}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids: [...selected], status: statusVal }),
    })
    setSelected(new Set())
    mutate()
  }

  function exportCsv() {
    const cols = config.columns.filter((c) => c.type !== 'image')
    const header = cols.map((c) => c.label).join(',')
    const rows = items.map((r) =>
      cols
        .map((c) => {
          const v = getVal(r, c.key)
          const s = v == null ? '' : String(v)
          return `"${s.replace(/"/g, '""')}"`
        })
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.slug}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={adminHeading}>{config.label}</h1>
          <p className={`${adminSubtext} mt-0.5`}>{data?.total ?? 0} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="px-3 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
          {!config.noCreate && (
            <Link href={`/admin/c/${config.slug}/new`} className="px-4 py-2 text-sm rounded-lg bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold transition-colors">
              + New
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder={`Search ${config.label.toLowerCase()}…`}
            className={`${adminInput} pl-9`}
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        {config.statusOptions && (
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={adminInput}>
            <option value="">All statuses</option>
            {config.statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        )}
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
          <span className="text-sm text-slate-700">{selected.size} selected</span>
          {config.statusOptions && (
            <select onChange={(e) => e.target.value && bulk('status', e.target.value)} defaultValue="" className={`${adminInput} !py-1.5 !text-xs !px-2 w-auto`}>
              <option value="">Set status…</option>
              {config.statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
          <button onClick={() => bulk('delete')} className="text-xs text-red-600 hover:text-red-700 ml-auto">Delete selected</button>
        </div>
      )}

      {/* Table */}
      <div className={`${adminCard} overflow-hidden`}>
        {isLoading && !data ? (
          <Spinner />
        ) : items.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-16">No {config.label.toLowerCase()} found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={toggleAll} className="accent-[#C1121F]" />
                  </th>
                  {config.columns.map((c) => <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>)}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((row) => {
                  const id = String(row._id)
                  return (
                    <tr
                      key={id}
                      onClick={() => router.push(`/admin/c/${config.slug}/${id}`)}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} className="accent-[#C1121F]" />
                      </td>
                      {config.columns.map((c) => {
                        const v = getVal(row, c.key)
                        return (
                          <td key={c.key} className="px-4 py-3 text-slate-700">
                            {c.type === 'image' ? (
                              (v as { url?: string })?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={(v as { url: string }).url} alt="" className="w-9 h-9 rounded-lg object-cover" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100" />
                              )
                            ) : c.type === 'badge' ? (
                              <StatusBadge value={v as string} options={config.statusOptions} />
                            ) : c.type === 'date' ? (
                              <span className="text-slate-500">{formatDate(v as string)}</span>
                            ) : c.type === 'boolean' ? (
                              <span className={v ? 'text-green-600' : 'text-slate-400'}>{v ? 'Yes' : 'No'}</span>
                            ) : c.type === 'email' ? (
                              <span className="text-slate-500">{(v as string) || '—'}</span>
                            ) : (
                              <span className="truncate">{v == null || v === '' ? '—' : String(v)}</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-4 py-3 text-right text-slate-400">→</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Prev</button>
          <span className="text-slate-500 text-sm">Page {page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
