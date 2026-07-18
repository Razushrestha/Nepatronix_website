'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AttachmentDTO } from './shared-types'
import { isVideoAttachment } from '@/lib/tasks/attachment-mime'
import { InlineSpinner } from './ui'

export type PreviewMode = 'image' | 'pdf' | 'video' | 'text' | 'office' | 'fallback'

export function getAttachmentPreviewMode(a: AttachmentDTO): PreviewMode {
  const ct = (a.contentType || '').toLowerCase()
  const name = (a.fileName || '').toLowerCase()
  if (ct.startsWith('image/')) return 'image'
  if (isVideoAttachment(a.contentType, a.fileName)) return 'video'
  if (ct.includes('pdf') || name.endsWith('.pdf')) return 'pdf'
  if (ct.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.csv')) return 'text'
  if (
    ct.includes('word') ||
    ct.includes('wordprocessingml') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx') ||
    ct.includes('excel') ||
    ct.includes('spreadsheet') ||
    name.endsWith('.xls') ||
    name.endsWith('.xlsx')
  ) {
    return 'office'
  }
  return 'fallback'
}

function absoluteFileUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (typeof window === 'undefined') return path
  return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
}

function PreviewBody({ attachment, mode }: { attachment: AttachmentDTO; mode: PreviewMode }) {
  const [text, setText] = useState('')
  const [textError, setTextError] = useState('')
  const [officeFailed, setOfficeFailed] = useState(false)
  const url = attachment.url
  const absUrl = useMemo(() => absoluteFileUrl(url), [url])

  useEffect(() => {
    if (mode !== 'text') return
    setText('')
    setTextError('')
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load file (${r.status})`)
        return r.text()
      })
      .then(setText)
      .catch((err) => setTextError(err instanceof Error ? err.message : 'Failed to load text'))
  }, [mode, url])

  if (mode === 'image') {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900/95 p-4">
        <img
          src={url}
          alt={attachment.fileName}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />
      </div>
    )
  }

  if (mode === 'pdf') {
    return (
      <iframe
        src={`${url}#view=FitH`}
        title={attachment.fileName}
        className="h-full w-full border-0 bg-slate-100"
      />
    )
  }

  if (mode === 'video') {
    return (
      <div className="flex h-full items-center justify-center bg-black p-4">
        <video src={url} controls className="max-h-full max-w-full rounded-lg" playsInline>
          <track kind="captions" />
        </video>
      </div>
    )
  }

  if (mode === 'text') {
    if (textError) {
      return <FallbackPreview attachment={attachment} message={textError} />
    }
    if (!text) {
      return (
        <div className="flex h-full items-center justify-center bg-slate-50">
          <InlineSpinner className="w-8 h-8" />
        </div>
      )
    }
    return (
      <pre className="h-full overflow-auto bg-slate-50 p-6 text-sm text-slate-800 whitespace-pre-wrap font-mono">
        {text}
      </pre>
    )
  }

  if (mode === 'office' && !officeFailed) {
    const officeSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absUrl)}`
    return (
      <iframe
        src={officeSrc}
        title={attachment.fileName}
        className="h-full w-full border-0 bg-white"
        onError={() => setOfficeFailed(true)}
      />
    )
  }

  return (
    <FallbackPreview
      attachment={attachment}
      message={
        mode === 'office' && officeFailed
          ? 'Office preview is unavailable — open in a new tab or download the file.'
          : 'Inline preview is not available for this file type.'
      }
    />
  )
}

function FallbackPreview({ attachment, message }: { attachment: AttachmentDTO; message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center">
      <span className="text-6xl">📎</span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{attachment.title || attachment.fileName}</p>
        <p className="mt-1 text-xs text-slate-500">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-[#C1121F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A30F19]"
        >
          Open in new tab
        </a>
        <a
          href={attachment.url}
          download={attachment.fileName}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Download
        </a>
      </div>
    </div>
  )
}

export default function AttachmentPreviewModal({
  attachment,
  attachments,
  index,
  onClose,
  onNavigate,
}: {
  attachment: AttachmentDTO
  attachments: AttachmentDTO[]
  index: number
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  const mode = getAttachmentPreviewMode(attachment)
  const hasPrev = index > 0
  const hasNext = index < attachments.length - 1

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(attachments[index - 1].id)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(attachments[index + 1].id)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [attachments, hasNext, hasPrev, index, onClose, onNavigate])

  if (!mounted) return null

  const panel = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/80" role="dialog" aria-modal="true">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-slate-900 px-4 py-3 text-white">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{attachment.title || attachment.fileName}</p>
          <p className="truncate text-[11px] text-slate-400">
            {attachment.fileName}
            {attachments.length > 1 ? ` · ${index + 1} of ${attachments.length}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {attachments.length > 1 && (
            <>
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => hasPrev && onNavigate(attachments[index - 1].id)}
                className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-30"
                aria-label="Previous file"
              >
                ‹
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => hasNext && onNavigate(attachments[index + 1].id)}
                className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-30"
                aria-label="Next file"
              >
                ›
              </button>
            </>
          )}
          <a
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 sm:inline"
          >
            Open tab
          </a>
          <a
            href={attachment.url}
            download={attachment.fileName}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
          >
            Download
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-lg leading-none text-slate-200 hover:bg-white/10"
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <PreviewBody attachment={attachment} mode={mode} />
      </div>
    </div>
  )

  return createPortal(panel, document.body)
}
