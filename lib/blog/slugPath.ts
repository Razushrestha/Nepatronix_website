const SAFE_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** En dash, em dash, minus signs → ASCII hyphen (common in pasted titles like "India–Nepal"). */
const UNICODE_HYPHENS = /[\u2013\u2014\u2212\uFE58\uFE63\uFF0D]/g;

/**
 * Normalize a blog slug into a filesystem-safe path segment used on the website.
 * Strips punctuation, emoji, parentheses, rockets, converts spaces to hyphens.
 */
export function canonicalBlogSlug(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  let s = raw.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(UNICODE_HYPHENS, "-");
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-zA-Z0-9-]/g, "");
  s = s.toLowerCase();
  s = s.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  if (!s || s.length > 200) return null;
  if (!SAFE_SEGMENT.test(s)) return null;
  return s;
}

export function isSafeBlogPathSlug(slug: string): boolean {
  return canonicalBlogSlug(slug) !== null;
}
