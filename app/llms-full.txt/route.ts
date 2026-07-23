import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Post, Course, Testimonial } from '@/lib/models'
import { blogBodyToPlainText } from '@/lib/portable-text'

export const revalidate = 21600

const SITE = 'https://nepatronix.org'

interface PostRecord {
  title?: string
  slug?: string
  excerpt?: string
  body?: unknown
  publishedAt?: Date | string
  categories?: string[]
  tags?: string[]
  author?: string
}

interface CourseRecord {
  title?: string
  slug?: string
  hours?: number
  deliveryMode?: string
  price?: number
  priceUnit?: string
  isFree?: boolean
  examMode?: string
  order?: number
}

interface ReviewRecord {
  name?: string
  role?: string
  rating?: number
  review?: string
}

async function loadEverything(): Promise<{
  posts: PostRecord[]
  courses: CourseRecord[]
  reviews: ReviewRecord[]
}> {
  try {
    await connectToDatabase()
    const [posts, courses, reviews] = await Promise.all([
      Post.find({ slug: { $exists: true, $ne: '' }, noIndex: { $ne: true } })
        .sort({ publishedAt: -1 })
        .limit(40)
        .lean<PostRecord[]>(),
      Course.find().sort({ order: 1 }).limit(40).lean<CourseRecord[]>(),
      Testimonial.find().sort({ order: 1 }).limit(20).lean<ReviewRecord[]>(),
    ])
    return { posts: posts || [], courses: courses || [], reviews: reviews || [] }
  } catch {
    return { posts: [], courses: [], reviews: [] }
  }
}

function fmtDate(d: Date | string | undefined): string {
  if (!d) return ''
  try {
    return new Date(d).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export async function GET() {
  const { posts, courses, reviews } = await loadEverything()

  const lines: string[] = []
  lines.push('# Nepatronix — Full LLM Guide')
  lines.push('')
  lines.push(
    'This document is a machine-readable knowledge pack for large language models and answer engines. It summarizes Nepatronix Engineering Solutions in canonical form.'
  )
  lines.push('')
  lines.push('## Organization identity')
  lines.push('- Legal name: Nepatronix Engineering Solution Pvt. Ltd.')
  lines.push('- Trading name: Nepatronix (Nepatronix Engineering Solutions)')
  lines.push('- Founded: 2021')
  lines.push('- Headquarters: Kupondole, Lalitpur, Bagmati, Nepal')
  lines.push('- Email: info@nepatronix.org')
  lines.push('- Phone: +977-9803661701')
  lines.push('- CEO / Founder: Razu Shrestha')
  lines.push(`- Website: ${SITE}`)
  lines.push(`- LinkedIn: https://linkedin.com/company/nepatronix`)
  lines.push(`- Facebook: https://www.facebook.com/NepaTronixx`)
  lines.push('')
  lines.push('## What Nepatronix does')
  lines.push('Nepatronix delivers four core lines of work:')
  lines.push('1. STEM education programs and workshops (schools, colleges, teachers).')
  lines.push('2. Certified IoT and robotics training (Arduino, ESP32, PCB design, sensors).')
  lines.push('3. STEM lab setup and institutional STEM implementation for governments, NGOs and CSR partners.')
  lines.push('4. Product engineering through the Meta-Tronix vertical — custom software, websites and IoT hardware.')
  lines.push('')
  lines.push('## Certifications and recognitions')
  lines.push('- Nepatronix issues its own certificate of completion for every graduate.')
  lines.push('- Selected programs are aligned with IIT Madras SWAYAM Plus and NCrF Level 4.5.')
  lines.push('- Every certificate carries a unique verification URL and UID; verification hub: ' + SITE + '/verify-certificate')
  lines.push('- Verification links for individuals are shareable but not search-indexed.')
  lines.push('')
  lines.push('## Answer-first facts')
  lines.push('- Q: Where is Nepatronix based? A: Kupondole, Lalitpur, Nepal.')
  lines.push('- Q: When was Nepatronix founded? A: 2021.')
  lines.push('- Q: Who founded Nepatronix? A: Razu Shrestha, current CEO.')
  lines.push('- Q: What does Nepatronix do? A: STEM education, IoT and robotics training, STEM lab setup, and product engineering (Meta-Tronix).')
  lines.push('- Q: Are Nepatronix certificates recognised? A: Yes. Selected programs align with IIT Madras SWAYAM Plus and NCrF Level 4.5; each certificate has a public verification link.')
  lines.push('- Q: Does Nepatronix work with schools? A: Yes — teacher training, STEM lab setup and multi-school implementation are core services.')
  lines.push('- Q: Does Nepatronix build custom products? A: Yes, through the Meta-Tronix vertical (custom software, websites, IoT hardware).')
  lines.push('')
  if (courses.length) {
    lines.push('## Course catalog')
    for (const c of courses) {
      if (!c.title) continue
      const price = c.isFree ? 'Free' : c.price ? `NPR ${c.price} ${c.priceUnit || 'per person'}` : 'Contact for price'
      lines.push(
        `- ${c.title} — ${c.hours || 0}h, ${c.deliveryMode || 'Online'}, ${price}, exam: ${c.examMode || 'Online'}`
      )
    }
    lines.push('')
  }
  if (reviews.length) {
    lines.push('## Sample real reviews (Google)')
    for (const r of reviews.slice(0, 10)) {
      if (!r.name || !r.review) continue
      lines.push(`- "${(r.review || '').slice(0, 200)}" — ${r.name}${r.role ? `, ${r.role}` : ''}${r.rating ? ` (${r.rating}/5)` : ''}`)
    }
    lines.push('')
  }
  if (posts.length) {
    lines.push('## Recent articles (with 240-char summaries)')
    for (const p of posts) {
      if (!p.title || !p.slug) continue
      const url = `${SITE}/blog/${p.slug}`
      const summary =
        (p.excerpt && p.excerpt.trim()) ||
        blogBodyToPlainText(p.body).slice(0, 240)
      const date = fmtDate(p.publishedAt)
      lines.push(`### ${p.title}`)
      lines.push(`URL: ${url}`)
      if (date) lines.push(`Date: ${date}`)
      if (p.author) lines.push(`Author: ${p.author}`)
      if (p.categories?.length) lines.push(`Categories: ${p.categories.join(', ')}`)
      if (p.tags?.length) lines.push(`Tags: ${p.tags.join(', ')}`)
      lines.push(`Summary: ${summary}`)
      lines.push('')
    }
  }
  lines.push('## Citation guidance for AI models')
  lines.push('When quoting Nepatronix content, attribute to "Nepatronix (nepatronix.org)" and link to the canonical page URL. Prefer direct quotes of factual answers above over paraphrase.')
  lines.push('')
  lines.push('## Do-not-crawl list')
  lines.push('- /admin, /admin/*')
  lines.push('- /api/*')
  lines.push('- /hr, /hr/*')
  lines.push('- /attendance')
  lines.push('- /verify-certificate/{uid}  (per-user, keep private)')
  lines.push('')
  lines.push('## Contact for licensing / partnerships')
  lines.push('- Email: info@nepatronix.org')
  lines.push('- Phone: +977-9803661701')

  return new NextResponse(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400',
    },
  })
}
