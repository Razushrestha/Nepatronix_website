'use client'
import { useState } from 'react'
import { adminUpload } from '@/lib/admin-upload'
import { adminInput } from './ui'

export interface ImageValue {
  url?: string
  alt?: string
  caption?: string
}

export function ImageField({
  value,
  onChange,
  withCaption = false,
}: {
  value?: ImageValue
  onChange: (v: ImageValue | undefined) => void
  withCaption?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setError('')
    try {
      const { url } = await adminUpload(f)
      onChange({ ...value, url })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {value?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt={value.alt || ''} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 text-xs">No image</span>
          )}
        </div>
        <div className="space-y-2 flex-1">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs cursor-pointer hover:bg-slate-50 transition-colors">
            {busy ? 'Uploading…' : value?.url ? 'Replace' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
          </label>
          {value?.url && (
            <button type="button" onClick={() => onChange(undefined)} className="ml-2 text-xs text-red-600 hover:underline">
              Remove
            </button>
          )}
          <input
            type="text"
            placeholder="Alt text"
            value={value?.alt || ''}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            className={`${adminInput} !py-1.5`}
          />
          {withCaption && (
            <input
              type="text"
              placeholder="Caption"
              value={value?.caption || ''}
              onChange={(e) => onChange({ ...value, caption: e.target.value })}
              className={`${adminInput} !py-1.5`}
            />
          )}
        </div>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}

export function ImagesField({
  value = [],
  onChange,
}: {
  value?: ImageValue[]
  onChange: (v: ImageValue[]) => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {value.map((img, i) => (
          <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <ImageField
              value={img}
              withCaption
              onChange={(v) => {
                const next = [...value]
                if (v === undefined) next.splice(i, 1)
                else next[i] = v
                onChange(next)
              }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, {}])}
        className="text-sm text-[#C1121F] hover:underline"
      >
        + Add image
      </button>
    </div>
  )
}

export interface FileValue {
  url?: string
  name?: string
}

export function FileField({
  value,
  onChange,
  accept,
}: {
  value?: FileValue
  onChange: (v: FileValue | undefined) => void
  accept?: string
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setError('')
    try {
      const { url, name } = await adminUpload(f)
      onChange({ url, name })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs cursor-pointer hover:bg-slate-50 transition-colors">
          {busy ? 'Uploading…' : value?.url ? 'Replace file' : 'Upload file'}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={busy} />
        </label>
        {value?.url && (
          <a href={value.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[200px]">
            {value.name || 'View file'}
          </a>
        )}
        {value?.url && (
          <button type="button" onClick={() => onChange(undefined)} className="text-xs text-red-600 hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}
