import { connectToDatabase } from '@/lib/mongodb'
import {
  Course,
  TeamMember,
  ContactPage,
  Stat,
  Post,
} from '@/lib/models'
import { aboutUsData, ourServices, servicesPageData, stats as staticStats } from '@/app/(site)/data'
import type { ChatKnowledge } from './types'

const CACHE_TTL_MS = 5 * 60 * 1000
let cache: { data: ChatKnowledge; at: number } | null = null

function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'
}

export async function loadChatKnowledge(): Promise<ChatKnowledge> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data
  }

  const url = baseUrl()

  let contact = {
    email: 'info@nepatronix.org',
    phone: '+977-9803661701',
    address: 'Tinkune, Kathmandu, Nepal',
    hours: 'Sun–Fri: 9:00 AM – 6:00 PM',
  }
  let courses: ChatKnowledge['courses'] = []
  let upcomingCourses: ChatKnowledge['upcomingCourses'] = []
  let team: ChatKnowledge['team'] = []
  let blogPosts: ChatKnowledge['blogPosts'] = []
  let stats = staticStats.map((s) => ({
    label: s.label,
    value: s.value,
    detail: s.detail,
  }))

  try {
    await connectToDatabase()

    const [contactDoc, courseDocs, teamDocs, statDocs, postDocs] = await Promise.all([
      ContactPage.findOne({ key: 'contact' }).lean(),
      Course.find().sort({ order: 1, title: 1 }).lean(),
      TeamMember.find().sort({ order: 1, name: 1 }).lean(),
      Stat.find().sort({ order: 1 }).lean(),
      Post.find({ publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 })
        .limit(6)
        .select('title slug excerpt')
        .lean(),
    ])

    if (contactDoc?.contactDetails) {
      contact = {
        email: contactDoc.contactDetails.email || contact.email,
        phone: contactDoc.contactDetails.phone || contact.phone,
        address: contactDoc.contactDetails.address || contact.address,
        hours: contactDoc.contactDetails.hours || contact.hours,
      }
    }

    if (statDocs.length) {
      stats = statDocs.map((s) => ({
        label: s.label || '',
        value: s.value || '',
        detail: s.detail || '',
      }))
    }

    courses = courseDocs
      .filter((c) => !c.isUpcoming)
      .map((c) => ({
        title: c.title || '',
        slug: c.slug,
        level: c.level,
        duration: c.duration,
        hours: c.hours,
        price: c.price,
        priceUnit: c.priceUnit,
        isFree: c.isFree,
        deliveryMode: c.deliveryMode,
        highlights: c.highlights,
      }))

    upcomingCourses = courseDocs
      .filter((c) => c.isUpcoming)
      .map((c) => ({
        title: c.title || '',
        slug: c.slug,
        level: c.level,
        duration: c.duration,
        hours: c.hours,
        isFree: c.isFree,
        isUpcoming: true,
        sessionVenue: c.sessionVenue,
        deliveryMode: c.deliveryMode,
      }))

    team = teamDocs.map((m) => ({
      name: m.name || '',
      title: m.title,
      role: m.role,
    }))

    blogPosts = postDocs.map((p) => ({
      title: p.title || '',
      slug: p.slug,
      excerpt: p.excerpt,
    }))
  } catch (err) {
    console.error('Chat knowledge DB load failed, using static fallbacks:', err)
  }

  const stemEducation = ourServices.find((s) => s.id === 'stem-education')
  const stemLab = ourServices.find((s) => s.id === 'stem-lab-setup')

  const data: ChatKnowledge = {
    baseUrl: url,
    company: {
      name: 'NepaTronix Engineering Solutions',
      founded: '2021',
      location: 'Tinkune, Kathmandu, Nepal',
      about: aboutUsData.about,
      mission: aboutUsData.mission,
      vision: aboutUsData.vision,
    },
    founder: {
      name: aboutUsData.ceo.name,
      role: aboutUsData.ceo.role,
      whatsapp: '+977 9803661701',
    },
    contact,
    stats,
    services: ourServices.map((s) => ({
      id: s.id,
      title: s.title,
      tagline: s.tagline,
      description: s.description,
      url: `${url}/services/${s.id}`,
    })),
    labTiers:
      stemLab?.labTiers?.map((t) => ({
        name: t.name,
        focus: t.focus,
        features: t.features,
      })) || [],
    certifications:
      stemEducation?.certifications?.map((c) => ({
        name: c.name,
        hrs: c.hrs,
        delivery: c.delivery,
      })) || [],
    courses,
    upcomingCourses,
    team,
    blogPosts,
    pages: [
      { label: 'Home', path: '/', description: 'Overview of Nepatronix STEM programs and impact' },
      { label: 'Services', path: '/services', description: 'All engineering and education services' },
      { label: 'Courses', path: '/services/courses', description: 'Browse and enroll in training programs' },
      { label: 'Upcoming Sessions', path: '/services/upcoming-sessions', description: 'Scheduled batches and workshops' },
      { label: 'Apply for Certificate', path: '/services/apply-certificate', description: 'Submit certificate applications' },
      { label: 'Verify Certificate', path: '/verify-certificate', description: 'Check certificate authenticity by UID' },
      { label: 'Blog', path: '/blog', description: 'Articles on STEM, IoT, and robotics' },
      { label: 'Gallery', path: '/image', description: 'Photos from workshops and events' },
      { label: 'Team', path: '/teams', description: 'Leadership and expert mentors' },
      { label: 'Partners', path: '/partners', description: 'Collaborations and partner network' },
      { label: 'Contact', path: '/contact', description: 'Reach our team directly' },
    ],
    whyChooseUs: servicesPageData.whyChooseUs,
    recognizedBy: servicesPageData.recognizedBy,
  }

  cache = { data, at: Date.now() }
  return data
}

/** Clear cache after admin content updates (optional hook). */
export function invalidateChatKnowledgeCache() {
  cache = null
}
