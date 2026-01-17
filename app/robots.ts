import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/', // Disallow sanity studio
    },
    sitemap: 'https://nepatronix.com/sitemap.xml',
  }
}
