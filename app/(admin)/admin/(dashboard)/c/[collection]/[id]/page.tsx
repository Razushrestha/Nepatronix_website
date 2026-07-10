'use client'
import { use } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCollection } from '@/lib/admin-collections'
import DynamicForm from '@/app/(admin)/components/DynamicForm'
import { fetcher, Spinner } from '@/app/(admin)/components/ui'
import CertificateActions from '@/app/(admin)/components/CertificateActions'

export default function EditPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = use(params)
  const router = useRouter()
  const config = getCollection(collection)
  const isNew = id === 'new'

  const { data, isLoading, mutate, error } = useSWR<{ item: Record<string, unknown> }>(
    !config || isNew ? null : `/api/admin/collections/${collection}/${id}`,
    fetcher
  )

  if (!config) return <div className="p-8 text-gray-400">Unknown collection.</div>
  if (error) return <div className="p-8 text-gray-400">You don&apos;t have access to this section.</div>
  if (!isNew && (isLoading || !data)) return <Spinner />

  const initial = isNew ? {} : data!.item

  async function handleDelete() {
    if (!confirm('Delete this item? This cannot be undone.')) return
    await fetch(`/api/admin/collections/${collection}/${id}`, { method: 'DELETE' })
    router.push(`/admin/c/${collection}`)
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/c/${collection}`} className="text-gray-500 hover:text-gray-300 text-sm">← {config.label}</Link>
          <h1 className="text-2xl font-bold text-white mt-1">{isNew ? `New ${config.singular}` : `Edit ${config.singular}`}</h1>
        </div>
        {!isNew && (
          <button onClick={handleDelete} className="px-3 py-2 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
            Delete
          </button>
        )}
      </div>

      {/* Specialized certificate workflow */}
      {collection === 'certifications' && !isNew && (
        <CertificateActions item={initial} onChanged={() => mutate()} />
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <DynamicForm config={config} initial={initial} mode={isNew ? 'new' : 'edit'} />
      </div>
    </div>
  )
}
