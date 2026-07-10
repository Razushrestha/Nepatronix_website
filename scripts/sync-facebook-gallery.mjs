// Sync all photos from the NepaTronix Facebook page into the MongoDB gallery.
//
// Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN in .env.local, then run:
//   npm run sync:facebook
//   npm run sync:facebook -- --dry-run
//   npm run sync:facebook -- --limit 20

import { readFileSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import { Readable } from 'stream'

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

const FB_PAGE_ID = process.env.FB_PAGE_ID
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const FB_API_VERSION = process.env.FB_API_VERSION || 'v21.0'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      return [k, v === undefined ? true : v]
    }
    return [a, true]
  })
)
const DRY_RUN = !!args['dry-run']
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity

if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
  console.error('Missing FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN in .env.local')
  process.exit(1)
}

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
)

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    images: { type: [ImageSchema], default: [] },
    publishedAt: Date,
    fbPhotoId: String,
  },
  { timestamps: true }
)

const Gallery =
  mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema)

const DESCRIPTION_TEMPLATES = [
  'A glimpse into NepaTronix hands-on STEM, robotics, and IoT training sessions across Nepal — where students turn ideas into working prototypes.',
  'Captured during a NepaTronix workshop: real hardware, real circuits, and real problem-solving with aspiring young engineers in Nepal.',
  'From Arduino and PCB design to drone builds and robotics labs — a moment from NepaTronix community events and school partnerships.',
  'NepaTronix students and mentors in action, building the next generation of Nepal innovation ecosystem through practical engineering education.',
  'A snapshot from NepaTronix outreach: school STEM lab setups, robotics competitions, and industry collaborations in Kathmandu and beyond.',
  'Behind the scenes at NepaTronix — engineering training, product development, and the people making STEM accessible across Nepal.',
]

function pickDescription(photo, index) {
  const caption = (photo.name || '').trim()
  if (caption && caption.length > 8) {
    return `${caption} — Captured during NepaTronix STEM, robotics, and IoT programs in Nepal.`
  }
  return DESCRIPTION_TEMPLATES[index % DESCRIPTION_TEMPLATES.length]
}

function pickTitle(photo, createdTime) {
  const caption = (photo.name || '').trim()
  if (caption) {
    return caption.length > 70 ? caption.slice(0, 67) + '…' : caption
  }
  const date = createdTime ? new Date(createdTime) : new Date()
  const label = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return `NepaTronix Moment — ${label}`
}

function pickLargestImage(images) {
  if (!images || !images.length) return null
  return images.reduce((best, cur) => {
    const bestArea = (best.width || 0) * (best.height || 0)
    const curArea = (cur.width || 0) * (cur.height || 0)
    return curArea > bestArea ? cur : best
  })
}

async function uploadToGridFS(buffer, filename, contentType) {
  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
  return new Promise((res, rej) => {
    const up = bucket.openUploadStream(filename, { contentType })
    Readable.from(buffer).pipe(up).on('error', rej).on('finish', () => res(up.id.toString()))
  })
}

async function fetchAllPhotos() {
  const photos = []
  let url =
    `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/photos` +
    `?fields=id,images,name,alt_text,created_time,link` +
    `&limit=100&access_token=${FB_PAGE_ACCESS_TOKEN}`

  let pageCount = 0
  while (url && photos.length < LIMIT) {
    pageCount++
    const res = await fetch(url)
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Facebook API error ${res.status}: ${body}`)
    }
    const json = await res.json()
    if (json.error) throw new Error(`Facebook API error: ${JSON.stringify(json.error)}`)
    for (const p of json.data || []) {
      if (photos.length >= LIMIT) break
      photos.push(p)
    }
    url = json.paging?.next || null
    console.log(`  fetched ${photos.length} photos (page ${pageCount})`)
  }
  return photos
}

async function alreadyImported(fbPhotoId) {
  const existing = await Gallery.findOne({ fbPhotoId }).select('_id').lean()
  return !!existing
}

async function importPhoto(photo, index) {
  const largest = pickLargestImage(photo.images)
  if (!largest || !largest.source) {
    console.warn(`  skipping ${photo.id}: no usable image source`)
    return { skipped: true }
  }

  if (await alreadyImported(photo.id)) {
    console.log(`  skip ${photo.id} (already imported)`)
    return { skipped: true, alreadyExists: true }
  }

  const title = pickTitle(photo, photo.created_time)
  const description = pickDescription(photo, index)
  const alt = photo.alt_text || title

  if (DRY_RUN) {
    console.log(`  [dry-run] would import ${photo.id}: "${title}"`)
    return { dryRun: true }
  }

  const imgRes = await fetch(largest.source)
  if (!imgRes.ok) {
    console.warn(`  skipping ${photo.id}: download failed (${imgRes.status})`)
    return { skipped: true }
  }
  const arrayBuffer = await imgRes.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.includes('png') ? 'png' : 'jpg'
  const filename = `fb-${photo.id}.${ext}`

  const fileId = await uploadToGridFS(buffer, filename, contentType)
  const doc = await Gallery.create({
    title,
    description,
    publishedAt: photo.created_time ? new Date(photo.created_time) : new Date(),
    fbPhotoId: photo.id,
    images: [
      {
        url: `/api/files/${fileId}`,
        alt,
        caption: photo.name ? title : '',
      },
    ],
  })

  console.log(`  imported ${photo.id} -> gallery ${doc._id} ("${title}")`)
  return { imported: true }
}

async function main() {
  await mongoose.connect(MONGODB_URI)
  console.log(
    DRY_RUN
      ? 'DRY RUN — no changes will be written to MongoDB.'
      : 'Syncing Facebook photos -> MongoDB gallery...'
  )
  console.log(`   Page ID: ${FB_PAGE_ID} | API: ${FB_API_VERSION}${LIMIT !== Infinity ? ` | limit: ${LIMIT}` : ''}\n`)

  const photos = await fetchAllPhotos()
  console.log(`\nFound ${photos.length} photo(s) on Facebook.\n`)

  let imported = 0
  let skipped = 0
  let alreadyExists = 0
  let dryRun = 0
  let failed = 0

  for (let i = 0; i < photos.length; i++) {
    try {
      const r = await importPhoto(photos[i], i)
      if (r.imported) imported++
      else if (r.alreadyExists) alreadyExists++
      else if (r.dryRun) dryRun++
      else if (r.skipped) skipped++
    } catch (err) {
      failed++
      console.error(`  failed ${photos[i].id}: ${err.message}`)
    }
  }

  console.log(
    `\n${DRY_RUN ? 'Dry run complete.' : 'Sync complete.'} ` +
      `imported=${imported} alreadyExisted=${alreadyExists} skipped=${skipped} dryRun=${dryRun} failed=${failed}`
  )

  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error('Error:', err.message)
  try {
    await mongoose.disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})
