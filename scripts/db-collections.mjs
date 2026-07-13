/** All public site content synced from local dev to VPS (blog, gallery, team, courses, images). */
export const SITE_SYNC_COLLECTIONS = [
  'posts',
  'galleries',
  'teammembers',
  'courses',
  'coursepdfs',
  'coursevideos',
  'uploads.files',
  'uploads.chunks',
]

/** @deprecated use SITE_SYNC_COLLECTIONS */
export const BLOG_MEDIA_COLLECTIONS = SITE_SYNC_COLLECTIONS

/** All site CMS content (homepage, partners, enrollments, etc.). */
export const CONTENT_COLLECTIONS = [
  ...SITE_SYNC_COLLECTIONS,
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
