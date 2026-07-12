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

const testimonials = [
  {
    name: 'Jordan Blake',
    role: 'Associate Product Manager, Flux AI',
    rating: 5,
    review: 'The mentorship and career support at Nepatronix helped me land my first product role in under 90 days.',
  },
  {
    name: 'Evelyn Park',
    role: 'Machine Learning Engineer, LumenCloud',
    rating: 5,
    review: 'Project-based learning finally made complex ML concepts stick. The portfolio I built here speaks for itself.',
  },
]

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
    address: 'Tinkune, Kathmandu, Nepal',
    postalCode: '44600',
    weekdayHours: 'Sun–Fri: 9:00 AM – 6:00 PM',
    weekendHours: 'Sat: By appointment',
  },
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/services/courses' },
    { name: 'Blog', href: '/blog' },
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
    address: 'Tinkune, Kathmandu, Nepal',
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
    description: 'Real feedback from our satisfied clients and partners across various projects.',
  },
}

const homeServices = [
  {
    title: 'STEM Tutor Program',
    href: '/services/stem-education',
    iconKey: 'stem',
    description: 'Personalized STEM education with expert tutors for students at all levels',
    colorClass: 'text-blue-600',
  },
  {
    title: 'STEM Lab Setup',
    href: '/services/stem-lab-setup',
    iconKey: 'lab',
    description: 'Complete laboratory setup and equipment for schools and educational institutions',
    colorClass: 'text-red-600',
  },
  {
    title: 'Software and APP Development',
    href: '/services/product-engineering',
    iconKey: 'software',
    description: 'Custom software solutions and mobile applications for educational and business needs',
    colorClass: 'text-emerald-600',
  },
  {
    title: 'Research and Innovations',
    href: '/services/institutional-programs',
    iconKey: 'research',
    description: 'Cutting-edge research projects and innovative solutions for real-world challenges',
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
  const t = await upsertMany(db.collection('testimonials'), testimonials, (d) => ({
    role: d.role,
    rating: d.rating,
    review: d.review,
  }))

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

  const hs = await upsertByTitle(db.collection('homeservices'), homeServices, (d) => ({
    description: d.description,
    href: d.href,
    iconKey: d.iconKey,
    colorClass: d.colorClass,
  }))
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
