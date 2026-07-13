/**
 * Verify a BSON dump folder before importing on the VPS.
 *
 * Usage:
 *   node scripts/check-dump.mjs
 *   node scripts/check-dump.mjs --from=data/nepatronix-dump
 */
import { readFileSync, existsSync, statSync } from 'fs'
import { resolve, join } from 'path'
import { BLOG_MEDIA_COLLECTIONS } from './db-collections.mjs'

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
const DB_DIR = join(FROM_DIR, 'nepatronix')
const MANIFEST_PATH = join(FROM_DIR, 'manifest.json')

function fmtBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function main() {
  console.log('Dump folder:', FROM_DIR)

  if (!existsSync(DB_DIR)) {
    console.error('\nERROR: Missing', DB_DIR)
    console.error('Upload nepatronix-dump.zip and run: unzip -o nepatronix-dump.zip -d data/')
    process.exit(1)
  }

  if (existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
    console.log('\nManifest (expected counts from your PC):')
    console.log(JSON.stringify(manifest.counts, null, 2))
  } else {
    console.warn('\nNo manifest.json — export was not made with npm run publish:blog')
  }

  console.log('\nDump files on disk:')
  let ok = true
  for (const coll of BLOG_MEDIA_COLLECTIONS) {
    const bson = join(DB_DIR, `${coll}.bson`)
    const meta = join(DB_DIR, `${coll}.metadata.json`)
    if (!existsSync(bson)) {
      console.log(`  MISSING  ${coll}.bson`)
      ok = false
      continue
    }
    const size = statSync(bson).size
    let count = '?'
    if (existsSync(meta)) {
      try {
        count = JSON.parse(readFileSync(meta, 'utf-8')).options?.count ?? '?'
      } catch {
        count = '?'
      }
    }
    console.log(`  OK       ${coll}.bson — ${fmtBytes(size)} — ${count} docs`)
  }

  if (!ok) {
    console.error('\nDump is incomplete. Re-run on your PC: npm run publish:blog')
    process.exit(1)
  }

  console.log('\nDump looks good. Run on VPS: npm run db:import:blog')
}

main()
