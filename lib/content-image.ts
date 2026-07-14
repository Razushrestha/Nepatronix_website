export type ContentImage = {
  url?: string
  alt?: string
  caption?: string
  asset?: { url?: string; _ref?: string }
  _migratedUrl?: string
}

/** True for same-origin paths served by this app (e.g. /api/files/…, /og-banner.png). */
export function isLocalImageUrl(url: string): boolean {
  return Boolean(url && url.startsWith('/') && !url.startsWith('//'))
}

/** Resolve a public image URL from MongoDB or migrated portable-text image blocks. */
export function resolveImageUrl(
  image: ContentImage | null | undefined,
  fallback = ''
): string {
  if (!image) return fallback
  if (image.url) return image.url
  if (image._migratedUrl) return image._migratedUrl
  if (image.asset?.url) return image.asset.url
  return fallback
}

export function resolveFileUrl(
  file: { url?: string; name?: string } | null | undefined
): string {
  return file?.url || ''
}
