import { client } from '@/sanity/lib/client'
import ApplyCertificateForm from './ApplyCertificateForm'

export const revalidate = 0

async function getCourses() {
  return client.fetch<{ _id: string; title: string; isFree: boolean; hours: number }[]>(`
    *[_type == "course"] | order(title asc) {
      _id,
      title,
      isFree,
      hours
    }
  `)
}

export default async function ApplyForCertificationPage() {
  const courses = await getCourses()
  return <ApplyCertificateForm courses={courses} />
}
