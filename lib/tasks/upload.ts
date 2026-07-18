import { taskClientHeaders } from '@/lib/tasks/client-headers'
import { formatTaskMaxUploadSize, TASK_MAX_UPLOAD_BYTES } from '@/lib/tasks/upload-limits'

export interface TaskUploadResult {
  id: string
  url: string
  name: string
  contentType: string
  size: number
}

/** Upload a file to GridFS through the HR-session upload endpoint. */
export async function taskUpload(file: File): Promise<TaskUploadResult> {
  if (file.size > TASK_MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large (max ${formatTaskMaxUploadSize()})`)
  }

  const fd = new FormData()
  fd.append('file', file)

  const res = await fetch('/api/hr/upload', {
    method: 'POST',
    headers: taskClientHeaders(),
    body: fd,
    credentials: 'same-origin',
  })

  let data: Partial<TaskUploadResult> & { error?: string } = {}
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      if (!res.ok) throw new Error(`Upload failed (${res.status})`)
    }
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('Session expired — please log in again')
    if (res.status === 413) throw new Error(data.error || `File too large (max ${formatTaskMaxUploadSize()})`)
    if (res.status === 415) throw new Error('File type not allowed')
    throw new Error(data.error || `Upload failed (${res.status})`)
  }

  if (!data.id || !data.url) throw new Error('Invalid upload response')

  return {
    id: data.id,
    url: data.url,
    name: data.name || file.name,
    contentType: data.contentType || file.type,
    size: data.size || file.size,
  }
}
