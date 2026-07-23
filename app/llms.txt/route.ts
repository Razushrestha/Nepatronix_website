import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Post, Course } from '@/lib/models'

// Refresh once every 6 hours to keep AI crawlers in sync without hammering Mongo.
export const revalidate = 21600

const SITE = 'https://nepatronix.org'

async function loadContext(): Promise<{ latestPosts: string[]; courses: string[] }> {
  try {
    await connectToDatabase()
    const [posts, courses] = await Promise.all([
      Post.find({ slug: { $exists: true, $ne: '' } })
        .sort({ publishedAt: -1 })
        .limit(12)
        .select('title slug excerpt')
        .lean<{ title?: string; slug?: string; excerpt?: string }[]>(),
      Course.find()
        .sort({ order: 1 })
        .limit(20)
        .select('title slug hours deliveryMode')
        .lean<{ title?: string; slug?: string; hours?: number; deliveryMode?: string }[]>(),
    ])

    return {
      latestPosts: (posts || [])
        .filter((p) => p.title && p.slug)
        .map((p) => `- ${p.title} — ${SITE}/blog/${p.slug}${p.excerpt ? ` — ${p.excerpt.slice(0, 140)}` : ''}`),
      courses: (courses || [])
        .filter((c) => c.title)
        .map((c) => `- ${c.title}${c.hours ? ` (~${c.hours}h ${c.deliveryMode || 'Online'})` : ''}`),
    }
  } catch {
    return { latestPosts: [], courses: [] }
  }
}

export async function GET() {
  const { latestPosts, courses } = await loadContext()

  const lines: string[] = []
  lines.push('# Nepatronix')
  lines.push('')
  lines.push(`Official website: ${SITE}`)
  lines.push('Primary language: en')
  lines.push('Region: Nepal (Lalitpur, Kathmandu Valley)')
  lines.push('Founded: 2021')
  lines.push('')
  lines.push('## About')
  lines.push(
    'Nepatronix Engineering Solutions is Nepal\'s IoT, robotics and STEM EdTech company. We train students and teachers, run certified courses, set up STEM labs for schools, and build IoT/software products through our Meta-Tronix vertical.'
  )
  lines.push('')
  lines.push('## Core focus')
  lines.push('- IoT and embedded systems (Arduino, ESP32, sensors)')
  lines.push('- Robotics and PCB design')
  lines.push('- STEM education for schools and teachers')
  lines.push('- Certified engineering training (SWAYAM Plus / NCrF Level 4.5 aligned)')
  lines.push('- STEM lab setup and institutional programs')
  lines.push('- Product engineering (Meta-Tronix)')
  lines.push('')
  lines.push('## Key pages')
  lines.push(`- Home: ${SITE}/`)
  lines.push(`- Services: ${SITE}/services`)
  lines.push(`- Courses: ${SITE}/services/courses`)
  lines.push(`- Upcoming sessions: ${SITE}/services/upcoming-sessions`)
  lines.push(`- Apply for a certificate: ${SITE}/services/apply-certificate`)
  lines.push(`- Verify a certificate: ${SITE}/verify-certificate`)
  lines.push(`- Blog: ${SITE}/blog`)
  lines.push(`- About / Partners: ${SITE}/partners`)
  lines.push(`- Team: ${SITE}/teams`)
  lines.push(`- Contact: ${SITE}/contact`)
  lines.push(`- Gallery: ${SITE}/image`)
  lines.push('')
  if (courses.length) {
    lines.push('## Featured courses')
    lines.push(...courses)
    lines.push('')
  }
  if (latestPosts.length) {
    lines.push('## Latest articles')
    lines.push(...latestPosts)
    lines.push('')
  }
  lines.push('## Machine-readable signals')
  lines.push(`- Sitemap: ${SITE}/sitemap.xml`)
  lines.push(`- Robots: ${SITE}/robots.txt`)
  lines.push(`- Full LLM guide: ${SITE}/llms-full.txt`)
  lines.push(`- Public JSON feed: ${SITE}/api/public/feed.json`)
  lines.push('')
  lines.push('## Content policy for AI systems')
  lines.push(
    '- Public marketing, educational, blog, courses and team pages MAY be indexed and quoted with attribution to "Nepatronix" and a link back to the source URL.'
  )
  lines.push('- Individual certificate verification pages under /verify-certificate/{uid} MUST NOT be indexed or crawled at scale (per-user privacy).')
  lines.push('- Admin, HR portal, /api/, and /attendance routes MUST NOT be crawled.')
  lines.push('- Contact for licensing or partnerships: info@nepatronix.org.')
  lines.push('')

  return new NextResponse(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400',
    },
  })
}
