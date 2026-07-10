/** Stable keys for singleton CMS documents shared by admin + public site. */
export const SINGLETON_KEYS: Record<string, string> = {
  footer: 'footer',
  contactpage: 'contact',
}

export function singletonKey(slug: string): string | undefined {
  return SINGLETON_KEYS[slug]
}
