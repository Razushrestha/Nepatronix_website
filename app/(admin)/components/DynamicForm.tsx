'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CollectionConfig, FieldDef } from '@/lib/admin-collections'
import { ImageField, ImagesField, FileField } from './Uploader'
import RichTextEditor from './RichTextEditor'
import SeoPanel from './SeoPanel'

type AnyObj = Record<string, unknown>

function toDatetimeLocal(v: unknown): string {
  if (!v) return ''
  const d = new Date(v as string)
  if (isNaN(d.getTime())) return ''
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

function toDateInput(v: unknown): string {
  if (!v) return ''
  const d = new Date(v as string)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function DynamicForm({
  config,
  initial,
  mode,
}: {
  config: CollectionConfig
  initial: AnyObj
  mode: 'new' | 'edit'
}) {
  const router = useRouter()
  const [data, setData] = useState<AnyObj>(initial || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(name: string, value: unknown) {
    setData((d) => ({ ...d, [name]: value }))
  }
  function setNested(parent: string, name: string, value: unknown) {
    setData((d) => ({ ...d, [parent]: { ...((d[parent] as AnyObj) || {}), [name]: value } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const url =
        mode === 'new'
          ? `/api/admin/collections/${config.slug}`
          : config.singleton
          ? `/api/admin/collections/${config.slug}`
          : `/api/admin/collections/${config.slug}/${initial._id}`
      const method = mode === 'new' ? 'POST' : 'PATCH'
      // Singleton always PATCH-able via id
      const finalUrl =
        config.singleton && initial._id
          ? `/api/admin/collections/${config.slug}/${initial._id}`
          : url
      const res = await fetch(finalUrl, {
        method: config.singleton ? 'PATCH' : method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Save failed')
      }
      if (config.singleton) {
        setSaving(false)
        router.refresh()
        return
      }
      router.push(`/admin/c/${config.slug}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  function renderField(f: FieldDef, parent?: string) {
    const rawVal = parent ? ((data[parent] as AnyObj) || {})[f.name] : data[f.name]
    const change = (v: unknown) => (parent ? setNested(parent, f.name, v) : set(f.name, v))

    const inputCls =
      'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C1121F] transition-colors'

    switch (f.type) {
      case 'text':
      case 'readonly':
        return (
          <input
            type="text"
            value={(rawVal as string) || ''}
            onChange={(e) => change(e.target.value)}
            placeholder={f.placeholder}
            readOnly={f.type === 'readonly'}
            className={inputCls}
          />
        )
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={(rawVal as string) || ''}
            onChange={(e) => change(e.target.value)}
            placeholder={f.placeholder}
            className={inputCls}
          />
        )
      case 'richtext':
        return (
          <RichTextEditor
            value={typeof rawVal === 'string' ? rawVal : ''}
            onChange={(html) => change(html)}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={rawVal === 0 || rawVal ? (rawVal as number) : ''}
            onChange={(e) => change(e.target.value === '' ? undefined : Number(e.target.value))}
            className={inputCls}
          />
        )
      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => change(!rawVal)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rawVal ? 'bg-[#C1121F]' : 'bg-gray-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rawVal ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        )
      case 'select':
        return (
          <select value={(rawVal as string) || ''} onChange={(e) => change(e.target.value)} className={inputCls}>
            <option value="">— Select —</option>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )
      case 'date':
        return <input type="date" value={toDateInput(rawVal)} onChange={(e) => change(e.target.value ? new Date(e.target.value).toISOString() : undefined)} className={inputCls} />
      case 'datetime':
        return <input type="datetime-local" value={toDatetimeLocal(rawVal)} onChange={(e) => change(e.target.value ? new Date(e.target.value).toISOString() : undefined)} className={inputCls} />
      case 'image':
        return <ImageField value={rawVal as never} onChange={(v) => change(v)} />
      case 'images':
        return <ImagesField value={(rawVal as never) || []} onChange={(v) => change(v)} />
      case 'file':
        return <FileField value={rawVal as never} accept={f.fileAccept} onChange={(v) => change(v)} />
      case 'tags':
        return <TagsInput value={(rawVal as string[]) || []} onChange={(v) => change(v)} />
      case 'seo':
        return <SeoPanel data={data} onChange={(name, value) => set(name, value)} />
      case 'group':
        if (f.object) {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700">
              {f.fields?.map((sf) => (
                <div key={sf.name} className={sf.type === 'image' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-gray-400 mb-1">{sf.label}</label>
                  {renderField(sf, f.name)}
                </div>
              ))}
            </div>
          )
        }
        return <RepeatableGroup field={f} value={(rawVal as AnyObj[]) || []} onChange={(v) => change(v)} />
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {config.fields.map((f) => (
          <div key={f.name} className={f.fullWidth || f.type === 'group' || f.type === 'images' || f.type === 'richtext' || f.type === 'seo' ? 'md:col-span-2' : ''}>
            {f.type !== 'seo' && (
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {f.label}
                {f.required && <span className="text-[#C1121F]"> *</span>}
              </label>
            )}
            {renderField(f)}
            {f.type !== 'seo' && f.help && <p className="text-gray-500 text-xs mt-1">{f.help}</p>}
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C1121F] hover:bg-[#a00f1a] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : config.singleton ? 'Save changes' : mode === 'new' ? 'Create' : 'Save changes'}
        </button>
        {!config.singleton && (
          <button type="button" onClick={() => router.push(`/admin/c/${config.slug}`)} className="text-gray-400 hover:text-white px-4 py-2.5 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 flex flex-wrap gap-2">
      {value.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-md">
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-400">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault()
            onChange([...value, input.trim()])
            setInput('')
          } else if (e.key === 'Backspace' && !input && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder="Type and press Enter"
        className="flex-1 min-w-[120px] bg-transparent text-white text-sm focus:outline-none px-1"
      />
    </div>
  )
}

function RepeatableGroup({ field, value, onChange }: { field: FieldDef; value: AnyObj[]; onChange: (v: AnyObj[]) => void }) {
  const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C1121F]'
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {field.fields?.map((sf) => (
              <div key={sf.name}>
                <label className="block text-xs text-gray-400 mb-1">{sf.label}</label>
                <input
                  type="text"
                  value={(row[sf.name] as string) || ''}
                  onChange={(e) => {
                    const next = [...value]
                    next[i] = { ...next[i], [sf.name]: e.target.value }
                    onChange(next)
                  }}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 mt-6 text-lg">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, {}])} className="text-sm text-[#C1121F] hover:underline">
        + Add {field.label.toLowerCase()}
      </button>
    </div>
  )
}
