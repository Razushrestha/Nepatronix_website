import { connectToDatabase } from '@/lib/mongodb'
import { Course } from '@/lib/models'
import ApplyCertificateForm from './ApplyCertificateForm'
import { FaqSection } from '../../components/FaqSection'
import { APPLY_CERT_FAQS } from '../../data/faqs'
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonLd'

export const revalidate = 1800

async function getCourses() {
  await connectToDatabase()
  const docs = await Course.find()
    .sort({ title: 1 })
    .select('_id title isFree hours')
    .lean<{ _id: unknown; title?: string; isFree?: boolean; hours?: number }[]>()

  return docs.map((course) => ({
    _id: String(course._id),
    title: course.title || '',
    isFree: course.isFree || false,
    hours: course.hours || 0,
  }))
}

export default async function ApplyForCertificationPage() {
  const courses = await getCourses()
  const canonicalUrl = "https://nepatronix.org/services/apply-certificate";

  const faqLd = faqJsonLd(APPLY_CERT_FAQS);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: 'https://nepatronix.org' },
    { name: 'Services', url: 'https://nepatronix.org/services' },
    { name: 'Apply for Certificate', url: canonicalUrl },
  ]);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Apply for Certificate",
    "url": canonicalUrl,
    "description": "Apply for your Nepatronix course completion certificate in IoT, Robotics, and STEM programs.",
    "about": {
      "@type": "EducationalOccupationalCredential",
      "name": "Nepatronix Certificate of Completion",
      "credentialCategory": "Certificate of Completion",
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name": "Nepatronix Engineering Solutions",
        "url": "https://nepatronix.org"
      }
    },
    "isPartOf": { "@id": "https://nepatronix.org/#website" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <ApplyCertificateForm courses={courses} />
      <FaqSection
        eyebrow="Certificate FAQ"
        title="Questions about Nepatronix certificates"
        description="Answers to the most common certificate application and verification questions."
        items={APPLY_CERT_FAQS}
        className="bg-slate-50"
      />
    </>
  );
}
