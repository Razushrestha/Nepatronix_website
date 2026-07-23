import { MetadataRoute } from 'next'

const PRIVATE_PATHS = [
  '/admin',
  '/admin/',
  '/api/',
  '/hr',
  '/hr/',
  '/attendance',
  '/verify-certificate/', // per-UID pages only; the /verify-certificate hub is still crawlable
]

/** Public API endpoints intended for AI / partner ingestion (whitelist over `/api/` disallow). */
const PUBLIC_API_ALLOW = ['/api/public/feed.json']

/** Search engines + AI answer engines we explicitly allow. */
const AI_AND_SEARCH_BOTS = [
  // Classic search
  'Googlebot',
  'Googlebot-Image',
  'Bingbot',
  'DuckDuckBot',
  'YandexBot',
  // AI answer engines & LLM crawlers
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Amazonbot',
  'Bytespider',
  'cohere-ai',
  'Diffbot',
  'YouBot',
  'Kagibot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', ...PUBLIC_API_ALLOW],
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_AND_SEARCH_BOTS,
        allow: ['/', ...PUBLIC_API_ALLOW],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: [
      'https://nepatronix.org/sitemap.xml',
    ],
    host: 'https://nepatronix.org',
  }
}
