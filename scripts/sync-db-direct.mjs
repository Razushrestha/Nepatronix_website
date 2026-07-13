/**
 * Copy MongoDB documents directly from a source URI to a target URI.
 * Useful when the VPS MongoDB port is reachable (or via SSH tunnel).
 *
 * Usage:
 *   SOURCE_MONGODB_URI=mongodb://127.0.0.1:27017/nepatronix \
 *   TARGET_MONGODB_URI=mongodb://163.47.151.250:27017/nepatronix \
 *   npm run db:sync
 *
 *   npm run db:sync -- --dry-run
 *   npm run db:sync -- --collections=posts,galleries
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import { CONTENT_COLLECTIONS } from './db-collections.mjs'

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

const SOURCE_URI =
  process.env.SOURCE_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'
const TARGET_URI = process.env.TARGET_MONGODB_URI || process.env.REMOTE_MONGODB_URI

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
const BATCH = 50

const collections = args.collections
  ? String(args.collections).split(',').map((s) => s.trim()).filter(Boolean)
  : CONTENT_COLLECTIONS

async function copyCollection(sourceDb, targetDb, name) {
  const source = sourceDb.collection(name)
  const target = targetDb.collection(name)
  const total = await source.countDocuments()
  if (total === 0) {
    console.log(`  ${name}: (empty, skip)`)
    return { name, copied: 0, total: 0 }
  }

  let copied = 0
  const cursor = source.find({}).batchSize(BATCH)
  let batch = []

  for await (const doc of cursor) {
    batch.push({
      replaceOne: {
        filter: { _id: doc._id },
        replacement: doc,
        upsert: true,
      },
    })
    if (batch.length >= BATCH) {
      if (!DRY_RUN) await target.bulkWrite(batch, { ordered: false })
      copied += batch.length
      batch = []
      process.stdout.write(`  ${name}: ${copied}/${total}\r`)
    }
  }
  if (batch.length) {
    if (!DRY_RUN) await target.bulkWrite(batch, { ordered: false })
    copied += batch.length
  }
  console.log(`  ${name}: ${copied}/${total} synced`)
  return { name, copied, total }
}

async function main() {
  if (!TARGET_URI) {
    console.error('Set TARGET_MONGODB_URI (or REMOTE_MONGODB_URI) to the server MongoDB connection string.')
    console.error('Or use: npm run db:export locally → copy to VPS → npm run db:import on VPS')
    process.exit(1)
  }

  if (SOURCE_URI === TARGET_URI) {
    console.error('Source and target URIs are the same.')
    process.exit(1)
  }

  console.log('Source:', SOURCE_URI)
  console.log('Target:', TARGET_URI)
  console.log('Collections:', collections.join(', '))
  if (DRY_RUN) console.log('(dry run)')

  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise()
  const targetConn = await mongoose.createConnection(TARGET_URI).asPromise()
  const sourceDb = sourceConn.db
  const targetDb = targetConn.db

  const results = []
  for (const name of collections) {
    console.log(`\n→ ${name}`)
    results.push(await copyCollection(sourceDb, targetDb, name))
  }

  await sourceConn.close()
  await targetConn.close()

  console.log('\n--- Summary ---')
  for (const r of results) {
    console.log(`  ${r.name}: ${r.copied}/${r.total}`)
  }
  console.log('\nDone. Restart the app on the server if needed.')
}

main().catch((e) => {
  console.error('Sync error:', e.message)
  process.exit(1)
})
