import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, fileUrl } from '@/lib/gridfs'
import { requireRole } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { MAX_UPLOAD_BYTES } from '@/lib/admin-upload'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['admin', 'editor'])
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let form: FormData
    try {
      form = await req.formData()
    } catch {
      return NextResponse.json({ error: 'Invalid upload payload' }, { status: 400 })
    }

    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB limit` },
        { status: 413 }
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    if (!bytes.length) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    }

    await connectToDatabase()

    const id = await uploadBuffer(
      bytes,
      file.name || 'upload',
      file.type || 'application/octet-stream'
    )

    return NextResponse.json({
      id,
      url: fileUrl(id),
      name: file.name || 'upload',
    })
  } catch (err) {
    console.error('[admin/upload]', err)
    const message =
      err instanceof Error && err.message
        ? err.message
        : 'Upload failed — check server logs and MongoDB connection'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
