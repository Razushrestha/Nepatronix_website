import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer, fileUrl } from '@/lib/gridfs'
import { requireHrSession } from '@/lib/hr/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { MAX_UPLOAD_BYTES } from '@/lib/admin-upload'

export const runtime = 'nodejs'

/** Whitelisted content types for task attachments / proofs. */
const ALLOWED_PREFIXES = ['image/', 'video/']
const ALLOWED_EXACT = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
])

function isAllowedType(type: string): boolean {
  if (!type) return true
  if (ALLOWED_PREFIXES.some((p) => type.startsWith(p))) return true
  return ALLOWED_EXACT.has(type)
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrSession()
    if (!session) {
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

    if (!isAllowedType(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
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
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    })
  } catch (err) {
    console.error('[hr/upload]', err)
    const message =
      err instanceof Error && err.message ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
