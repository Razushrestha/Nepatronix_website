/**
 * Surgical, idempotent update: change the office address stored in MongoDB
 * from "Tinkune, Kathmandu" to "Kupondole, Lalitpur" without touching any
 * other admin-edited fields on the footer or contact documents.
 *
 * Usage:  npm run fix:office-address   OR   node scripts/fix-office-address.mjs
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

const NEW_ADDRESS = 'Kupondole, Lalitpur, Nepal'
const NEW_POSTAL_CODE = '44700'
const NEW_HR_OFFICE_NAME = 'Nepatronix Office — Kupondole, Lalitpur'

async function main() {
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db

  // 1. Footer collection: contactInfo.address, contactInfo.postalCode
  const footerRes = await db.collection('footers').updateOne(
    { key: 'footer' },
    {
      $set: {
        'contactInfo.address': NEW_ADDRESS,
        'contactInfo.postalCode': NEW_POSTAL_CODE,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        key: 'footer',
        createdAt: new Date(),
      },
    },
    { upsert: true }
  )
  console.log(
    `✅ Footer: matched=${footerRes.matchedCount} modified=${footerRes.modifiedCount} upserted=${footerRes.upsertedCount ? 1 : 0}`
  )

  // 2. Contact page collection: contactDetails.address
  const contactRes = await db.collection('contactpages').updateOne(
    { key: 'contact' },
    {
      $set: {
        'contactDetails.address': NEW_ADDRESS,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        key: 'contact',
        createdAt: new Date(),
      },
    },
    { upsert: true }
  )
  console.log(
    `✅ Contact:  matched=${contactRes.matchedCount} modified=${contactRes.modifiedCount} upserted=${contactRes.upsertedCount ? 1 : 0}`
  )

  // 3. HR settings collection: officeName (only if it still contains "Tinkune")
  const hrRes = await db.collection('hrsettings').updateMany(
    { officeName: /Tinkune/i },
    { $set: { officeName: NEW_HR_OFFICE_NAME, updatedAt: new Date() } }
  )
  console.log(`✅ HR settings: matched=${hrRes.matchedCount} modified=${hrRes.modifiedCount}`)

  // 4. Print current values so the operator can eyeball them.
  const footerNow = await db
    .collection('footers')
    .findOne({ key: 'footer' }, { projection: { 'contactInfo.address': 1, 'contactInfo.postalCode': 1, _id: 0 } })
  const contactNow = await db
    .collection('contactpages')
    .findOne({ key: 'contact' }, { projection: { 'contactDetails.address': 1, _id: 0 } })
  console.log('')
  console.log('📍 Footer  →', footerNow?.contactInfo || '(missing)')
  console.log('📍 Contact →', contactNow?.contactDetails || '(missing)')

  await mongoose.disconnect()
  console.log('')
  console.log('Done. Reload the site (footer + contact) to see the new address.')
  console.log('If a CDN is caching HTML, purge it or wait for the next revalidation window.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
