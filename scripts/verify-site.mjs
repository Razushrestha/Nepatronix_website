/**
 * Smoke-test public pages, APIs, and admin auth guards.
 * Usage: node scripts/verify-site.mjs [baseUrl]
 */

const BASE = process.argv[2] || 'http://localhost:3000'

const publicPages = [
  '/partners',
  '/teams',
  '/blog',
  '/image',
  '/services',
  '/services/courses',
  '/services/upcoming-sessions',
  '/services/apply-certificate',
  '/verify-certificate',
  '/services/stem-education',
  '/services/stem-lab-setup',
  '/services/institutional-programs',
  '/services/product-engineering',
  '/admin/login',
]

const dynamicPages = [
  '/services/courses/view/1',
  '/services/courses/watch/1',
  '/sitemap.xml',
  '/robots.txt',
]

const publicApis = [
  { path: '/api/blog-url-manifest', method: 'GET', expect: [200] },
  { path: '/api/track', method: 'POST', body: { path: '/test' }, expect: [200, 204] },
  {
    path: '/api/subscribe',
    method: 'POST',
    body: { email: `test-${Date.now()}@example.com` },
    expect: [200, 201],
  },
  {
    path: '/api/contact',
    method: 'POST',
    body: { name: 'Test', email: 'test@example.com', message: 'Hello' },
    expect: [200, 201],
  },
  {
    path: '/api/enroll',
    method: 'POST',
    body: {
      fullName: 'Test User',
      email: `enroll-${Date.now()}@example.com`,
      phone: '9800000000',
      courseName: 'Test Course',
    },
    expect: [200, 201],
  },
  { path: '/api/chat', method: 'POST', body: { message: 'What courses do you offer?' }, expect: [200] },
  { path: '/api/chat', method: 'POST', body: { message: 'Contact details' }, expect: [200] },
  { path: '/api/chat', method: 'POST', body: { message: 'How to verify certificate?' }, expect: [200] },
]

/** Every admin-managed collection — must return 401 without session. */
const adminCollections = [
  'enrollments',
  'certifications',
  'contactforms',
  'subscribers',
  'courses',
  'posts',
  'galleries',
  'teammembers',
  'partners',
  'schools',
  'testimonials',
  'recognitions',
  'heroslides',
  'features',
  'stats',
  'homeservices',
  'accreditations',
  'incubators',
  'portfolioitems',
  'homepage',
  'coursepdfs',
  'coursevideos',
  'footer',
  'contactpage',
  'adminusers',
]

const protectedAdminApis = [
  '/api/admin/stats',
  '/api/admin/analytics',
  ...adminCollections.map((c) => `/api/admin/collections/${c}`),
]

async function checkPage(path, { mustContain } = {}) {
  const url = `${BASE}${path}`
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const ok = res.status >= 200 && res.status < 400
    let html = ''
    if (mustContain?.length && ok) {
      html = await res.text()
    }
    const missing = mustContain?.filter((s) => !html.includes(s)) ?? []
    const contentOk = !missing.length
    return {
      path,
      status: res.status,
      ok: ok && contentOk,
      error: !ok ? `HTTP ${res.status}` : missing.length ? `missing: ${missing.join(', ')}` : null,
    }
  } catch (err) {
    return { path, status: 0, ok: false, error: err.message }
  }
}

async function checkApi({ path, method, body, expect, headers }) {
  const url = `${BASE}${path}`
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const ok = expect.includes(res.status)
    return {
      path,
      method,
      status: res.status,
      ok,
      error: ok ? null : `expected ${expect.join('|')}, got ${res.status}`,
    }
  } catch (err) {
    return { path, method, status: 0, ok: false, error: err.message }
  }
}

async function fetchBlogSlug() {
  try {
    const res = await fetch(`${BASE}/api/blog-url-manifest`)
    if (!res.ok) return null
    const data = await res.json()
    const posts = data?.posts || data?.urls || data?.paths || []
    const first = posts[0]
    if (!first) return null
    if (typeof first === 'string') {
      const m = first.match(/\/blog\/([^/?#]+)/)
      return m?.[1] || null
    }
    if (first.url) {
      const m = String(first.url).match(/\/blog\/([^/?#]+)/)
      return m?.[1] || null
    }
    return first.slug || null
  } catch {
    return null
  }
}

async function main() {
  console.log(`Verifying ${BASE}\n`)

  const pageResults = []
  for (const path of publicPages) {
    pageResults.push(await checkPage(path))
  }

  // Footer always renders (DB or DEFAULT_FOOTER fallback)
  pageResults.push(
    await checkPage('/', { mustContain: ['Nepatronix', '<footer'] })
  )
  pageResults.push(
    await checkPage('/contact', { mustContain: ['Contact'] })
  )

  for (const path of dynamicPages) {
    pageResults.push(await checkPage(path))
  }

  const blogSlug = await fetchBlogSlug()
  if (blogSlug) {
    pageResults.push(await checkPage(`/blog/${blogSlug}`))
    console.log(`  (blog slug found: ${blogSlug})\n`)
  } else {
    console.log('  (no published blog posts — skipping /blog/[slug])\n')
  }

  const apiResults = []
  for (const api of publicApis) {
    apiResults.push(await checkApi(api))
  }

  for (const path of protectedAdminApis) {
    apiResults.push(await checkApi({ path, method: 'GET', expect: [401] }))
  }

  apiResults.push(
    await checkApi({
      path: '/api/admin/upload',
      method: 'POST',
      body: {},
      expect: [401],
    })
  )

  // Wrong admin login must fail
  apiResults.push(
    await checkApi({
      path: '/api/admin/auth',
      method: 'POST',
      body: { email: 'invalid@example.com', password: 'wrong-password' },
      expect: [401],
    })
  )

  const failedPages = pageResults.filter((r) => !r.ok)
  const failedApis = apiResults.filter((r) => !r.ok)

  console.log('Pages:')
  for (const r of pageResults) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.status} ${r.path}${r.error ? ` — ${r.error}` : ''}`)
  }

  console.log('\nAPIs:')
  for (const r of apiResults) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.method} ${r.status} ${r.path}${r.error ? ` — ${r.error}` : ''}`)
  }

  const total = pageResults.length + apiResults.length
  const passed = total - failedPages.length - failedApis.length
  console.log(`\n${passed}/${total} checks passed`)

  if (failedPages.length || failedApis.length) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
