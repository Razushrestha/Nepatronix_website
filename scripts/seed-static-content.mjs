/**
 * Seed partners, schools, recognitions and testimonials into MongoDB
 * from the data currently hardcoded on the website.
 *
 * Idempotent: upserts by name so it can be re-run safely.
 * Usage: node scripts/seed-static-content.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'

const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')]
    })
)
Object.assign(process.env, envVars)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'

const partners = [
  { name: 'Gyan Bazzar', logo: '/partner/gyanbazzar.png' },
  { name: 'Drone Hub', logo: '/partner/dronehub.png' },
  { name: 'diyo.ai', logo: '/partner/diyo.ai.png' },
  { name: 'Edtra', logo: '/partner/edtra.png' },
  { name: 'Himalayan Solution', logo: '/partner/himalayansolution.png' },
  { name: 'Thokbikreta', logo: '/partner/Thokbikrita.png' },
  { name: 'Yarsa Tech', logo: '/partner/Yarsatech.png' },
  { name: 'Tridev Innovations', logo: '/partner/Tridev.png' },
  { name: 'Esewa', logo: '/partner/Esewa.png' },
  { name: 'Laxmi Sunrise Bank', logo: '/partner/laxmisunrise.png' },
  { name: 'Siddhartha Bank', logo: '/partner/Siddhartha bank.png' },
  { name: 'Youth Innovation Lab', logo: '/partner/Youth_Innovation_Lab_textlogo.svg_.png' },
]

const schools = [
  { name: 'BIT', logo: '/school_College/BIT-removebg-preview.png' },
  { name: 'Bramarupa', logo: '/school_College/bramarupa-removebg-preview.png' },
  { name: 'Candid Career', logo: '/school_College/candidcareer-removebg-preview.png' },
  { name: 'Himchuli', logo: '/school_College/himchuli-removebg-preview.png' },
  { name: 'Marvellous', logo: '/school_College/marvellous-removebg-preview.png' },
  { name: 'Mrigashira', logo: '/school_College/mrigashira-removebg-preview.png' },
  { name: 'National Infotech', logo: '/school_College/nationalinfotech-removebg-preview.png' },
  { name: 'NCCS', logo: '/school_College/nccs-removebg-preview.png' },
  { name: 'Prime College', logo: '/school_College/primecollege-removebg-preview.png' },
  { name: 'Rainbow', logo: '/school_College/rainbow-removebg-preview.png' },
  { name: 'Siddhartha Vidyapeeth', logo: '/school_College/siddhartha_vidyapeeth-removebg-preview.png' },
  { name: 'Texas College', logo: '/school_College/texas_college.png' },
]

const recognitions = [
  { name: 'ICT Startup Award', logo: '/recognition/ICT.png' },
  { name: 'Government of Nepal', logo: '/recognition/NepalGov.png' },
  { name: 'Kathmandu University', logo: '/recognition/KU.png' },
  { name: 'Indian Embassy', logo: '/recognition/embassy_of_india-removebg-preview.png' },
  { name: 'IIT Madras Pravartak', logo: '/pravartak.png' },
  { name: 'INSPAN Program', logo: '/recognition/INSPAN.png' },
  { name: 'EU Business Forum', logo: '/recognition/EUbusinessforum.png' },
]

/** Google reviews shown on homepage Client Reviews (also editable in Admin → Testimonials). */
const testimonials = [
  {
    name: 'Razu Shrestha',
    role: 'Google Review · Local Guide',
    rating: 5,
    review:
      'One of the best IoT, Robotics and automation companies in Nepal. They provide excellent knowledge and support to students.',
  },
  {
    name: 'Sunil Magar',
    role: 'Student · Google Review',
    rating: 5,
    review:
      'I attended the 3-day online IoT and Robotics course conducted by Nepatronix, and it was a highly valuable learning experience. The tutors were knowledgeable, supportive, and encouraged interactive participation throughout the sessions.',
  },
  {
    name: 'Yubraj Shahi',
    role: 'Student · Google Review',
    rating: 5,
    review:
      'I had a great experience attending the 3-day Online IoT and Robotics Course by Nepatronix. The course was beginner-friendly, practical, and packed with hands-on projects. The instructor was very knowledgeable, friendly, and supportive.',
  },
  {
    name: 'Dishesh Mahato',
    role: 'Student · Google Review',
    rating: 5,
    review:
      "I'm really happy with my experience at Nepatronix Engineering Solutions! As a student learning Arduino and ESP32 projects, I've gone from knowing nothing to an intermediate level. The teachers are great and make learning fun and easy. I highly recommend this IoT and Robotics course!",
  },
  {
    name: 'Jyoti Shrestha',
    role: 'Google Review',
    rating: 5,
    review:
      'Nepatronix is a burgeoning technology company based in Nepal, specializing in the development of Internet of Things (IoT) solutions and innovative hardware devices. The company is known for its commitment to creating high-end automation and instrumentation products for local and global markets.',
  },
  {
    name: 'Deepsu Gautam',
    role: 'Client · Google Review',
    rating: 5,
    review:
      'NepaTronix has impressed me with their innovative IoT solutions, seamlessly integrating high-performance hardware and software to meet our specific needs. Their commitment to continuous improvement and customer satisfaction sets them apart from other companies in the industry.',
  },
  {
    name: 'Public Debt Management Office',
    role: 'Tripureshwor · Google Review',
    rating: 5,
    review:
      'My recent visit to Nepatronix left a lasting impression. Their pad vending machine, a blend of innovation and empathy, showcased their commitment to community welfare. What truly stood out was their dedication to education through IoT.',
  },
  {
    name: 'Bikram Karki',
    role: 'Google Review',
    rating: 5,
    review:
      'Best known for IoT development including Robotics and Automation in Nepal. Also provides excellent knowledge and support to students and enthusiasts.',
  },
  {
    name: 'Bikash Rashaili',
    role: 'Client · Google Review',
    rating: 5,
    review:
      'Nepatronix excels in IoT and robotics, offering innovative, scalable solutions that enhance operational efficiency across various industries.',
  },
  {
    name: 'Siddhartha Yadav',
    role: 'Student · Google Review',
    rating: 5,
    review:
      'Nepatronix is the best platform for students to get introduced to the IT world. Experts from the industry are there for support.',
  },
  {
    name: 'Manu Shrestha',
    role: 'Student · Google Review',
    rating: 5,
    review:
      'Nepatronix is the best place for learning IoT, robotics, and manufacturing IoT products. They are the best at what they do!',
  },
  {
    name: 'Namuna Paudel',
    role: 'Google Review',
    rating: 5,
    review:
      "A talented team that provides top-notch robotics and IoT solutions. You can go for this company's services without a doubt.",
  },
  {
    name: 'Sakar Khatri',
    role: 'Student · Google Review',
    rating: 5,
    review:
      'Top-notch IoT course in Kathmandu offering a welcoming atmosphere and supportive instructors.',
  },
  {
    name: 'Udit Yadav',
    role: 'Google Review',
    rating: 5,
    review: 'Outstanding service and unmatched support — thank you, Nepatronix!',
  },
  {
    name: 'Saroj Chaudhary',
    role: 'Google Review',
    rating: 5,
    review: 'One of the leading IoT and Robotics companies in Nepal.',
  },
  {
    name: 'Ayush Gupta',
    role: 'Student · Google Review',
    rating: 5,
    review: 'Got a great experience learning with the Nepatronix team.',
  },
  {
    name: 'Maruf Alam',
    role: 'Google Review',
    rating: 5,
    review: 'It was a very useful and helpful experience. Excellent.',
  },
  {
    name: 'Ashok Yadav',
    role: 'Google Review',
    rating: 5,
    review: 'One of the best IoT platforms.',
  },
  {
    name: 'Arun Lohar',
    role: 'Google Review',
    rating: 5,
    review: 'Best place for STEAM kits.',
  },
]

const PLACEHOLDER_TESTIMONIAL_NAMES = ['Jordan Blake', 'Evelyn Park']

const stats = [
  { value: '50+', label: 'Partners with school', detail: 'Across Nepal' },
  { value: '25k+', label: 'Students trained', detail: 'from schools to colleges' },
  { value: '100+', label: 'Project Completed', detail: 'IoT & robotics builds' },
  { value: '15+', label: 'Expert Mentors', detail: 'Industry practitioners' },
]

const footerDoc = {
  key: 'footer',
  companyName: 'Nepatronix',
  tagline: 'Excellence Through Innovation',
  description:
    "Nepatronix Engineering Solutions is Nepal's leading IoT, robotics, and STEM education institute.",
  contactInfo: {
    address: 'Kupondole, Lalitpur, Nepal',
    postalCode: '44700',
    weekdayHours: 'Sun–Fri: 9:00 AM – 6:00 PM',
    weekendHours: 'Sat: By appointment',
  },
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/partners' },
    { name: 'Teams', href: '/teams' },
    { name: 'All Services', href: '/services' },
    { name: 'STEM Education', href: '/services/stem-education' },
    { name: 'STEM Lab Setup', href: '/services/stem-lab-setup' },
    { name: 'Government & CSR', href: '/services/institutional-programs' },
    { name: 'Courses', href: '/services/courses' },
    { name: 'Apply Certificate', href: '/services/apply-certificate' },
    { name: 'Upcoming Sessions', href: '/services/upcoming-sessions' },
    { name: 'Blog', href: '/blog' },
    { name: 'Images', href: '/image' },
    { name: 'Contact', href: '/contact' },
  ],
  expertise: [
    { name: 'IoT Training', desc: 'Hands-on Arduino and sensor workshops' },
    { name: 'Robotics', desc: 'School and college robotics programs' },
    { name: 'STEM Labs', desc: 'End-to-end lab design and setup' },
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/NepaTronixx' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/nepatronix' },
  ],
  copyrightText: 'Nepatronix Engineering Solutions',
}

const contactPageDoc = {
  key: 'contact',
  pageTitle: 'Contact Us',
  pageDescription: 'Reach out to Nepatronix for courses, collaborations, and STEM solutions.',
  contactDetails: {
    email: 'info@nepatronix.org',
    phone: '+977-9803661701',
    address: 'Kupondole, Lalitpur, Nepal',
    hours: 'Sun-Fri, 9:00 AM - 6:00 PM',
  },
  formTitle: 'Send us a message',
  formSubtitle: 'Tell us how we can help.',
  socialMedia: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/nepatronix' },
    { platform: 'Facebook', url: 'https://www.facebook.com/NepaTronixx' },
  ],
}

const homePageDoc = {
  key: 'home',
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

const homeServices = [
  {
    title: 'Certified STEM Education',
    href: '/services/stem-education',
    iconKey: 'stem',
    description: 'Globally aligned STEM programs for students and teachers with hands-on projects and certification',
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
    description: 'Custom product engineering, software, and IoT solutions for institutions and businesses',
    colorClass: 'text-emerald-600',
  },
  {
    title: 'Government, NGO & CSR Programs',
    href: '/services/institutional-programs',
    iconKey: 'research',
    description: 'Large-scale STEM implementation for governments, NGOs, INGOs, and CSR partners',
    colorClass: 'text-purple-600',
  },
]

const accreditations = [
  {
    title: 'Kathmandu University',
    badge: 'Academic accreditation',
    description: 'Official university accreditation for our comprehensive STEAM curriculum.',
    logo: '/recognition/KU.png',
    badgeTone: 'blue',
  },
  {
    title: 'IIT Madras Pravartak',
    badge: 'Professional certification',
    description: 'Industry-aligned programmes on SWAYAM Plus, including NCrF-aligned intensive training.',
    logo: '/pravartak.png',
    badgeTone: 'emerald',
  },
]

const incubators = [
  { name: 'IIT Madras', logo: '/incubated/iit-madras.png' },
  { name: 'IITM Pravartak', logo: '/incubated/iitm-pravartak.png' },
  { name: 'Future Front', logo: '/incubated/future-front.png' },
  { name: 'IEDI', logo: '/incubated/iedi.png' },
  { name: 'Glocal After School', logo: '/incubated/glocal-after-school.png' },
]

const portfolioItems = [
  { name: 'Suryodaya Inc', url: 'https://www.suryodayainc.com/' },
  { name: 'EU Nepal Business Forum', url: 'https://eunepalbusinessforum.eu/' },
  { name: 'Campsite Nepal', url: 'https://campsitenepal.com/' },
  { name: 'Event Solutions', url: 'https://eventsolutions.com/' },
  { name: 'Karnorr', url: 'https://karnorr.com/' },
]

async function upsertByTitle(coll, docs, extra = () => ({})) {
  let count = 0
  for (let i = 0; i < docs.length; i++) {
    const d = docs[i]
    await coll.updateOne(
      { title: d.title },
      {
        $set: {
          title: d.title,
          order: i,
          updatedAt: new Date(),
          ...extra(d, i),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
    count++
  }
  return count
}

async function upsertMany(coll, docs, extra = () => ({})) {
  let count = 0
  for (let i = 0; i < docs.length; i++) {
    const d = docs[i]
    await coll.updateOne(
      { name: d.name },
      {
        $set: {
          name: d.name,
          order: i,
          updatedAt: new Date(),
          ...extra(d, i),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
    count++
  }
  return count
}

async function main() {
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db

  const p = await upsertMany(db.collection('partners'), partners, (d) => ({
    logo: { url: d.logo, alt: d.name, caption: '' },
    type: 'trusted',
  }))
  const s = await upsertMany(db.collection('schools'), schools, (d) => ({
    logo: { url: d.logo, alt: d.name, caption: '' },
  }))
  const r = await upsertMany(db.collection('recognitions'), recognitions, (d) => ({
    logo: { url: d.logo, alt: d.name, caption: '' },
  }))
  // Remove old placeholder reviews so Admin + homepage only show real Google reviews
  const removedPlaceholders = await db.collection('testimonials').deleteMany({
    name: { $in: PLACEHOLDER_TESTIMONIAL_NAMES },
  })
  const t = await upsertMany(db.collection('testimonials'), testimonials, (d) => ({
    role: d.role,
    rating: d.rating,
    review: d.review,
  }))
  if (removedPlaceholders.deletedCount) {
    console.log(`🧹 Removed ${removedPlaceholders.deletedCount} placeholder testimonial(s)`)
  }

  // Stats have no `name` field — replace collection to avoid duplicate-key upserts.
  await db.collection('stats').deleteMany({})
  for (let i = 0; i < stats.length; i++) {
    const d = stats[i]
    await db.collection('stats').insertOne({
      value: d.value,
      label: d.label,
      detail: d.detail,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  const st = stats.length

  await db.collection('footers').updateOne(
    { key: 'footer' },
    { $set: { ...footerDoc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  await db.collection('contactpages').updateOne(
    { key: 'contact' },
    { $set: { ...contactPageDoc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  await db.collection('homepages').updateOne(
    { key: 'home' },
    { $set: { ...homePageDoc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )

  // Match by href so title renames update existing cards instead of duplicating
  let hs = 0
  for (let i = 0; i < homeServices.length; i++) {
    const d = homeServices[i]
    await db.collection('homeservices').updateOne(
      { href: d.href },
      {
        $set: {
          title: d.title,
          description: d.description,
          href: d.href,
          iconKey: d.iconKey,
          colorClass: d.colorClass,
          order: i,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
    hs++
  }
  // Drop leftover cards that still use old titles for the same service URLs
  await db.collection('homeservices').deleteMany({
    href: { $in: homeServices.map((d) => d.href) },
    title: {
      $nin: homeServices.map((d) => d.title),
    },
  })
  const ac = await upsertByTitle(db.collection('accreditations'), accreditations, (d) => ({
    badge: d.badge,
    description: d.description,
    badgeTone: d.badgeTone,
    logo: { url: d.logo, alt: d.title, caption: '' },
  }))
  const inc = await upsertMany(db.collection('incubators'), incubators, (d) => ({
    logo: { url: d.logo, alt: d.name, caption: '' },
  }))
  const pf = await upsertMany(db.collection('portfolioitems'), portfolioItems, (d) => ({
    url: d.url,
  }))

  console.log(
    `✅ Seeded: ${p} partners, ${s} schools, ${r} recognitions, ${t} testimonials, ${st} stats, ${hs} services, ${ac} accreditations, ${inc} incubators, ${pf} portfolio, homepage + footer + contact`
  )
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
