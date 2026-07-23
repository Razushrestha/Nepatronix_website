/**
 * Small JSON-LD builders reused across pages so structured data stays consistent.
 * Keep every helper server-safe (no client APIs, no React).
 */

export const SITE_URL = 'https://nepatronix.org'
export const ORG_ID = `${SITE_URL}/#organization`

/** Publisher block that references the sitewide EducationalOrganization node. */
export const PUBLISHER_REF = { '@id': ORG_ID }

/** Publisher block emitted when a page's JSON-LD is read stand-alone (some validators require inline fields). */
export const PUBLISHER_INLINE = {
  '@type': 'Organization',
  name: 'Nepatronix Engineering Solutions',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Build a `BreadcrumbList` schema. Pass the full click-path from home →
 * current page, e.g. `[{ name: 'Home', url: SITE_URL }, { name: 'Blog', … }]`.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export interface FaqQA {
  question: string
  answer: string
}

/** Build a `FAQPage` schema. Only pass Q&As that are ALSO visible on the page. */
export function faqJsonLd(qas: FaqQA[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  }
}

export interface HowToStep {
  name: string
  text: string
  url?: string
  image?: string
}

/** Build a `HowTo` schema for tutorial-style content. */
export function howToJsonLd(input: {
  name: string
  description: string
  totalTime?: string
  steps: HowToStep[]
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    ...(input.image ? { image: input.image } : {}),
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
      ...(step.image ? { image: step.image } : {}),
    })),
  }
}
