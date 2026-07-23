/**
 * Carefully sync homepage Google reviews into MongoDB (Admin → Testimonials).
 *
 * - Deletes known placeholder reviews (Jordan Blake, Evelyn Park)
 * - Upserts the 19 Google reviews by name (idempotent)
 * - Updates only homepage.testimonials section headings
 * - Updates homeservices titles/descriptions for the 4 public service pages
 *
 * Does NOT touch partners, schools, courses, blog, or other collections.
 *
 * Usage: node scripts/seed-testimonials.mjs
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

const PLACEHOLDER_NAMES = ['Jordan Blake', 'Evelyn Park']

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
    review: 'Top-notch IoT course in Kathmandu offering a welcoming atmosphere and supportive instructors.',
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

/** Upsert homeservices by href so we don't create duplicates if titles changed. */
const homeServices = [
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

async function main() {
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db
  const coll = db.collection('testimonials')

  const removed = await coll.deleteMany({ name: { $in: PLACEHOLDER_NAMES } })
  console.log(`🧹 Removed ${removed.deletedCount} placeholder testimonial(s)`)

  let upserted = 0
  for (let i = 0; i < testimonials.length; i++) {
    const d = testimonials[i]
    await coll.updateOne(
      { name: d.name },
      {
        $set: {
          name: d.name,
          role: d.role,
          rating: d.rating,
          review: d.review,
          order: i,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )
    upserted++
  }
  console.log(`✅ Upserted ${upserted} Google review testimonials`)

  // Only touch testimonials headings on homepage settings
  const homeResult = await db.collection('homepages').updateOne(
    { key: 'home' },
    {
      $set: {
        'testimonials.eyebrow': 'Client Reviews',
        'testimonials.title': 'What Our Clients Say',
        'testimonials.description':
          'Real Google reviews from students, clients, and partners of Nepatronix.',
        updatedAt: new Date(),
      },
      $setOnInsert: { key: 'home', createdAt: new Date() },
    },
    { upsert: true }
  )
  console.log(
    `✅ Homepage testimonials headings ${homeResult.upsertedCount ? 'created' : 'updated'}`
  )

  // Align homepage service cards with public service pages (match by href)
  const hsColl = db.collection('homeservices')
  let hsCount = 0
  for (let i = 0; i < homeServices.length; i++) {
    const d = homeServices[i]
    await hsColl.updateOne(
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
    hsCount++
  }
  // Remove obsolete cards that pointed at same services under old titles (optional cleanup by href duplicates already handled)
  console.log(`✅ Upserted ${hsCount} homepage service cards`)

  const total = await coll.countDocuments()
  console.log(`📊 Testimonials collection now has ${total} document(s)`)
  console.log('Done. Manage further edits in Admin → Content → Testimonials.')

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
