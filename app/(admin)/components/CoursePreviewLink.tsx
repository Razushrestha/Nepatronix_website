'use client'

import useSWR from 'swr'
import { fetcher, adminCard } from './ui'

export default function CoursePreviewLink({ id }: { id: string }) {
  const { data, error } = useSWR<{ listId: number }>(`/api/admin/courses/${id}/list-id`, fetcher)

  const listId = data?.listId
  const href = listId ? `/services/courses/${listId}` : null

  return (
    <div className={`${adminCard} p-4 flex flex-wrap items-center justify-between gap-3`}>
      <div>
        <p className="text-sm font-semibold text-slate-900">Public details page</p>
        <p className="text-slate-500 text-xs mt-0.5">
          {error
            ? 'Could not resolve the public URL for this course.'
            : href
              ? 'Open the live course details page as visitors see it.'
              : 'Resolving public URL…'}
        </p>
      </div>
      <a
        href={href ?? '#'}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!href}
        onClick={(e) => { if (!href) e.preventDefault() }}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${
          href
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View details page
      </a>
    </div>
  )
}
