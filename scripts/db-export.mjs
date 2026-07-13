/**
 * Export the local nepatronix MongoDB database to a BSON dump folder.
 *
 * Usage:
 *   npm run db:export
 *   npm run db:export -- --out=data/my-dump
 *   npm run db:export -- --collections=posts,galleries
 *
 * Requires mongodump (MongoDB Database Tools) on PATH or MONGODUMP_PATH in .env.local
 */
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { spawnSync } from 'child_process'

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
const MONGODUMP = process.env.MONGODUMP_PATH || 'mongodump'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      return [k, v === undefined ? true : v]
    }
    return [a, true]
  })
)

const OUT_DIR = resolve(process.cwd(), args.out || 'data/nepatronix-dump')

import { CONTENT_COLLECTIONS } from './db-collections.mjs'

function runMongodump(extraArgs) {
  const result = spawnSync(MONGODUMP, ['--uri', MONGODB_URI, '--out', OUT_DIR, ...extraArgs], {
    stdio: 'inherit',
    shell: false,
  })
  if (result.status !== 0) {
    console.error('mongodump failed')
    process.exit(result.status || 1)
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const only = args.collections
    ? String(args.collections).split(',').map((s) => s.trim()).filter(Boolean)
    : null

  const collections = only || CONTENT_COLLECTIONS

  console.log('Export source:', MONGODB_URI)
  console.log('Export folder:', OUT_DIR)
  console.log('Collections:', collections.join(', '))

  const dbName = MONGODB_URI.split('?')[0].split('/').pop() || 'nepatronix'

  for (const coll of collections) {
    console.log(`\n→ Dumping ${coll}...`)
    runMongodump(['--db', dbName, '--collection', coll])
  }

  console.log('\nExport complete.')
  console.log('Next: upload this folder to your VPS and run npm run db:import there.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
