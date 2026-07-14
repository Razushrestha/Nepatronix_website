/** Max upload size enforced on client and server (15 MB). */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

export type UploadResult = {
  id: string
  url: string
  name: string
}

function formatMaxSize(): string {
  return `${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB`
}

/** Upload a file to GridFS via the admin API. */
export async function adminUpload(file: File): Promise<UploadResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large (max ${formatMaxSize()})`)
  }

  const fd = new FormData()
  fd.append('file', file)

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: fd,
    credentials: 'same-origin',
  })

  let data: { error?: string; id?: string; url?: string; name?: string } = {}
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text) as typeof data
    } catch {
      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`)
      }
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Session expired — please log in again')
    }
    if (res.status === 413) {
      throw new Error(`File too large (max ${formatMaxSize()})`)
    }
    throw new Error(data.error || `Upload failed (${res.status})`)
  }

  if (!data.id || !data.url) {
    throw new Error('Invalid upload response from server')
  }

  return {
    id: data.id,
    url: data.url,
    name: data.name || file.name,
  }
}
