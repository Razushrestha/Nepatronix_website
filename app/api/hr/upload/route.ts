import { NextRequest, NextResponse } from 'next/server'
import { uploadWebStream, fileUrl } from '@/lib/gridfs'
import { requireHrSession } from '@/lib/hr/auth'
import { connectToDatabase } from '@/lib/mongodb'
import {
  isAllowedAttachmentType,
  resolveAttachmentContentType,
} from '@/lib/tasks/attachment-mime'
import { formatTaskMaxUploadSize, getTaskMaxUploadBytes } from '@/lib/tasks/upload-limits'

export const runtime = 'nodejs'
export const maxDuration = 3600

export async function POST(req: NextRequest) {
  try {
    const session = await requireHrSession(req)
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

    const contentType = resolveAttachmentContentType(file)
    const maxBytes = getTaskMaxUploadBytes()

    if (!isAllowedAttachmentType(contentType, file.name || '')) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
    }

    if (maxBytes > 0 && file.size > maxBytes) {
      return NextResponse.json(
        { error: `File exceeds ${formatTaskMaxUploadSize(maxBytes)} limit` },
        { status: 413 }
      )
    }

    if (!file.size) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 })
    }

    await connectToDatabase()

    const id = await uploadWebStream(
      file.stream(),
      file.name || 'upload',
      contentType
    )

    return NextResponse.json({
      id,
      url: fileUrl(id),
      name: file.name || 'upload',
      contentType,
      size: file.size,
    })
  } catch (err) {
    console.error('[hr/upload]', err)
    const message =
      err instanceof Error && err.message ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
