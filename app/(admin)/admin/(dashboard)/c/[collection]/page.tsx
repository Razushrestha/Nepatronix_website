'use client'
import { use } from 'react'
import useSWR from 'swr'
import { getCollection } from '@/lib/admin-collections'
import CollectionTable from '@/app/(admin)/components/CollectionTable'
import DynamicForm from '@/app/(admin)/components/DynamicForm'
import { fetcher, Spinner } from '@/app/(admin)/components/ui'

export default function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = use(params)
  const config = getCollection(collection)

  if (!config) {
    return <div className="p-8 text-gray-400">Unknown collection.</div>
  }

  if (config.singleton) {
    return <SingletonEditor slug={collection} />
  }

  return <CollectionTable config={config} />
}

function SingletonEditor({ slug }: { slug: string }) {
  const config = getCollection(slug)!
  const { data, isLoading, error } = useSWR<{ item: Record<string, unknown> }>(`/api/admin/collections/${slug}`, fetcher)
  if (error) return <div className="p-8 text-gray-400">You don&apos;t have access to this section.</div>
  if (isLoading || !data) return <Spinner />
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-1">{config.label}</h1>
      <p className="text-gray-400 text-sm mb-6">Edit the {config.label.toLowerCase()} shown across the public site.</p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <DynamicForm config={config} initial={data.item} mode="edit" />
      </div>
    </div>
  )
}
