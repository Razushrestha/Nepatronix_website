/**
 * Export blog posts + gallery + GridFS images, write a manifest, and zip for VPS upload.
 *
 * Usage (on your Windows PC):
 *   npm run publish:blog
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, join } from 'path'
import { spawnSync } from 'child_process'
import mongoose from 'mongoose'
import { SITE_SYNC_COLLECTIONS } from './db-collections.mjs'

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

const ROOT = process.cwd()
const OUT_DIR = resolve(ROOT, 'data/nepatronix-dump')
const ZIP_PATH = resolve(ROOT, 'data/nepatronix-dump.zip')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'
const MONGODUMP = process.env.MONGODUMP_PATH || 'mongodump'

function run(cmd, args, label) {
  console.log(`\n→ ${label}`)
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false, cwd: ROOT })
  if (result.status !== 0) {
    console.error(`${label} failed`)
    process.exit(result.status || 1)
  }
}

async function writeManifest() {
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db
  const dbName = db.databaseName
  const counts = {}
  for (const coll of SITE_SYNC_COLLECTIONS) {
    counts[coll] = await db.collection(coll).countDocuments()
  }
  await mongoose.disconnect()

  const manifest = {
    exportedAt: new Date().toISOString(),
    database: dbName,
    collections: SITE_SYNC_COLLECTIONS,
    counts,
  }
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log('\nManifest:', manifest)
}

async function main() {
  console.log('Publishing blog + gallery + team + images from:', MONGODB_URI)

  run(process.execPath, ['scripts/verify-blog-media.mjs'], 'Verify local blog/media')
  run(process.execPath, [
    'scripts/db-export.mjs',
    `--collections=${SITE_SYNC_COLLECTIONS.join(',')}`,
  ], 'Export site content collections')
  await writeManifest()

  if (process.platform === 'win32') {
    run('powershell', [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${OUT_DIR}' -DestinationPath '${ZIP_PATH}' -Force`,
    ], 'Create zip archive')
  } else {
    run('zip', ['-r', ZIP_PATH, 'nepatronix-dump'], 'Create zip archive')
  }

  console.log('\nDone.')
  console.log('Upload to VPS:', ZIP_PATH)
  console.log('Then on VPS: unzip, npm run db:import:site, npm run build:vps, pm2 restart nepatronix')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
