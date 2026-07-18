/** Extract checklist titles from rich-text task descriptions. */
export function parseDescriptionToChecklistItems(html: string): string[] {
  if (!html?.trim()) return []

  const items: string[] = []
  const seen = new Set<string>()

  function add(raw: string) {
    const title = decodeEntities(stripTags(raw))
      .replace(/\s+/g, ' ')
      .trim()
    if (title.length < 2 || title.length > 300) return
    const key = title.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    items.push(title)
  }

  // <li> from ordered/unordered lists (TipTap, Word paste, etc.)
  for (const m of html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    add(m[1])
  }

  // Numbered / bullet lines in plain text (after block breaks)
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, '\n')
  const plain = decodeEntities(stripTags(text))

  for (const line of plain.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (numbered) {
      add(numbered[1])
      continue
    }

    const bullet = trimmed.match(/^[-*•–—]\s+(.+)$/)
    if (bullet) {
      add(bullet[1])
      continue
    }

    // "TO DO" style section headers — skip
    if (/^to\s*do:?$/i.test(trimmed)) continue
    if (/^(tasks?|checklist|steps?):?$/i.test(trimmed)) continue
  }

  return items
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\u00a0/g, ' ')
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}
