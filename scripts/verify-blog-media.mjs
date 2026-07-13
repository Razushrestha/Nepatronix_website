/**
 * Verify blog posts, gallery albums, and GridFS uploads in MongoDB.
 *
 * Usage:
 *   npm run db:verify:blog
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
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
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'
const FILE_ID_RE = /\/api\/files\/([a-f0-9]{24})/gi

function collectFileIds(value, ids = new Set()) {
  if (value == null) return ids
  if (typeof value === 'string') {
    for (const match of value.matchAll(FILE_ID_RE)) ids.add(match[1])
    return ids
  }
  if (Array.isArray(value)) {
    for (const item of value) collectFileIds(item, ids)
    return ids
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) collectFileIds(v, ids)
  }
  return ids
}

async function main() {
  console.log('Checking:', MONGODB_URI)
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db

  const posts = await db.collection('posts').countDocuments()
  const galleries = await db.collection('galleries').countDocuments()
  const files = await db.collection('uploads.files').countDocuments()
  const chunks = await db.collection('uploads.chunks').countDocuments()

  const postDocs = await db.collection('posts').find({}).project({ title: 1, slug: 1, mainImage: 1, ogImage: 1, body: 1 }).toArray()
  const galleryDocs = await db.collection('galleries').find({}).project({ title: 1, images: 1 }).toArray()

  const referencedIds = new Set()
  for (const doc of [...postDocs, ...galleryDocs]) collectFileIds(doc, referencedIds)

  const existingIds = new Set(
    (await db.collection('uploads.files').find({}, { projection: { _id: 1 } }).toArray()).map((f) =>
      String(f._id)
    )
  )

  const missing = [...referencedIds].filter((id) => !existingIds.has(id))

  console.log('\n--- Blog & media summary ---')
  console.log(`  posts:           ${posts}`)
  console.log(`  galleries:       ${galleries}`)
  console.log(`  uploads.files:   ${files}`)
  console.log(`  uploads.chunks:  ${chunks}`)
  console.log(`  image refs:      ${referencedIds.size}`)
  console.log(`  missing files:   ${missing.length}`)

  if (postDocs.length) {
    console.log('\nBlog posts:')
    for (const p of postDocs) {
      console.log(`  - ${p.slug || '(no slug)'} — ${p.title || '(untitled)'}`)
    }
  }

  if (missing.length) {
    console.log('\nMissing GridFS file IDs referenced in blog/gallery:')
    for (const id of missing) console.log(`  - ${id}`)
    await mongoose.disconnect()
    process.exit(1)
  }

  console.log('\nOK — blog and gallery image references look complete.')
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
