/** MIME map + helpers for task attachment uploads and previews. */

export const ATTACHMENT_EXT_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  zip: 'application/zip',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  webm: 'video/webm',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  wmv: 'video/x-ms-wmv',
  '3gp': 'video/3gpp',
  ogv: 'video/ogg',
}

const VIDEO_EXT = new Set(['mp4', 'm4v', 'mov', 'webm', 'avi', 'mkv', 'wmv', '3gp', 'ogv'])

export function guessAttachmentMime(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return ATTACHMENT_EXT_MIME[ext] || ''
}

export function resolveAttachmentContentType(file: { type?: string; name?: string }): string {
  const guessed = guessAttachmentMime(file.name || '')
  const raw = file.type?.trim() || ''
  if (raw && raw !== 'application/octet-stream') return raw
  return guessed || raw || 'application/octet-stream'
}

export function isVideoFileName(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return VIDEO_EXT.has(ext)
}

export function isVideoAttachment(contentType?: string, fileName?: string): boolean {
  if (contentType?.toLowerCase().startsWith('video/')) return true
  return Boolean(fileName && isVideoFileName(fileName))
}

export function isImageAttachment(contentType?: string): boolean {
  return Boolean(contentType?.toLowerCase().startsWith('image/'))
}

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

export function isAllowedAttachmentType(type: string, filename?: string): boolean {
  const t = type || guessAttachmentMime(filename || '')
  if (!t) return true
  if (ALLOWED_PREFIXES.some((p) => t.startsWith(p))) return true
  return ALLOWED_EXACT.has(t)
}
