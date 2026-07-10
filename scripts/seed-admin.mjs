/**
 * Create (or update) the first admin user.
 * Usage: node scripts/seed-admin.mjs
 * Uses ADMIN_EMAIL / ADMIN_PASSWORD from .env.local (falls back to ADMIN_SECRET).
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
const email = (process.env.ADMIN_EMAIL || 'admin@nepatronix.org').toLowerCase()
const password = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'adminnepatronix'

async function main() {
  await mongoose.connect(MONGODB_URI)
  const coll = mongoose.connection.db.collection('adminusers')
  const passwordHash = await bcrypt.hash(password, 10)
  await coll.updateOne(
    { email },
    {
      $set: {
        name: 'Administrator',
        email,
        passwordHash,
        role: 'admin',
        active: true,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )
  console.log(`✅ Admin user ready: ${email}  (password: ${password})`)
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
