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
  HomeService,
  Accreditation,
  Incubator,
  PortfolioItem,
  HomePage,
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

export interface SectionHeading {
  eyebrow: string
  title: string
  description: string
}

export interface HomeAboutContent {
  eyebrow: string
  title: string
  description: string
  paragraph1: string
  paragraph2: string
  tagline: string
  foundedYear: string
  vision: string
  mission: string
}

export interface HomeServiceItem {
  title: string
  description: string
  href: string
  iconKey: string
  colorClass: string
}

export interface AccreditationItem {
  title: string
  badge: string
  description: string
  logoUrl?: string
  badgeTone: 'blue' | 'emerald'
}

export interface IncubatorItem {
  name: string
  logoUrl?: string
}

export interface PortfolioItemContent {
  name: string
  url: string
}

export interface HomePageSettings {
  about: HomeAboutContent
  recognition: SectionHeading
  certification: SectionHeading
  incubation: SectionHeading
  services: SectionHeading
  partners: SectionHeading
  portfolio: SectionHeading
  schools: SectionHeading
  testimonials: SectionHeading
}

function defaultHomePageSettings(): HomePageSettings {
  return {
    about: {
      eyebrow: 'About Us',
      title: 'Our Mission & Vision',
      description: 'Driving innovation through education and technology.',
      paragraph1:
        'Founded in 2021, NepaTronix is a leading Nepal-based IoT, STEM EdTech, and software company committed to closing the gap between education and innovation.',
      paragraph2:
        'Built on the belief that education should inspire creativity, cultivate practical skills, and lead to meaningful invention, NepaTronix operates at the intersection of engineering, education, and social impact. Through smart technology solutions and engaging, hands-on learning programs, we empower students, teachers, and institutions to create real-world change.',
      tagline: 'NepaTronix - Excellence Through Innovation.',
      foundedYear: '2021',
      vision: 'Tech-driven learning that inspires innovation at every level.',
      mission:
        'To simplify and amplify IoT, STEM education through impactful tools, creative content, and innovating real-world technology.',
    },
    recognition: {
      eyebrow: 'Recognition',
      title: 'Trusted by Leading Institutions',
      description:
        'We are proud to be recognized and supported by prestigious organizations across Nepal and India.',
    },
    certification: {
      eyebrow: 'Certification',
      title: 'Certified and Accreditation',
      description:
        'Our STEAM with IoT and Robotics course is accredited by Kathmandu University, with professional pathways through IIT Madras Pravartak.',
    },
    incubation: {
      eyebrow: 'Incubation',
      title: 'Incubated By',
      description:
        'Nepatronix is incubated and supported by leading organizations driving innovation, education, and entrepreneurship across India and Nepal.',
    },
    services: {
      eyebrow: 'Our Services',
      title: 'Comprehensive STEM Solutions',
      description:
        'From education to innovation, we provide end-to-end STEM services for institutions, students, and businesses.',
    },
    partners: {
      eyebrow: 'Partnership Organizations',
      title: 'Trusted Partners & Collaborators',
      description:
        'Building a strong ecosystem through strategic partnerships with leading organizations across technology, education, and financial sectors.',
    },
    portfolio: {
      eyebrow: 'Our Portfolio',
      title: "Websites We've Built",
      description:
        "Explore some of the professional websites and digital solutions we've created for our clients.",
    },
    schools: {
      eyebrow: 'Educational Partners',
      title: 'School & College Collaborations',
      description:
        'Partnering with leading educational institutions to transform STEM education across Nepal and beyond.',
    },
    testimonials: {
      eyebrow: 'Client Reviews',
      title: 'What Our Clients Say',
      description: 'Real Google reviews from students, clients, and partners of Nepatronix.',
    },
  }
}

function defaultHomeServices(): HomeServiceItem[] {
  return [
    {
      title: 'Certified STEM Education',
      href: '/services/stem-education',
      iconKey: 'stem',
      description:
        'Globally aligned STEM programs for students and teachers with hands-on projects and certification',
      colorClass: 'text-blue-600',
    },
    {
      title: 'STEM Lab Setup',
      href: '/services/stem-lab-setup',
      iconKey: 'lab',
      description: 'End-to-end STEM lab design, equipment, installation, and teacher orientation',
      colorClass: 'text-red-600',
    },
    {
      title: 'Product Engineering',
      href: '/services/product-engineering',
      iconKey: 'software',
      description:
        'Custom product engineering, software, and IoT solutions for institutions and businesses',
      colorClass: 'text-emerald-600',
    },
    {
      title: 'Government, NGO & CSR Programs',
      href: '/services/institutional-programs',
      iconKey: 'research',
      description:
        'Large-scale STEM implementation for governments, NGOs, INGOs, and CSR partners',
      colorClass: 'text-purple-600',
    },
  ]
}

function defaultAccreditations(): AccreditationItem[] {
  return [
    {
      title: 'Kathmandu University',
      badge: 'Academic accreditation',
      description: 'Official university accreditation for our comprehensive STEAM curriculum.',
      logoUrl: '/recognition/KU.png',
      badgeTone: 'blue',
    },
    {
      title: 'IIT Madras Pravartak',
      badge: 'Professional certification',
      description: 'Industry-aligned programmes on SWAYAM Plus, including NCrF-aligned intensive training.',
      logoUrl: '/pravartak.png',
      badgeTone: 'emerald',
    },
  ]
}

function defaultIncubators(): IncubatorItem[] {
  return [
    { name: 'IIT Madras', logoUrl: '/incubated/iit-madras.png' },
    { name: 'IITM Pravartak', logoUrl: '/incubated/iitm-pravartak.png' },
    { name: 'Future Front', logoUrl: '/incubated/future-front.png' },
    { name: 'IEDI', logoUrl: '/incubated/iedi.png' },
    { name: 'Glocal After School', logoUrl: '/incubated/glocal-after-school.png' },
  ]
}

function defaultPortfolio(): PortfolioItemContent[] {
  return [
    { name: 'Suryodaya Inc', url: 'https://www.suryodayainc.com/' },
    { name: 'EU Nepal Business Forum', url: 'https://eunepalbusinessforum.eu/' },
    { name: 'Campsite Nepal', url: 'https://campsitenepal.com/' },
    { name: 'Event Solutions', url: 'https://eventsolutions.com/' },
    { name: 'Karnorr', url: 'https://karnorr.com/' },
  ]
}

function mergeSectionHeading(
  defaults: SectionHeading,
  source?: Partial<SectionHeading> | null
): SectionHeading {
  return {
    eyebrow: source?.eyebrow?.trim() || defaults.eyebrow,
    title: source?.title?.trim() || defaults.title,
    description: source?.description?.trim() || defaults.description,
  }
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

function mapStaticTestimonials(): HomeTestimonial[] {
  return staticTestimonials.map((t) => ({
    name: t.name,
    role: t.role,
    rating: t.rating ?? 5,
    review: t.quote,
  }))
}

export async function getHomeTestimonials(): Promise<HomeTestimonial[]> {
  try {
    await connectToDatabase()
    const docs = await Testimonial.find().sort({ order: 1, createdAt: 1 }).lean()
    if (!docs.length) return mapStaticTestimonials()

    const mapped = docs
      .map((d) => ({
        name: d.name || '',
        role: d.role || '',
        rating: d.rating || 5,
        review: (d.review || '').trim(),
      }))
      .filter((t) => t.name && t.review)

    // Prefer curated Google reviews from static data when CMS still has placeholders
    const looksPlaceholder = mapped.some(
      (t) =>
        /novalearn|jordan blake|evelyn park|flux ai|lumencloud/i.test(
          `${t.name} ${t.role} ${t.review}`
        )
    )
    if (looksPlaceholder || mapped.length < 3) return mapStaticTestimonials()
    return mapped
  } catch {
    return mapStaticTestimonials()
  }
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

export async function getHomePageSettings(): Promise<HomePageSettings> {
  const defaults = defaultHomePageSettings()
  await connectToDatabase()
  const doc = await HomePage.findOne({ key: 'home' }).lean()
  if (!doc) return defaults

  const about = doc.about || {}
  return {
    about: {
      eyebrow: about.eyebrow?.trim() || defaults.about.eyebrow,
      title: about.title?.trim() || defaults.about.title,
      description: about.description?.trim() || defaults.about.description,
      paragraph1: about.paragraph1?.trim() || defaults.about.paragraph1,
      paragraph2: about.paragraph2?.trim() || defaults.about.paragraph2,
      tagline: about.tagline?.trim() || defaults.about.tagline,
      foundedYear: about.foundedYear?.trim() || defaults.about.foundedYear,
      vision: about.vision?.trim() || defaults.about.vision,
      mission: about.mission?.trim() || defaults.about.mission,
    },
    recognition: mergeSectionHeading(defaults.recognition, doc.recognition),
    certification: mergeSectionHeading(defaults.certification, doc.certification),
    incubation: mergeSectionHeading(defaults.incubation, doc.incubation),
    services: mergeSectionHeading(defaults.services, doc.services),
    partners: mergeSectionHeading(defaults.partners, doc.partners),
    portfolio: mergeSectionHeading(defaults.portfolio, doc.portfolio),
    schools: mergeSectionHeading(defaults.schools, doc.schools),
    testimonials: mergeSectionHeading(defaults.testimonials, doc.testimonials),
  }
}

export async function getHomeServices(): Promise<HomeServiceItem[]> {
  await connectToDatabase()
  const docs = await HomeService.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs
    .filter((d) => d.title?.trim())
    .map((d) => ({
      title: d.title || '',
      description: d.description || '',
      href: d.href || '/services',
      iconKey: d.iconKey || 'stem',
      colorClass: d.colorClass || 'text-blue-600',
    }))
  return items.length ? items : defaultHomeServices()
}

export async function getAccreditations(): Promise<AccreditationItem[]> {
  await connectToDatabase()
  const docs = await Accreditation.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs
    .filter((d) => d.title?.trim())
    .map((d) => ({
      title: d.title || '',
      badge: d.badge || '',
      description: d.description || '',
      logoUrl: resolveImageUrl(d.logo) || undefined,
      badgeTone: (d.badgeTone === 'emerald' ? 'emerald' : 'blue') as 'blue' | 'emerald',
    }))
  return items.length ? items : defaultAccreditations()
}

export async function getIncubators(): Promise<IncubatorItem[]> {
  await connectToDatabase()
  const docs = await Incubator.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs
    .filter((d) => d.name?.trim())
    .map((d) => ({
      name: d.name || '',
      logoUrl: resolveImageUrl(d.logo) || undefined,
    }))
  return items.length ? items : defaultIncubators()
}

export async function getPortfolioItems(): Promise<PortfolioItemContent[]> {
  await connectToDatabase()
  const docs = await PortfolioItem.find().sort({ order: 1, createdAt: 1 }).lean()
  const items = docs
    .filter((d) => d.name?.trim() && d.url?.trim())
    .map((d) => ({
      name: d.name || '',
      url: d.url || '',
    }))
  return items.length ? items : defaultPortfolio()
}

export async function getHomePageContent() {
  const defaults = defaultHomePageSettings()
  try {
    const [
      stats,
      partners,
      recognitions,
      schools,
      testimonials,
      hero,
      settings,
      services,
      accreditations,
      incubators,
      portfolio,
    ] = await Promise.all([
      getHomeStats(),
      getPartnerLogos('trusted'),
      getRecognitionLogos(),
      getSchoolLogos(),
      getHomeTestimonials(),
      getHeroSlide(),
      getHomePageSettings(),
      getHomeServices(),
      getAccreditations(),
      getIncubators(),
      getPortfolioItems(),
    ])
    return {
      stats,
      partners,
      recognitions,
      schools,
      testimonials,
      hero,
      settings,
      services,
      accreditations,
      incubators,
      portfolio,
    }
  } catch (err) {
    console.warn('Homepage: MongoDB unavailable, using static fallbacks.', err)
    return {
      stats: staticStats,
      partners: getDefaultPartners(),
      recognitions: getDefaultRecognitions(),
      schools: getDefaultSchools(),
      testimonials: mapStaticTestimonials(),
      hero: null as HeroSlideContent | null,
      settings: defaults,
      services: defaultHomeServices(),
      accreditations: defaultAccreditations(),
      incubators: defaultIncubators(),
      portfolio: defaultPortfolio(),
    }
  }
}
