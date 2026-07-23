/**
 * Known Nepatronix authors. Anchoring author strings from Mongo posts to real
 * Person entities strengthens E-E-A-T signals for Google + AI answer engines.
 */
export interface Author {
  key: string
  name: string
  url: string
  jobTitle?: string
  image?: string
  sameAs?: string[]
  description?: string
  worksFor?: string
}

const AUTHORS: Author[] = [
  {
    key: 'razu-shrestha',
    name: 'Razu Shrestha',
    url: 'https://nepatronix.org/teams#ceo',
    jobTitle: 'CEO & Founder, Nepatronix Engineering Solutions',
    image: 'https://nepatronix.org/Raju%20Shrestha.jpg',
    description:
      'Founder of Nepatronix Engineering Solutions, leading Nepal\'s STEM, IoT and Robotics education programs since 2021.',
    worksFor: 'Nepatronix Engineering Solutions',
    sameAs: [
      'https://www.linkedin.com/in/razu-shrestha-1a732024b/',
      'https://www.facebook.com/NepaTronixx',
    ],
  },
  {
    key: 'nepatronix-team',
    name: 'Nepatronix Team',
    url: 'https://nepatronix.org/teams',
    jobTitle: 'STEM & Engineering Editorial Team',
    image: 'https://nepatronix.org/logo.png',
    description:
      'The Nepatronix Editorial Team publishes technical guides, tutorials and case studies on IoT, robotics and STEM education in Nepal.',
    worksFor: 'Nepatronix Engineering Solutions',
    sameAs: ['https://www.facebook.com/NepaTronixx'],
  },
]

/** Normalize whatever the DB has to an author key. */
function toAuthorKey(raw: string): string {
  return (raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Look up an author by the raw string on a post. Falls back to `Nepatronix Team`. */
export function findAuthorByName(rawName?: string): Author {
  const fallback = AUTHORS.find((a) => a.key === 'nepatronix-team')!
  if (!rawName) return fallback
  const key = toAuthorKey(rawName)
  return (
    AUTHORS.find((a) => a.key === key || toAuthorKey(a.name) === key) ||
    // partial contains match (e.g. "Razu S." → razu-shrestha)
    AUTHORS.find((a) => toAuthorKey(a.name).includes(key) || key.includes(a.key)) ||
    fallback
  )
}

/** Build a schema.org Person node ready to drop into JSON-LD. */
export function authorJsonLd(author: Author): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': author.url,
    name: author.name,
    url: author.url,
    ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
    ...(author.image ? { image: author.image } : {}),
    ...(author.description ? { description: author.description } : {}),
    ...(author.worksFor
      ? {
          worksFor: {
            '@type': 'Organization',
            name: author.worksFor,
            url: 'https://nepatronix.org',
          },
        }
      : {}),
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
  }
}
