import 'server-only'
import type { Model } from 'mongoose'
import {
  AdminUser,
  Enrollment,
  Certification,
  Course,
  Post,
  Gallery,
  TeamMember,
  Partner,
  School,
  Testimonial,
  Recognition,
  HeroSlide,
  Feature,
  Stat,
  CoursePdf,
  CourseVideo,
  ContactForm,
  Subscriber,
  Footer,
  ContactPage,
} from './models'

export const modelBySlug: Record<string, Model<unknown>> = {
  enrollments: Enrollment as unknown as Model<unknown>,
  certifications: Certification as unknown as Model<unknown>,
  contactforms: ContactForm as unknown as Model<unknown>,
  subscribers: Subscriber as unknown as Model<unknown>,
  courses: Course as unknown as Model<unknown>,
  posts: Post as unknown as Model<unknown>,
  galleries: Gallery as unknown as Model<unknown>,
  teammembers: TeamMember as unknown as Model<unknown>,
  partners: Partner as unknown as Model<unknown>,
  schools: School as unknown as Model<unknown>,
  testimonials: Testimonial as unknown as Model<unknown>,
  recognitions: Recognition as unknown as Model<unknown>,
  heroslides: HeroSlide as unknown as Model<unknown>,
  features: Feature as unknown as Model<unknown>,
  stats: Stat as unknown as Model<unknown>,
  coursepdfs: CoursePdf as unknown as Model<unknown>,
  coursevideos: CourseVideo as unknown as Model<unknown>,
  footer: Footer as unknown as Model<unknown>,
  contactpage: ContactPage as unknown as Model<unknown>,
  adminusers: AdminUser as unknown as Model<unknown>,
}

export function getModel(slug: string): Model<unknown> | undefined {
  return modelBySlug[slug]
}

/** Convert a Mongoose lean/doc result into a plain JSON-serializable object. */
export function serialize<T = Record<string, unknown>>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc))
}
