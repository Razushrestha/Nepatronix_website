import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',          // Sanity CMS Studio
          '/api/',             // API routes
          '/verify-certificate/', // Certificate verification pages (noindex)
          '/image/',           // Image utility page
        ],
      },
    ],
    sitemap: 'https://nepatronix.com/sitemap.xml',
    host: 'https://nepatronix.com',
  }
}
