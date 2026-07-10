import type { ReactNode } from 'react'
import Image from 'next/image'
import { resolveImageUrl, type ContentImage } from '@/lib/content-image'

type PortableBlock = {
  _type?: string
  _key?: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  children?: PortableSpan[]
  markDefs?: { _key?: string; _type?: string; href?: string }[]
  url?: string
  alt?: string
  caption?: string
  _migratedUrl?: string
  asset?: { url?: string; _ref?: string }
}

type PortableSpan = {
  _type?: string
  text?: string
  marks?: string[]
}

function renderMarks(
  text: string,
  marks: string[] | undefined,
  markDefs: PortableBlock['markDefs']
) {
  if (!marks?.length) return text

  let node: ReactNode = text
  for (const mark of marks) {
    if (mark === 'strong') {
      node = <strong className="font-bold text-slate-900">{node}</strong>
    } else if (mark === 'em') {
      node = <em className="italic">{node}</em>
    } else if (mark === 'code') {
      node = (
        <code className="bg-slate-100 text-[#C1121F] px-1.5 py-0.5 rounded text-sm font-mono">
          {node}
        </code>
      )
    } else {
      const def = markDefs?.find((item) => item._key === mark)
      if (def?.href) {
        node = (
          <a
            href={def.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C1121F] hover:underline font-medium"
          >
            {node}
          </a>
        )
      }
    }
  }
  return node
}

function renderBlock(block: PortableBlock, index: number) {
  if (block._type === 'image') {
    const src = resolveImageUrl(block as ContentImage)
    if (!src) return null
    return (
      <div
        key={block._key || `image-${index}`}
        className="my-8 overflow-hidden rounded-xl shadow-lg border border-slate-100"
      >
        <Image
          src={src}
          alt={block.alt || 'Blog image'}
          width={1200}
          height={675}
          className="w-full h-auto"
        />
        {block.caption && (
          <p className="text-center text-sm text-slate-500 py-3 bg-slate-50 border-t border-slate-100">
            {block.caption}
          </p>
        )}
      </div>
    )
  }

  if (block._type !== 'block' || !block.children?.length) return null

  const content = block.children.map((child, childIndex) => (
    <span key={childIndex}>{renderMarks(child.text || '', child.marks, block.markDefs)}</span>
  ))

  if (block.listItem === 'bullet') {
    return (
      <li key={block._key || index} className="text-slate-700">
        {content}
      </li>
    )
  }

  if (block.listItem === 'number') {
    return (
      <li key={block._key || index} className="text-slate-700">
        {content}
      </li>
    )
  }

  switch (block.style) {
    case 'h1':
      return (
        <h1 key={block._key || index} className="text-3xl font-bold text-slate-900 mt-10 mb-4">
          {content}
        </h1>
      )
    case 'h2':
      return (
        <h2 key={block._key || index} className="text-2xl font-bold text-slate-900 mt-8 mb-3">
          {content}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={block._key || index} className="text-xl font-bold text-slate-900 mt-6 mb-2">
          {content}
        </h3>
      )
    case 'h4':
      return (
        <h4 key={block._key || index} className="text-lg font-bold text-slate-900 mt-5 mb-2">
          {content}
        </h4>
      )
    case 'blockquote':
      return (
        <blockquote
          key={block._key || index}
          className="border-l-4 border-[#C1121F] bg-slate-50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-slate-600"
        >
          {content}
        </blockquote>
      )
    default:
      return (
        <p key={block._key || index} className="text-slate-700 leading-relaxed mb-4">
          {content}
        </p>
      )
  }
}

export function PortableBody({ value }: { value: unknown }) {
  if (!Array.isArray(value) || !value.length) return null

  const blocks = value as PortableBlock[]
  const nodes: ReactNode[] = []
  let listItems: ReactNode[] = []
  let listType: 'bullet' | 'number' | null = null

  const flushList = () => {
    if (!listItems.length || !listType) return
    if (listType === 'bullet') {
      nodes.push(
        <ul
          key={`ul-${nodes.length}`}
          className="list-disc list-inside space-y-2 my-4 text-slate-700 ml-4"
        >
          {listItems}
        </ul>
      )
    } else {
      nodes.push(
        <ol
          key={`ol-${nodes.length}`}
          className="list-decimal list-inside space-y-2 my-4 text-slate-700 ml-4"
        >
          {listItems}
        </ol>
      )
    }
    listItems = []
    listType = null
  }

  blocks.forEach((block, index) => {
    if (block._type === 'block' && block.listItem) {
      if (listType && listType !== block.listItem) flushList()
      listType = block.listItem
      listItems.push(renderBlock(block, index))
      return
    }

    flushList()
    const rendered = renderBlock(block, index)
    if (rendered) nodes.push(rendered)
  })

  flushList()
  return <>{nodes}</>
}
