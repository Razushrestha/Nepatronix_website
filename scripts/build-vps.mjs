#!/usr/bin/env node
/**
 * Fast production build for low-RAM VPS servers.
 * Skips the heavy "Running TypeScript" step by using a minimal tsconfig during build.
 * Type-check on your dev machine with: npx tsc --noEmit
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { spawnSync } from 'child_process'

const FULL = 'tsconfig.json'
const BACKUP = 'tsconfig.full.json'

const minimalTsconfig = {
  compilerOptions: {
    target: 'ES2017',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: false,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'react-jsx',
    paths: { '@/*': ['./*'] },
  },
  include: ['next-env.d.ts'],
  exclude: ['node_modules'],
}

function restore() {
  if (existsSync(BACKUP)) {
    copyFileSync(BACKUP, FULL)
  }
}

try {
  console.log('VPS build: backing up tsconfig and skipping full type-check...')
  copyFileSync(FULL, BACKUP)
  writeFileSync(FULL, JSON.stringify(minimalTsconfig, null, 2))

  console.log('VPS build: checking MongoDB (build continues with fallbacks if auth fails)...')
  const ping = spawnSync('mongosh', ['--quiet', 'mongodb://127.0.0.1:27017/nepatronix', '--eval', 'db.runCommand({ ping: 1 })'], {
    stdio: 'pipe',
    encoding: 'utf8',
  })
  if (ping.status !== 0 || !ping.stdout?.includes('ok')) {
    console.warn('\n⚠️  MongoDB not reachable or requires auth.')
    console.warn('   Run: bash deploy/fix-mongodb-auth.sh')
    console.warn('   Then: npm run seed:admin && npm run seed:content\n')
  } else {
    console.log('MongoDB OK.')
  }

  const heap = process.env.NODE_OPTIONS?.includes('max-old-space-size')
    ? undefined
    : '--max-old-space-size=4096'

  const args = [heap, 'node_modules/next/dist/bin/next', 'build'].filter(Boolean)

  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=4096',
    },
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  if (!existsSync('.next/BUILD_ID')) {
    console.error('\n❌ Build finished but .next/BUILD_ID is missing — build may have failed silently.')
    process.exit(1)
  }

  console.log('VPS build completed successfully.')
} finally {
  restore()
}
