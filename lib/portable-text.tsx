import type { ReactNode } from 'react'
import Image from 'next/image'
import { resolveImageUrl, isLocalImageUrl, type ContentImage } from '@/lib/content-image'

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
    const imageClass = 'w-full h-auto'
    const wrapper = (children: ReactNode) => (
      <div
        key={block._key || `image-${index}`}
        className="my-8 overflow-hidden rounded-xl shadow-lg border border-slate-100"
      >
        {children}
        {block.caption && (
          <p className="text-center text-sm text-slate-500 py-3 bg-slate-50 border-t border-slate-100">
            {block.caption}
          </p>
        )}
      </div>
    )
    if (isLocalImageUrl(src)) {
      return wrapper(
        <Image
          src={src}
          alt={block.alt || 'Blog image'}
          width={1200}
          height={675}
          className={imageClass}
        />
      )
    }
    return wrapper(
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={block.alt || 'Blog image'} className={imageClass} />
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function spanToHtml(span: PortableSpan, markDefs: PortableBlock['markDefs']): string {
  let html = escapeHtml(span.text || '')
  for (const mark of span.marks || []) {
    if (mark === 'strong') html = `<strong>${html}</strong>`
    else if (mark === 'em') html = `<em>${html}</em>`
    else if (mark === 'code') html = `<code>${html}</code>`
    else {
      const def = markDefs?.find((item) => item._key === mark)
      if (def?.href) {
        html = `<a href="${escapeHtml(def.href)}" target="_blank" rel="noopener noreferrer">${html}</a>`
      }
    }
  }
  return html
}

/** Convert migrated Sanity portable text to HTML for the admin TipTap editor. */
export function portableTextToHtml(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value) || !value.length) return ''

  const blocks = value as PortableBlock[]
  const parts: string[] = []
  let listItems: string[] = []
  let listType: 'bullet' | 'number' | null = null

  const flushList = () => {
    if (!listItems.length || !listType) return
    const tag = listType === 'bullet' ? 'ul' : 'ol'
    parts.push(`<${tag}>${listItems.join('')}</${tag}>`)
    listItems = []
    listType = null
  }

  for (const block of blocks) {
    if (block._type === 'image') {
      flushList()
      const src = resolveImageUrl(block as ContentImage)
      if (src) parts.push(`<img src="${src}" alt="${escapeHtml(block.alt || '')}" />`)
      continue
    }
    if (block._type !== 'block' || !block.children?.length) continue

    const inner = block.children.map((child) => spanToHtml(child, block.markDefs)).join('')

    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType && listType !== block.listItem) flushList()
      listType = block.listItem
      listItems.push(`<li>${inner}</li>`)
      continue
    }

    flushList()
    switch (block.style) {
      case 'h1':
        parts.push(`<h1>${inner}</h1>`)
        break
      case 'h2':
        parts.push(`<h2>${inner}</h2>`)
        break
      case 'h3':
        parts.push(`<h3>${inner}</h3>`)
        break
      case 'h4':
        parts.push(`<h4>${inner}</h4>`)
        break
      case 'blockquote':
        parts.push(`<blockquote>${inner}</blockquote>`)
        break
      default:
        parts.push(`<p>${inner}</p>`)
    }
  }

  flushList()
  return parts.join('')
}

export function hasBlogBody(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0
  }
  return Array.isArray(value) && value.length > 0
}

/** Extract plain text from either admin HTML or portable-text blocks for SEO signals (word counts, `articleBody`, meta). */
export function blogBodyToPlainText(value: unknown): string {
  if (typeof value === 'string') {
    return value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
  }
  if (!Array.isArray(value)) return ''
  const blocks = value as PortableBlock[]
  const parts: string[] = []
  for (const block of blocks) {
    if (block._type === 'block' && block.children?.length) {
      parts.push(block.children.map((c) => c.text || '').join(' '))
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/** Render blog body from admin HTML or migrated portable text blocks. */
export function BlogBody({ value }: { value: unknown }) {
  if (typeof value === 'string') {
    const html = value.trim()
    if (!hasBlogBody(html)) return null
    return (
      <div
        className="blog-html-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return <PortableBody value={value} />
}
