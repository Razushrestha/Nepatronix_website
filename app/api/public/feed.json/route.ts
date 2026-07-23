import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Post, Course } from '@/lib/models'
import { resolveImageUrl, type ContentImage } from '@/lib/content-image'
import { blogBodyToPlainText } from '@/lib/portable-text'

// Refresh every 30 minutes; safe to cache aggressively.
export const revalidate = 1800

const SITE = 'https://nepatronix.org'

interface PostDoc {
  _id: unknown
  title?: string
  slug?: string
  excerpt?: string
  body?: unknown
  publishedAt?: Date | string
  updatedAt?: Date | string
  categories?: string[]
  tags?: string[]
  author?: string
  mainImage?: ContentImage
  ogImage?: ContentImage
  noIndex?: boolean
}

interface CourseDoc {
  _id: unknown
  title?: string
  slug?: string
  hours?: number
  price?: number
  priceUnit?: string
  deliveryMode?: string
  examMode?: string
  isFree?: boolean
  order?: number
}

async function loadFeedData(): Promise<{ posts: PostDoc[]; courses: CourseDoc[] }> {
  try {
    await connectToDatabase()
    const [posts, courses] = await Promise.all([
      Post.find({ slug: { $exists: true, $ne: '' }, noIndex: { $ne: true } })
        .sort({ publishedAt: -1 })
        .limit(50)
        .lean<PostDoc[]>(),
      Course.find().sort({ order: 1 }).lean<CourseDoc[]>(),
    ])
    return { posts: posts || [], courses: courses || [] }
  } catch {
    return { posts: [], courses: [] }
  }
}

function iso(d: Date | string | undefined) {
  if (!d) return undefined
  try {
    return new Date(d).toISOString()
  } catch {
    return undefined
  }
}

export async function GET() {
  const { posts, courses } = await loadFeedData()

  const feed = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    organization: {
      name: 'Nepatronix Engineering Solutions',
      legalName: 'Nepatronix Engineering Solution Pvt. Ltd.',
      url: SITE,
      founded: '2021',
      email: 'info@nepatronix.org',
      phone: '+977-9803661701',
      address: {
        streetAddress: 'Kupondole',
        addressLocality: 'Lalitpur',
        addressRegion: 'Bagmati',
        addressCountry: 'NP',
      },
      focus: [
        'STEM education',
        'IoT training',
        'Robotics',
        'Arduino',
        'ESP32',
        'PCB design',
        'STEM lab setup',
        'Product engineering (Meta-Tronix)',
      ],
      certifications: [
        'IIT Madras SWAYAM Plus (selected programs)',
        'NCrF Level 4.5 (selected programs)',
        'Nepatronix Certificate of Completion',
      ],
      sameAs: [
        'https://www.facebook.com/NepaTronixx',
        'https://linkedin.com/company/nepatronix',
      ],
    },
    posts: posts
      .filter((p) => p.title && p.slug)
      .map((p) => ({
        title: p.title,
        url: `${SITE}/blog/${p.slug}`,
        excerpt: p.excerpt || undefined,
        summary: blogBodyToPlainText(p.body).slice(0, 500) || undefined,
        publishedAt: iso(p.publishedAt),
        updatedAt: iso(p.updatedAt),
        categories: p.categories || [],
        tags: p.tags || [],
        author: p.author || 'Nepatronix Team',
        image: resolveImageUrl(p.ogImage) || resolveImageUrl(p.mainImage) || undefined,
      })),
    courses: courses
      .filter((c) => c.title)
      .map((c) => ({
        title: c.title,
        url: c.slug ? `${SITE}/services/courses/view/${c.slug}` : `${SITE}/services/courses`,
        hours: c.hours || undefined,
        deliveryMode: c.deliveryMode || 'Online',
        examMode: c.examMode || 'Online',
        price: c.isFree ? 'Free' : c.price ? { amount: c.price, currency: 'NPR', unit: c.priceUnit || 'per person' } : undefined,
        isFree: !!c.isFree,
      })),
    canonicalPages: [
      `${SITE}/`,
      `${SITE}/services`,
      `${SITE}/services/courses`,
      `${SITE}/services/apply-certificate`,
      `${SITE}/verify-certificate`,
      `${SITE}/partners`,
      `${SITE}/teams`,
      `${SITE}/blog`,
      `${SITE}/contact`,
    ],
    sitemap: `${SITE}/sitemap.xml`,
    llmsTxt: `${SITE}/llms.txt`,
    llmsFullTxt: `${SITE}/llms-full.txt`,
  }

  return NextResponse.json(feed, {
    headers: {
      'cache-control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=3600',
      'access-control-allow-origin': '*',
    },
  })
}
