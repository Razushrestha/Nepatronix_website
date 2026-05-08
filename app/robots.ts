import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',          // Sanity CMS Studio
          '/admin',            // Dashboard (with or without trailing slash)
          '/admin/',
          '/api/',             // API routes
        ],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/studio/', '/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://nepatronix.org/sitemap.xml',
    host: 'https://nepatronix.org',
  }
}
