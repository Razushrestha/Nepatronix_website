import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, fileUrl } from '@/lib/gridfs'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const id = await uploadBuffer(
    bytes,
    file.name || 'upload',
    file.type || 'application/octet-stream'
  )

  return NextResponse.json({ id, url: fileUrl(id), name: file.name })
}
