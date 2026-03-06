'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  payment_verified: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  certificate_generated: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_verified', label: 'Payment Verified' },
  { value: 'approved', label: 'Approved' },
  { value: 'certificate_generated', label: 'Cert. Generated' },
  { value: 'rejected', label: 'Rejected' },
]

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

interface Cert {
  _id: string
  applicantName: string
  courseName: string
  courseType: string
  status: string
  submittedAt?: string
  certificateUID?: string
  hasQR: boolean
  hasPaymentProof: boolean
  paymentProofUrl?: string
}

export default function CertificationsClient({ certs }: { certs: Cert[] }) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>(() =>
    Object.fromEntries(certs.map((c) => [c._id, c.status]))
  )
  const [localCerts, setLocalCerts] = useState(certs)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingAllStatus, setDeletingAllStatus] = useState(false)
  const [cutoff] = useState(() => Date.now() - SEVEN_DAYS_MS)

  async function handleDeleteAllByStatus(status: string) {
    const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
    const count = localCerts.filter((c) => c.status === status).length
    if (count === 0) return
    if (!confirm(`Delete ALL ${count} "${label}" application${count > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeletingAllStatus(true)
    await fetch('/api/admin/certifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLocalCerts((prev) => prev.filter((c) => c.status !== status))
    setDeletingAllStatus(false)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function toggleSelectAll(ids: string[]) {
    setSelected((prev) =>
      prev.size === ids.length ? new Set() : new Set(ids)
    )
  }

  function exitSelectMode() {
    setSelectMode(false)
    setSelected(new Set())
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application? This cannot be undone.')) return
    setDeletingId(id)
    await fetch('/api/admin/certifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLocalCerts((prev) => prev.filter((c) => c._id !== id))
    setDeletingId(null)
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} selected application${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch('/api/admin/certifications', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
      )
    )
    setLocalCerts((prev) => prev.filter((c) => !selected.has(c._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id)
    setLocalStatuses((prev) => ({ ...prev, [id]: newStatus }))
    const res = await fetch('/api/update-application-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status: newStatus }),
    })
    if (newStatus === 'approved') {
      const data = await res.json().catch(() => ({}))
      if (data.certificateUID) {
        setLocalCerts((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, certificateUID: data.certificateUID } : c
          )
        )
      }
    }
    setUpdatingId(null)
  }

  const filtered = useMemo(() => {
    return localCerts.filter((c) => {
      if (selectedStatus === 'recent') {
        if (!c.submittedAt || new Date(c.submittedAt).getTime() < cutoff) return false
      } else if (selectedStatus !== 'all' && c.status !== selectedStatus) {
        return false
      }
      if (search && !c.applicantName.toLowerCase().includes(search.toLowerCase()) && !c.courseName.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && c.submittedAt && new Date(c.submittedAt) < new Date(dateFrom)) return false
      if (dateTo && c.submittedAt && new Date(c.submittedAt) > new Date(dateTo + 'T23:59:59')) return false
      return true
    })
  }, [localCerts, selectedStatus, search, dateFrom, dateTo, cutoff])

  const counts = useMemo(() => certs.reduce((acc: Record<string, number>, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {}), [certs])

  const recentCount = useMemo(() =>
    localCerts.filter((c) => c.submittedAt && new Date(c.submittedAt).getTime() >= cutoff).length
  , [localCerts, cutoff])

  const STATUS_FILTERS = [
    { value: 'all', label: 'All', count: certs.length },
    { value: 'recent', label: 'Last 7 Days', count: recentCount },
    { value: 'pending', label: 'Pending', count: counts['pending'] || 0 },
    { value: 'payment_verified', label: 'Payment Verified', count: counts['payment_verified'] || 0 },
    { value: 'approved', label: 'Approved', count: counts['approved'] || 0 },
    { value: 'certificate_generated', label: 'Cert. Generated', count: counts['certificate_generated'] || 0 },
    { value: 'rejected', label: 'Rejected', count: counts['rejected'] || 0 },
  ]

  return (
    <div className="p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C1121F]/15 border border-[#C1121F]/20 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-[#C1121F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Certification Applications</h1>
            <p className="text-gray-500 text-xs mt-0.5">
              <span className="text-white font-medium">{filtered.length}</span>
              <span className="mx-1 text-gray-700">/</span>
              {localCerts.length} total
              {(search || dateFrom || dateTo || selectedStatus !== 'all') && (
                <span className="ml-2 text-[#C1121F]">filtered</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {!selectMode && selectedStatus !== 'all' && localCerts.filter((c) => c.status === selectedStatus).length > 0 && (
            <button
              onClick={() => handleDeleteAllByStatus(selectedStatus)}
              disabled={deletingAllStatus}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all bg-red-500/8 text-red-400 border-red-500/20 hover:bg-red-500/15 disabled:opacity-50"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              {deletingAllStatus ? 'Deleting…' : `Delete all ${STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label}`}
            </button>
          )}
          <button
            onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
              selectMode
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {selectMode
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>

      {/* ── Bulk delete bar ── */}
      {selectMode && selected.size > 0 && (
        <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-2.5">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-xs font-bold">{selected.size}</span>
          </div>
          <span className="text-red-300 text-sm">{selected.size} application{selected.size > 1 ? 's' : ''} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="ml-auto flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {bulkDeleting
              ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…</>
              : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete {selected.size}</>
            }
          </button>
        </div>
      )}

      {/* ── Status tabs ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {STATUS_FILTERS.map((s) => {
          const active = selectedStatus === s.value
          const dotColor: Record<string, string> = {
            all: 'bg-white',
            recent: 'bg-emerald-400',
            pending: 'bg-yellow-400',
            payment_verified: 'bg-blue-400',
            approved: 'bg-green-400',
            certificate_generated: 'bg-purple-400',
            rejected: 'bg-red-400',
          }
          const activeCard: Record<string, string> = {
            all: 'border-white/20 bg-white/8',
            recent: 'border-emerald-500/30 bg-emerald-500/8',
            pending: 'border-yellow-500/30 bg-yellow-500/8',
            payment_verified: 'border-blue-500/30 bg-blue-500/8',
            approved: 'border-green-500/30 bg-green-500/8',
            certificate_generated: 'border-purple-500/30 bg-purple-500/8',
            rejected: 'border-red-500/30 bg-red-500/8',
          }
          const activeCount: Record<string, string> = {
            all: 'text-white',
            recent: 'text-emerald-300',
            pending: 'text-yellow-300',
            payment_verified: 'text-blue-300',
            approved: 'text-green-300',
            certificate_generated: 'text-purple-300',
            rejected: 'text-red-300',
          }
          return (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(s.value)}
              className={`relative flex flex-col items-start gap-1 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                active
                  ? activeCard[s.value]
                  : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className={`w-1.5 h-1.5 rounded-full ${active ? dotColor[s.value] : 'bg-gray-700'} transition-colors ${s.value === 'recent' && active ? 'animate-pulse' : ''}`} />
                <span className={`text-[11px] font-medium truncate ${active ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
              </div>
              <span className={`text-lg font-bold leading-none ${active ? activeCount[s.value] : 'text-gray-600'}`}>{s.count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Search + Date filters ── */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-xs pl-8 pr-3 py-1.5 focus:outline-none placeholder-gray-600"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-gray-300 text-xs focus:outline-none scheme-dark w-32"
          />
          <span className="text-gray-600 text-xs">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent text-gray-300 text-xs focus:outline-none scheme-dark w-32"
          />
        </div>

        {(search || dateFrom || dateTo || selectedStatus !== 'all') && (
          <>
            <div className="h-4 w-px bg-white/10" />
            <button
              onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setSelectedStatus('all') }}
              className="text-xs text-gray-500 hover:text-white transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {selectMode && (
                <th className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={() => toggleSelectAll(filtered.map((c) => c._id))}
                    className="w-4 h-4 rounded accent-[#C1121F] cursor-pointer"
                  />
                </th>
              )}
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">#</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Course</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Type</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Certificate UID</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Payment</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Date</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Status</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={selectMode ? 10 : 9} className="text-center py-10 text-gray-500">No applications found.</td>
              </tr>
            )}
            {filtered.map((c, i) => (
              <tr
                key={c._id}
                className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${selected.has(c._id) ? 'bg-[#C1121F]/5' : i % 2 === 0 ? '' : 'bg-gray-800/20'}`}
              >
                {/* Checkbox */}
                {selectMode && (
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(c._id)}
                      onChange={() => toggleSelect(c._id)}
                      className="w-4 h-4 rounded accent-[#C1121F] cursor-pointer"
                    />
                  </td>
                )}
                {/* Row number */}
                <td className="px-5 py-3.5 text-gray-500 text-xs">{i + 1}</td>

                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{c.applicantName}</span>
                    {c.hasPaymentProof && (
                      <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded">
                        Payment
                      </span>
                    )}
                  </div>
                </td>

                {/* Course */}
                <td className="px-5 py-3.5 text-gray-300 max-w-50 truncate">{c.courseName}</td>

                {/* Type */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.courseType === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {c.courseType || '—'}
                  </span>
                </td>

                {/* Certificate UID */}
                <td className="px-5 py-3.5 font-mono text-xs text-gray-300">
                  {c.certificateUID ? (
                    <span className="bg-gray-800 px-2 py-1 rounded text-purple-300">{c.certificateUID}</span>
                  ) : (
                    <span className="text-gray-600">Not generated</span>
                  )}
                </td>

                {/* Payment Screenshot */}
                <td className="px-5 py-3.5">
                  {c.paymentProofUrl ? (
                    <button
                      onClick={() => setPreviewImg(c.paymentProofUrl!)}
                      className="group relative block w-12 h-12 rounded-lg overflow-hidden border border-gray-700 hover:border-[#C1121F] transition-colors"
                      title="Click to preview"
                    >
                      <Image
                        src={c.paymentProofUrl}
                        alt="Payment proof"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </div>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                  {c.submittedAt ? (
                    <>
                      <div>{new Date(c.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div className="text-gray-600">{new Date(c.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-emerald-600/80 text-[10px] mt-0.5">{timeAgo(c.submittedAt)}</div>
                    </>
                  ) : '—'}
                </td>

                {/* Status dropdown + delete */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={localStatuses[c._id] ?? c.status}
                        disabled={updatingId === c._id}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className={`text-xs pr-6 pl-2.5 py-1.5 rounded-lg border font-medium appearance-none cursor-pointer focus:outline-none transition-colors disabled:opacity-50 ${
                          BADGE[localStatuses[c._id] ?? c.status] || 'bg-gray-700 text-gray-300 border-gray-600'
                        } bg-transparent`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value} className="bg-gray-900 text-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {updatingId === c._id ? (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
                      ) : (
                        <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={deletingId === c._id}
                      title="Delete application"
                      className="shrink-0 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors disabled:opacity-40"
                    >
                      {deletingId === c._id ? (
                        <span className="w-3 h-3 block border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>

                {/* Action */}
                <td className="px-5 py-3.5">
                  <Link href={`/admin/certifications/${c._id}`} className="text-[#C1121F] hover:underline text-xs font-medium whitespace-nowrap">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lightbox */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              ✕ Close
            </button>
            <Image
              src={previewImg}
              alt="Payment screenshot"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl border border-gray-700 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
