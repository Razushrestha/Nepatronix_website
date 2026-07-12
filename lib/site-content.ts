import { connectToDatabase } from '@/lib/mongodb'
import {
  Partner,
  School,
  Recognition,
  Stat,
  Testimonial,
  Feature,
  Course,
  HeroSlide,
} from '@/lib/models'
import { resolveImageUrl } from '@/lib/content-image'
import {
  features as staticFeatures,
  stats as staticStats,
  testimonials as staticTestimonials,
  courses as staticCourses,
} from '@/app/(site)/data'
import type { Feature, Stat, Testimonial, Course } from '@/app/(site)/data'

export interface LogoItem {
  name: string
  logo: string
}

export interface HomeTestimonial {
  name: string
  role: string
  rating: number
  review: string
}

function logoFromDoc(name?: string, image?: { url?: string }): LogoItem | null {
  const logo = resolveImageUrl(image)
  if (!name?.trim() || !logo) return null
  return { name: name.trim(), logo }
}

export interface HeroSlideContent {
  title: string
  eyebrow: string
  description: string
  imageUrl?: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export async function getPartnerLogos(type?: string): Promise<LogoItem[]> {
  await connectToDatabase()
  let docs = await Partner.find(type ? { type } : {})
    .sort({ order: 1, createdAt: 1 })
    .lean()
  if (!docs.length && type) {
    docs = await Partner.find().sort({ order: 1, createdAt: 1 }).lean()
  }
  const items = docs.flatMap((d) => {
    const item = logoFromDoc(d.name, d.logo)
    return item ? [item] : []
  })
  return items.length ? items : getDefaultPartners()
}

export async function getRecognitionLogos(): Promise<LogoItem[]> {
  await connectToDatabase()
  const docs = await Recognition.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs.flatMap((d) => {
    const item = logoFromDoc(d.name, d.logo)
    return item ? [item] : []
  })
  return items.length ? items : getDefaultRecognitions()
}

export async function getSchoolLogos(): Promise<LogoItem[]> {
  await connectToDatabase()
  const docs = await School.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs.flatMap((d) => {
    const item = logoFromDoc(d.name, d.logo)
    return item ? [item] : []
  })
  return items.length ? items : getDefaultSchools()
}

export async function getHomeStats(): Promise<Stat[]> {
  await connectToDatabase()
  const docs = await Stat.find().sort({ order: 1, createdAt: 1 }).lean()
  const valid = docs.filter((d) => d.label?.trim() && d.value?.trim())
  if (!valid.length) return staticStats
  return valid.map((d, i) => ({
    id: i + 1,
    label: d.label || '',
    value: d.value || '',
    detail: d.detail || '',
  }))
}

export async function getHomeFeatures(): Promise<Feature[]> {
  await connectToDatabase()
  const docs = await Feature.find().sort({ order: 1, createdAt: 1 }).lean()
  if (!docs.length) return staticFeatures
  return docs.map((d, i) => ({
    id: i + 1,
    title: d.title || '',
    description: d.description || '',
    icon: d.icon || d.iconImage?.url || '★',
  }))
}

export async function getHomeTestimonials(): Promise<HomeTestimonial[]> {
  await connectToDatabase()
  const docs = await Testimonial.find().sort({ order: 1, createdAt: 1 }).lean()
  if (!docs.length) {
    return staticTestimonials.map((t) => ({
      name: t.name,
      role: t.role,
      rating: 5,
      review: t.quote,
    }))
  }
  return docs.map((d) => ({
    name: d.name || '',
    role: d.role || '',
    rating: d.rating || 5,
    review: d.review || '',
  }))
}

export async function getHomeCourseShowcase(): Promise<Course[]> {
  await connectToDatabase()
  const docs = await Course.find({ popular: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(6)
    .lean()
  if (!docs.length) return staticCourses.slice(0, 3)
  return docs.map((d, i) => ({
    id: i + 1,
    title: d.title || '',
    category: d.level || 'STEM',
    level: (d.level as Course['level']) || 'Beginner',
    duration: d.duration || `${d.hours || 0} hours`,
    highlights: d.highlights?.length ? d.highlights : ['Hands-on STEM training'],
  }))
}

function getDefaultPartners(): LogoItem[] {
  return [
    { name: 'Gyan Bazzar', logo: '/partner/gyanbazzar.png' },
    { name: 'Drone Hub', logo: '/partner/dronehub.png' },
    { name: 'diyo.ai', logo: '/partner/diyo.ai.png' },
    { name: 'Edtra', logo: '/partner/edtra.png' },
    { name: 'Himalayan Solution', logo: '/partner/himalayansolution.png' },
    { name: 'Thokbikreta', logo: '/partner/Thokbikrita.png' },
  ]
}

function getDefaultRecognitions(): LogoItem[] {
  return [
    { name: 'ICT Startup Award', logo: '/recognition/ICT.png' },
    { name: 'Government of Nepal', logo: '/recognition/NepalGov.png' },
    { name: 'Kathmandu University', logo: '/recognition/KU.png' },
  ]
}

function getDefaultSchools(): LogoItem[] {
  return [
    { name: 'BIT', logo: '/school_College/BIT-removebg-preview.png' },
    { name: 'Prime College', logo: '/school_College/primecollege-removebg-preview.png' },
    { name: 'Texas College', logo: '/school_College/texas_college.png' },
  ]
}

export async function getHeroSlide(): Promise<HeroSlideContent | null> {
  await connectToDatabase()
  const slide = await HeroSlide.findOne().sort({ order: 1, createdAt: 1 }).lean()
  if (!slide) return null
  return {
    title: slide.title || '',
    eyebrow: slide.eyebrow || '',
    description: slide.description || '',
    imageUrl: resolveImageUrl(slide.image) || undefined,
    primaryCtaLabel: slide.primaryCtaLabel || 'Explore Programs',
    primaryCtaHref: slide.primaryCtaHref || '/services',
    secondaryCtaLabel: slide.secondaryCtaLabel || 'Partner With Us',
    secondaryCtaHref: slide.secondaryCtaHref || '/partners',
  }
}

export async function getHomePageContent() {
  try {
    const [stats, partners, recognitions, schools, testimonials, hero] = await Promise.all([
      getHomeStats(),
      getPartnerLogos('trusted'),
      getRecognitionLogos(),
      getSchoolLogos(),
      getHomeTestimonials(),
      getHeroSlide(),
    ])
    return { stats, partners, recognitions, schools, testimonials, hero }
  } catch (err) {
    console.warn('Homepage: MongoDB unavailable, using static fallbacks.', err)
    return {
      stats: staticStats,
      partners: getDefaultPartners(),
      recognitions: getDefaultRecognitions(),
      schools: getDefaultSchools(),
      testimonials: staticTestimonials.map((t) => ({
        name: t.name,
        role: t.role,
        rating: 5,
        review: t.quote,
      })),
      hero: null as HeroSlideContent | null,
    }
  }
}
