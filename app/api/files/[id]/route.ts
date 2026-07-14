import { NextRequest } from 'next/server'
import { getFile } from '@/lib/gridfs'
import { Readable } from 'stream'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const file = await getFile(id)

    if (!file) {
      return new Response('Not found', { status: 404 })
    }

    const webStream = Readable.toWeb(file.stream as Readable) as ReadableStream

    return new Response(webStream, {
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': String(file.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('[files]', err)
    return new Response('Failed to load file', { status: 500 })
  }
}
