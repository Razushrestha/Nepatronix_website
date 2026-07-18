/** Per-file limit for task attachments. Set TASK_MAX_UPLOAD_MB=0 for no app limit (default). */
const DEFAULT_MB = 0

function parseMb(raw: string | undefined, fallback: number): number {
  if (raw === '0') return 0
  const n = raw ? parseInt(raw, 10) : fallback
  if (!Number.isFinite(n) || n < 0) return fallback
  return n
}

/** Server-side max bytes. Returns 0 = unlimited (no app-level size check). */
export function getTaskMaxUploadBytes(): number {
  const mb = parseMb(
    process.env.TASK_MAX_UPLOAD_MB ?? process.env.NEXT_PUBLIC_TASK_MAX_UPLOAD_MB,
    DEFAULT_MB
  )
  return mb === 0 ? 0 : mb * 1024 * 1024
}

export function isTaskUploadUnlimited(): boolean {
  return getTaskMaxUploadBytes() === 0
}

/** Client-side max bytes (uses NEXT_PUBLIC_* when bundled). 0 = unlimited. */
export const TASK_MAX_UPLOAD_MB = parseMb(
  process.env.NEXT_PUBLIC_TASK_MAX_UPLOAD_MB ?? process.env.TASK_MAX_UPLOAD_MB,
  DEFAULT_MB
)

export const TASK_MAX_UPLOAD_BYTES =
  TASK_MAX_UPLOAD_MB === 0 ? 0 : TASK_MAX_UPLOAD_MB * 1024 * 1024

export function formatTaskMaxUploadSize(bytes = TASK_MAX_UPLOAD_BYTES): string {
  if (bytes === 0) return 'any size'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) {
    const gb = mb / 1024
    return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`
  }
  return `${Math.round(mb)} MB`
}
