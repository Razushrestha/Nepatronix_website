/** Blog posts, gallery albums, and GridFS image binaries. */
export const BLOG_MEDIA_COLLECTIONS = [
  'posts',
  'galleries',
  'uploads.files',
  'uploads.chunks',
]

/** All site CMS content (homepage, partners, courses, etc.). */
export const CONTENT_COLLECTIONS = [
  ...BLOG_MEDIA_COLLECTIONS,
  'teammembers',
  'courses',
  'coursepdfs',
  'coursevideos',
  'schools',
  'partners',
  'recognitions',
  'testimonials',
  'stats',
  'heroslides',
  'homeservices',
  'accreditations',
  'incubators',
  'portfolioitems',
  'homepages',
  'footers',
  'contactpages',
  'certifications',
  'enrollments',
  'contactforms',
  'subscribers',
]
