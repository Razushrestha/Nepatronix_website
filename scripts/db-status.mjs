/**
 * Diagnostic: shows which MongoDB the app connects to and what's inside.
 * Usage: node scripts/db-status.mjs
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

async function main() {
  console.log('Connecting to:', MONGODB_URI)
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db
  console.log('Database name:', db.databaseName)

  const admin = db.admin()
  const { databases } = await admin.listDatabases()
  console.log('\nAll databases on this server:')
  databases.forEach((d) => console.log(`  - ${d.name}`))

  const collections = await db.listCollections().toArray()
  console.log(`\nCollections in "${db.databaseName}":`)
  if (collections.length === 0) {
    console.log('  (none yet — insert data to create them)')
  }
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments()
    console.log(`  - ${c.name}: ${count} documents`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error('DB status error:', e.message)
  process.exit(1)
})
