/**
 * Import a BSON dump (from db-export.mjs) into MongoDB.
 *
 * Usage (typically on the VPS):
 *   npm run db:import
 *   npm run db:import -- --from=data/nepatronix-dump
 *   npm run db:import -- --dry-run
 *
 * Uses mongorestore with upsert (no --drop) so existing admin users stay intact.
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { spawnSync } from 'child_process'
import { CONTENT_COLLECTIONS, BLOG_MEDIA_COLLECTIONS } from './db-collections.mjs'

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
const MONGORESTORE =
  process.env.MONGORESTORE_PATH ||
  process.env.MONGODUMP_PATH?.replace('mongodump', 'mongorestore') ||
  'mongorestore'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      return [k, v === undefined ? true : v]
    }
    return [a, true]
  })
)

const FROM_DIR = resolve(process.cwd(), args.from || 'data/nepatronix-dump')
const DRY_RUN = !!args['dry-run']
const REPLACE = !!args.replace || !!args['replace-collections']

function dbNameFromUri(uri) {
  const path = uri.split('?')[0].split('/').pop()
  return path || 'nepatronix'
}

function runMongorestore(restoreArgs) {
  const cmd = [MONGORESTORE, '--uri', MONGODB_URI, ...restoreArgs]
  if (DRY_RUN) {
    console.log('[dry-run]', cmd.join(' '))
    return
  }
  const result = spawnSync(MONGORESTORE, ['--uri', MONGODB_URI, ...restoreArgs], {
    stdio: 'inherit',
    shell: false,
  })
  if (result.status !== 0) {
    console.error('mongorestore failed')
    process.exit(result.status || 1)
  }
}

async function main() {
  const dbName = dbNameFromUri(MONGODB_URI)
  const dumpDbPath = join(FROM_DIR, dbName)

  if (!existsSync(dumpDbPath)) {
    console.error(`Dump not found: ${dumpDbPath}`)
    console.error('Run npm run db:export locally first, then copy data/nepatronix-dump to this server.')
    process.exit(1)
  }

  const only = args.collections
    ? String(args.collections).split(',').map((s) => s.trim()).filter(Boolean)
    : CONTENT_COLLECTIONS

  console.log('Import target:', MONGODB_URI)
  console.log('Import from:', dumpDbPath)
  console.log('Collections:', only.join(', '))
  if (DRY_RUN) console.log('(dry run — no writes)')

  for (const coll of only) {
    const collPath = join(dumpDbPath, `${coll}.bson`)
    if (!existsSync(collPath)) {
      console.warn(`  skip ${coll} — no dump file`)
      continue
    }
    console.log(`\n→ Restoring ${dbName}.${coll}${REPLACE ? ' (replace)' : ''}...`)
    const restoreArgs = ['--db', dbName, '--collection', coll]
    if (REPLACE) restoreArgs.push('--drop')
    restoreArgs.push(collPath)
    runMongorestore(restoreArgs)
  }

  console.log('\nImport complete. Restart the app: pm2 restart nepatronix')

  const importsBlogMedia = only.some((c) => BLOG_MEDIA_COLLECTIONS.includes(c))
  if (importsBlogMedia && !DRY_RUN) {
    console.log('\n→ Verifying blog and images...')
    const verify = spawnSync(process.execPath, ['scripts/verify-blog-media.mjs'], {
      stdio: 'inherit',
      shell: false,
    })
    if (verify.status !== 0) process.exit(verify.status || 1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
