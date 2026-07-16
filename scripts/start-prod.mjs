#!/usr/bin/env node
/**
 * Production start — refuses to run if .next build is missing.
 */
import { existsSync } from 'fs'
import { spawnSync } from 'child_process'

if (!existsSync('.next/BUILD_ID')) {
  console.error('\n❌ No production build found (.next/BUILD_ID missing).')
  console.error('   Run on the server:  npm run build:vps')
  console.error('   Then:              pm2 restart nepatronix\n')
  process.exit(1)
}

const result = spawnSync(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', '3000'],
  { stdio: 'inherit', env: process.env }
)
process.exit(result.status ?? 1)
