/** Per-file limit for task attachments (documents, images, video). Configurable via env. */
const DEFAULT_MB = 512

function parseMb(raw: string | undefined, fallback: number): number {
  const n = raw ? parseInt(raw, 10) : fallback
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/** Server-side max bytes (TASK_MAX_UPLOAD_MB or NEXT_PUBLIC_TASK_MAX_UPLOAD_MB). */
export function getTaskMaxUploadBytes(): number {
  const mb = parseMb(
    process.env.TASK_MAX_UPLOAD_MB ?? process.env.NEXT_PUBLIC_TASK_MAX_UPLOAD_MB,
    DEFAULT_MB
  )
  return mb * 1024 * 1024
}

/** Client-side max bytes (uses NEXT_PUBLIC_* when bundled). */
export const TASK_MAX_UPLOAD_MB = parseMb(
  process.env.NEXT_PUBLIC_TASK_MAX_UPLOAD_MB ?? process.env.TASK_MAX_UPLOAD_MB,
  DEFAULT_MB
)

export const TASK_MAX_UPLOAD_BYTES = TASK_MAX_UPLOAD_MB * 1024 * 1024

export function formatTaskMaxUploadSize(bytes = TASK_MAX_UPLOAD_BYTES): string {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    const gb = mb / 1024
    return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`
  }
  return `${Math.round(mb)} MB`
}
