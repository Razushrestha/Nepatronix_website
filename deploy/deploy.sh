#!/usr/bin/env bash
# Redeploy after git push — run on VPS from /var/www/nepatronix
# bash deploy/deploy.sh

set -euo pipefail

cd /var/www/nepatronix

echo "==> Pulling latest code..."
# Production secrets stay on the server only — never tracked in git after 7f0796e7.
ENV_BACKUP=""
if [ -f .env.local ]; then
  ENV_BACKUP="$(mktemp /tmp/nepatronix-env.XXXXXX)"
  cp -a .env.local "$ENV_BACKUP"
fi
git update-index --no-skip-worktree .env.local 2>/dev/null || true
git fetch origin main
git reset --hard origin/main
if [ -n "$ENV_BACKUP" ] && [ -f "$ENV_BACKUP" ]; then
  cp -a "$ENV_BACKUP" .env.local
  rm -f "$ENV_BACKUP"
fi

echo "==> Patching nginx upload limits (unlimited + SSL-safe)..."
if command -v nginx >/dev/null 2>&1; then
  if [ -f deploy/patch-nginx-uploads.sh ]; then
    bash deploy/patch-nginx-uploads.sh /etc/nginx/sites-available/nepatronix || \
      echo "WARNING: nginx patch failed — run: bash deploy/patch-nginx-uploads.sh"
  elif [ -f deploy/nginx-nepatronix.conf ]; then
    sudo cp deploy/nginx-nepatronix.conf /etc/nginx/sites-available/nepatronix
    sudo nginx -t && sudo systemctl reload nginx
  fi
fi

# Task upload env (unlimited at app layer)
if [ -f .env.local ]; then
  grep -q '^TASK_MAX_UPLOAD_MB=' .env.local || echo 'TASK_MAX_UPLOAD_MB=0' >> .env.local
  grep -q '^NEXT_PUBLIC_TASK_MAX_UPLOAD_MB=' .env.local || echo 'NEXT_PUBLIC_TASK_MAX_UPLOAD_MB=0' >> .env.local
  sed -i 's/^TASK_MAX_UPLOAD_MB=.*/TASK_MAX_UPLOAD_MB=0/' .env.local 2>/dev/null || true
  sed -i 's/^NEXT_PUBLIC_TASK_MAX_UPLOAD_MB=.*/NEXT_PUBLIC_TASK_MAX_UPLOAD_MB=0/' .env.local 2>/dev/null || true
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
