import { connectToDatabase } from '@/lib/mongodb'
import { Course } from '@/lib/models'

/** Fallback labels when a course row has no title (legacy IDs 1–5). */
export const LEGACY_COURSE_TITLES: Record<number, string> = {
  1: 'Short Course on STEM-Based IoT and Robotics',
  2: 'Tutor Training Certification on STEM-Based IoT and Robotics',
  3: 'Professional Certificate on STEM-Based IoT and Robotics',
  4: 'Occupational Certificate in Science Laboratory Setup and Operation',
  5: 'Occupational Certificate in Math-Integrated STEM Teaching',
}

export async function fetchCoursesOrdered() {
  await connectToDatabase()
  return Course.find().sort({ order: 1, createdAt: -1 }).lean()
}

/**
 * Courses are ordered like the public listing: `order asc`, 1-based ID = index + 1.
 */
export async function fetchCourseByListId(
  courseId: number
): Promise<{ title: string; _id: string } | null> {
  if (!Number.isFinite(courseId) || courseId < 1) return null
  const docs = await fetchCoursesOrdered()
  const row = docs[courseId - 1]
  if (!row) return null
  const title = (row.title?.trim() || LEGACY_COURSE_TITLES[courseId] || '').trim()
  if (!title) return null
  return { title, _id: String(row._id) }
}
