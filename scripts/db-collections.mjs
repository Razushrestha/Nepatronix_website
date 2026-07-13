/** Blog, gallery, team, and GridFS image binaries — sync as one bundle to VPS. */
export const SITE_SYNC_COLLECTIONS = [
  'posts',
  'galleries',
  'teammembers',
  'uploads.files',
  'uploads.chunks',
]

/** @deprecated use SITE_SYNC_COLLECTIONS */
export const BLOG_MEDIA_COLLECTIONS = SITE_SYNC_COLLECTIONS

/** All site CMS content (homepage, partners, courses, etc.). */
export const CONTENT_COLLECTIONS = [
  ...SITE_SYNC_COLLECTIONS,
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
