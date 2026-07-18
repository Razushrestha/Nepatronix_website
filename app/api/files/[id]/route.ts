import { NextRequest } from 'next/server'
import { getFile } from '@/lib/gridfs'
import { guessAttachmentMime } from '@/lib/tasks/attachment-mime'
import { Readable } from 'stream'

export const runtime = 'nodejs'

function safeFilename(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, '_') || 'file'
}

function resolveFileContentType(stored: string, filename: string): string {
  const type = stored?.trim() || ''
  if (type && type !== 'application/octet-stream') return type
  return guessAttachmentMime(filename) || type || 'application/octet-stream'
}

function parseRange(
  header: string | null,
  total: number
): { start: number; end: number } | null {
  if (!header?.startsWith('bytes=')) return null
  const [startStr, endStr] = header.replace('bytes=', '').split('-')
  const start = parseInt(startStr, 10)
  if (!Number.isFinite(start) || start < 0 || start >= total) return null
  const end = endStr ? parseInt(endStr, 10) : total - 1
  if (!Number.isFinite(end) || end < start || end >= total) return null
  return { start, end }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const meta = await getFile(id)
    if (!meta) {
      return new Response('Not found', { status: 404 })
    }

    const range = parseRange(req.headers.get('range'), meta.length)
    const file = range ? await getFile(id, range) : meta
    if (!file) {
      return new Response('Not found', { status: 404 })
    }

    const webStream = Readable.toWeb(file.stream as Readable) as ReadableStream
    const safeName = safeFilename(file.filename)
    const contentType = resolveFileContentType(file.contentType, file.filename)
    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${safeName}"`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    }

    if (range && 'rangeStart' in file) {
      const chunk = file.rangeEnd - file.rangeStart + 1
      return new Response(webStream, {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Length': String(chunk),
          'Content-Range': `bytes ${file.rangeStart}-${file.rangeEnd}/${meta.length}`,
        },
      })
    }

    return new Response(webStream, {
      headers: {
        ...baseHeaders,
        'Content-Length': String(file.length),
      },
    })
  } catch (err) {
    console.error('[files]', err)
    return new Response('Failed to load file', { status: 500 })
  }
}
