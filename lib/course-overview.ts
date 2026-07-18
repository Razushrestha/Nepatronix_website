import { connectToDatabase } from '@/lib/mongodb'
import { Course, CoursePdf, CourseVideo } from '@/lib/models'
import { resolveFileUrl } from '@/lib/content-image'
import { fetchCourseByListId, fetchCoursesOrdered, LEGACY_COURSE_TITLES } from '@/lib/course-list-order'

export interface CourseOverview {
  id: number
  name: string
  hours: number
  deliveryMode: string
  examMode: string
  price: string
  priceUnit: string
  popular: boolean
  isFree: boolean
  level: string
  pdfUrl: string
  description: string
  highlights: string[]
  modules: { title: string; topics: string[]; accent: string }[]
}

const MODULE_ACCENTS = ['from-[#C1121F] to-rose-600', 'from-blue-600 to-cyan-500', 'from-violet-600 to-purple-500', 'from-amber-500 to-orange-600', 'from-emerald-600 to-teal-500']

function buildModules(name: string, hours: number, highlights: string[]): CourseOverview['modules'] {
  if (highlights.length >= 3) {
    const chunk = Math.ceil(highlights.length / 3)
    return [
      { title: 'Foundation & Setup', topics: highlights.slice(0, chunk), accent: MODULE_ACCENTS[0] },
      { title: 'Core Skills & Labs', topics: highlights.slice(chunk, chunk * 2), accent: MODULE_ACCENTS[1] },
      { title: 'Projects & Certification', topics: highlights.slice(chunk * 2), accent: MODULE_ACCENTS[2] },
    ].filter((m) => m.topics.length > 0)
  }

  const lower = name.toLowerCase()
  if (lower.includes('flutter')) {
    return [
      { title: 'Flutter Foundations', topics: ['Dart basics', 'Widgets & layouts', 'Navigation & routing'], accent: MODULE_ACCENTS[0] },
      { title: 'App Development', topics: ['State management', 'APIs & Firebase', 'UI/UX for mobile'], accent: MODULE_ACCENTS[1] },
      { title: 'Capstone & Deploy', topics: ['Production build', 'Play Store / App Store prep', 'Certification exam'], accent: MODULE_ACCENTS[2] },
    ]
  }
  if (lower.includes('python')) {
    return [
      { title: 'Python Essentials', topics: ['Syntax & data structures', 'Functions & OOP', 'File handling'], accent: MODULE_ACCENTS[0] },
      { title: 'Applied Python', topics: ['Automation scripts', 'Data & visualization', 'Mini projects'], accent: MODULE_ACCENTS[1] },
      { title: 'Certification Track', topics: ['Assessment prep', 'Real-world case study', 'Certificate completion'], accent: MODULE_ACCENTS[2] },
    ]
  }

  const sessions = Math.max(3, Math.min(6, Math.ceil(hours / 8)))
  return Array.from({ length: sessions }, (_, i) => ({
    title: `Module ${i + 1}`,
    topics: [`Session ${i * 2 + 1}–${i * 2 + 2}`, 'Hands-on lab', 'Progress review'],
    accent: MODULE_ACCENTS[i % MODULE_ACCENTS.length],
  }))
}

export async function getCourseOverviewByListId(courseId: number): Promise<CourseOverview | null> {
  if (!Number.isFinite(courseId) || courseId < 1) return null

  const resolved = await fetchCourseByListId(courseId)
  if (!resolved) return null

  await connectToDatabase()
  const courses = await fetchCoursesOrdered()
  const courseDoc = courses[courseId - 1] as {
    title?: string
    hours?: number
    deliveryMode?: string
    examMode?: string
    price?: number
    priceUnit?: string
    popular?: boolean
    isFree?: boolean
    level?: string
    highlights?: string[]
    coursePdf?: { pdfFile?: { url?: string } }
  } | undefined

  const name = resolved.title
  let pdfUrl = resolveFileUrl(courseDoc?.coursePdf?.pdfFile)
  let description = `Comprehensive ${name} program with ${courseDoc?.hours || 0} hours of hands-on STEM training.`

  if (!pdfUrl) {
    const coursePdf = await CoursePdf.findOne({ courseId, isPublished: true })
      .sort({ order: 1 })
      .lean<{ description?: string; pdfFile?: { url?: string } }>()
    pdfUrl = resolveFileUrl(coursePdf?.pdfFile)
    if (coursePdf?.description) description = coursePdf.description
  }

  if (!pdfUrl) {
    const courseVideo = await CourseVideo.findOne({ courseId, isPublished: true })
      .sort({ order: 1 })
      .lean<{ description?: string; overviewPdf?: { url?: string } }>()
    pdfUrl = resolveFileUrl(courseVideo?.overviewPdf)
    if (courseVideo?.description) description = courseVideo.description
  }

  const hours = courseDoc?.hours || 0
  const highlights =
    courseDoc?.highlights?.length ? courseDoc.highlights : [
      'Industry-aligned STEM curriculum',
      'Hands-on project-based learning',
      'Expert instructors from Nepatronix',
      'National & international certification paths',
      'School / college deployment support',
    ]

  const isFree = courseDoc?.isFree || false
  const price = isFree
    ? 'Free'
    : courseDoc?.price
      ? `NPR ${courseDoc.price.toLocaleString()}`
      : 'Contact for price'

  return {
    id: courseId,
    name,
    hours,
    deliveryMode: courseDoc?.deliveryMode || 'Blended',
    examMode: courseDoc?.examMode || 'Blended',
    price,
    priceUnit: isFree ? '' : courseDoc?.priceUnit || 'per school/college',
    popular: courseDoc?.popular || false,
    isFree,
    level: courseDoc?.level || 'Intermediate',
    pdfUrl,
    description,
    highlights,
    modules: buildModules(name, hours, highlights),
  }
}

export function legacyCourseTitle(id: number): string {
  return LEGACY_COURSE_TITLES[id] || `Course ${id}`
}
