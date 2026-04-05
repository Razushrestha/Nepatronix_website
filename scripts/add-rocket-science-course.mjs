// One-time script to add "Fundamental of Rocket Science" course to Sanity
// Run: node scripts/add-rocket-science-course.mjs

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')]
    })
)
Object.assign(process.env, envVars)

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function main() {
  // Check if it already exists
  const existing = await client.fetch(
    `*[_type == "course" && title match "Fundamental*Rocket*"][0]{ _id, title }`
  )

  if (existing) {
    console.log(`✅ Course already exists: "${existing.title}" (${existing._id})`)
    console.log('Updating to ensure correct settings...')
    await client.patch(existing._id).set({
      title: 'Fundamental of Rocket Science',
      isFree: true,
      hours: 3,
      duration: '3 hours',
      level: 'Beginner',
      priceUnit: 'per person',
    }).commit()
    console.log('✅ Course updated successfully.')
  } else {
    const doc = await client.create({
      _type: 'course',
      title: 'Fundamental of Rocket Science',
      slug: { _type: 'slug', current: 'fundamental-of-rocket-science' },
      isFree: true,
      hours: 3,
      duration: '3 hours',
      level: 'Beginner',
      priceUnit: 'per person',
      highlights: [
        'Introduction to rocket propulsion',
        'Understanding thrust and aerodynamics',
        'Hands-on model rocketry basics',
      ],
    })
    console.log(`✅ Course created: "${doc.title}" (${doc._id})`)
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
