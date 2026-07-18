#!/usr/bin/env bash
# Redeploy after git push — run on VPS from /var/www/nepatronix
# bash deploy/deploy.sh

set -euo pipefail

cd /var/www/nepatronix

echo "==> Pulling latest code..."
# Production secrets live only on the server — never let git pull overwrite them.
if [ -f .env.local ]; then
  cp -a .env.local .env.local.deploy.bak
fi
if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
  git update-index --skip-worktree .env.local 2>/dev/null || true
fi
git pull origin main
if [ -f .env.local.deploy.bak ]; then
  mv -f .env.local.deploy.bak .env.local
fi

echo "==> Installing dependencies..."
npm ci

echo "==> Building (VPS fast build — skips heavy TypeScript check)..."
export NODE_OPTIONS="--max-old-space-size=4096"
if ! npm run build:vps; then
  echo "ERROR: Build failed — site will show 502 until fixed."
  exit 1
fi

if [ ! -d .next ]; then
  echo "ERROR: .next missing after build."
  exit 1
fi

echo "==> Seeding HR office settings..."
npm run seed:hr || true

echo "==> Backfilling attendance late minutes (Nepal timezone)..."
npm run backfill:attendance-late || true

echo "==> Restarting app..."
pm2 delete nepatronix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

sleep 4
if ! curl -sf -o /dev/null http://127.0.0.1:3000; then
  echo "WARNING: App not responding on :3000. Run: pm2 logs nepatronix --lines 50"
  exit 1
fi

echo "==> Done. App is up on port 3000."
