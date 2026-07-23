import type { FaqQA } from '@/lib/seo/jsonLd'

/** FAQ blocks shown visibly on each page. The same array is emitted as JSON-LD. */

export const HOME_FAQS: FaqQA[] = [
  {
    question: 'What does Nepatronix specialize in?',
    answer:
      'Nepatronix Engineering Solutions specializes in STEM education, IoT and robotics training, engineering workshops, product engineering, and STEM lab setup for schools, colleges, governments, NGOs, and CSR partners in Nepal.',
  },
  {
    question: 'Where is Nepatronix located?',
    answer:
      'Nepatronix is headquartered at Kupondole, Lalitpur, Nepal. We serve students, teachers, schools, and partner institutions across Nepal and work with international partners including IIT Madras and IITM Pravartak.',
  },
  {
    question: 'Who are Nepatronix courses for?',
    answer:
      'Our programs are designed for school and college students, STEM teachers, freelance tutors, and institutions that want structured IoT, robotics, Arduino, and PCB design training with certification.',
  },
  {
    question: 'How can I enroll in a Nepatronix course?',
    answer:
      'Browse the courses page, open the course you like, and click Enroll Now. You can also apply for certification through the "Apply Certificate" page or contact us directly for institutional programs.',
  },
  {
    question: 'Does Nepatronix issue certificates?',
    answer:
      'Yes. Nepatronix issues its own certificates of completion, and selected programs are aligned with IIT Madras SWAYAM Plus and NCrF Level 4.5. Every certificate carries a unique verification link.',
  },
  {
    question: 'How much do Nepatronix courses cost?',
    answer:
      'Prices vary by course, format, and cohort. Some sessions are free for schools we partner with. Please see the courses page or contact us for the current price of a specific program.',
  },
]

export const SERVICES_FAQS: FaqQA[] = [
  {
    question: 'What services does Nepatronix offer?',
    answer:
      'Nepatronix offers certified STEM education, STEM lab setup, product engineering (software, hardware, and IoT), and large-scale institutional STEM programs for governments, NGOs, and CSR partners.',
  },
  {
    question: 'Can Nepatronix set up a STEM lab in our school?',
    answer:
      'Yes. We handle end-to-end STEM lab setup including design, equipment procurement, installation, teacher training, and a support plan tailored to your curriculum and budget.',
  },
  {
    question: 'Do you build custom IoT hardware or apps?',
    answer:
      'Yes. Through our product engineering vertical Meta-Tronix we design and build custom software, websites, and IoT hardware for institutions and businesses.',
  },
  {
    question: 'Can government agencies or NGOs work with Nepatronix?',
    answer:
      'Yes. We regularly deliver large-scale STEM implementation programs for governments, NGOs, INGOs, and CSR partners, including teacher training, curriculum design, and multi-school rollouts.',
  },
]

export const COURSES_FAQS: FaqQA[] = [
  {
    question: 'What courses does Nepatronix offer?',
    answer:
      'Nepatronix offers IoT, Robotics, Arduino programming, ESP32 development, PCB design, and STEM tutor training. Courses run online, onsite, and as intensive workshops for schools and individuals.',
  },
  {
    question: 'How long are Nepatronix courses?',
    answer:
      'Course length depends on the program: short workshops run 3–5 days (about 40 hours), and longer certifications run several weeks. Each course page lists exact duration and exam mode.',
  },
  {
    question: 'Are Nepatronix courses beginner-friendly?',
    answer:
      'Yes. Most Nepatronix courses are designed for beginners with no prior background. Intermediate and advanced tracks are available for students who already have some electronics or programming experience.',
  },
  {
    question: 'Are certificates provided?',
    answer:
      'Yes. Every graduate receives a Nepatronix certificate of completion with a unique verification URL. Selected programs are also aligned with IIT Madras SWAYAM Plus and NCrF Level 4.5.',
  },
  {
    question: 'Can I take Nepatronix courses online from outside Kathmandu?',
    answer:
      'Yes. Many Nepatronix courses run fully online, and hybrid schools programs are delivered onsite anywhere in Nepal.',
  },
]

export const APPLY_CERT_FAQS: FaqQA[] = [
  {
    question: 'Who can apply for a Nepatronix certificate?',
    answer:
      'Anyone who has completed a Nepatronix course, workshop, or partner program can apply. Institutions can also apply on behalf of their students in bulk.',
  },
  {
    question: 'How does certificate verification work?',
    answer:
      'Every issued certificate has a unique verification URL and UID. Anyone can open the URL or search the UID on the verification page to confirm the certificate is genuine.',
  },
  {
    question: 'How long does certificate approval take?',
    answer:
      'Approval time varies with intake volume. Standard applications are usually reviewed within a few business days; institutional batches are scheduled directly with our team.',
  },
  {
    question: 'Can I share my certificate on LinkedIn?',
    answer:
      'Yes. The unique verification URL can be added to your LinkedIn profile so recruiters can confirm authenticity in one click.',
  },
]

export const VERIFY_CERT_FAQS: FaqQA[] = [
  {
    question: 'How do I verify a Nepatronix certificate?',
    answer:
      'Open the personal verification URL printed on the certificate, or enter the certificate UID on the verification hub at /verify-certificate. Genuine certificates will show the recipient name, program, and issue date.',
  },
  {
    question: 'Are certificate verification pages public?',
    answer:
      'Individual verification pages are shareable but are not listed in search engines to protect the holder\'s privacy. Only the main hub /verify-certificate is indexed.',
  },
  {
    question: 'What if my verification link does not work?',
    answer:
      'Contact info@nepatronix.org with your certificate UID. Our team will confirm the issue and resend the correct verification link.',
  },
]
