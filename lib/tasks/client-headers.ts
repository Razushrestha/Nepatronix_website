/** Client-side HR API context for task module (CMS admin vs employee session). */
let cmsAdminContext = false

export function setTaskCmsAdminContext(active: boolean) {
  cmsAdminContext = active
}

export function taskClientHeaders(): HeadersInit | undefined {
  return cmsAdminContext ? { 'X-HR-Context': 'cms-admin' } : undefined
}
