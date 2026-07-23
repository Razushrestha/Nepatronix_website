import { connectToDatabase } from '@/lib/mongodb'
import { Testimonial } from '@/lib/models'

/** Google-style review data used for AggregateRating + Review JSON-LD. */
export interface OrgReview {
  name: string
  role: string
  rating: number
  review: string
}

export interface OrgReviewSchema {
  aggregateRating?: Record<string, unknown>
  reviews: Record<string, unknown>[]
  reviewCount: number
}

/**
 * Reads testimonials from MongoDB and returns schema.org fragments for the
 * organization JSON-LD graph. Fails soft — empty schema if DB is unreachable.
 */
export async function getOrgReviewSchema(maxReviews = 5): Promise<OrgReviewSchema> {
  try {
    await connectToDatabase()
    const docs = await Testimonial.find()
      .sort({ order: 1, createdAt: 1 })
      .lean<OrgReview[]>()

    const valid = (docs || [])
      .filter((d) => d?.name && d?.review && (d.review || '').trim().length > 8)
      .map((d) => ({
        name: String(d.name).trim(),
        role: String(d.role || '').trim(),
        rating: Number(d.rating) || 5,
        review: String(d.review).trim(),
      }))

    if (!valid.length) return { reviews: [], reviewCount: 0 }

    const total = valid.reduce((sum, r) => sum + r.rating, 0)
    const avg = total / valid.length

    const aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: String(valid.length),
      bestRating: '5',
      worstRating: '1',
    }

    const reviews = valid.slice(0, maxReviews).map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5',
      },
      author: { '@type': 'Person', name: r.name },
      reviewBody: r.review.slice(0, 500),
      ...(r.role ? { publisher: { '@type': 'Organization', name: r.role } } : {}),
    }))

    return { aggregateRating, reviews, reviewCount: valid.length }
  } catch {
    return { reviews: [], reviewCount: 0 }
  }
}
