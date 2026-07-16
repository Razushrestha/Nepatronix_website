#!/usr/bin/env bash
# Fix 502 Bad Gateway — Next.js not responding on port 3000
# Run on VPS: bash deploy/recover-502.sh

set -euo pipefail

APP_DIR="/var/www/nepatronix"
cd "$APP_DIR"

echo "==> 1. MongoDB"
if systemctl is-active --quiet mongod; then
  echo "    mongod is running"
else
  echo "    Starting mongod..."
  systemctl start mongod
  sleep 2
fi

echo "==> 2. Environment file"
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local missing!"
  echo "Create it: cp .env.example .env.local && nano .env.local"
  echo "Required: MONGODB_URI, JWT_SECRET, ADMIN_SECRET, NEXT_PUBLIC_BASE_URL"
  exit 1
fi
echo "    .env.local exists"

echo "==> 3. Latest code"
git fetch origin main
git reset --hard origin/main

echo "==> 4. Dependencies"
npm ci

echo "==> 5. Build (VPS-optimized)"
export NODE_OPTIONS="--max-old-space-size=4096"
if ! npm run build:vps; then
  echo "ERROR: Build failed. Check logs above."
  exit 1
fi

if [ ! -d .next ]; then
  echo "ERROR: .next folder missing after build."
  exit 1
fi
echo "    Build OK (.next present)"

echo "==> 6. Seed data"
npm run seed:admin || true
npm run seed:hr || true

echo "==> 7. PM2 restart"
pm2 delete nepatronix 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "==> 8. Wait for app..."
sleep 5

echo "==> 9. Health check"
if curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 | grep -qE '^(200|307|308)$'; then
  echo "    App responding on port 3000"
else
  echo "ERROR: App not responding. PM2 logs:"
  pm2 logs nepatronix --lines 40 --nostream
  exit 1
fi

echo "==> 10. Nginx reload"
nginx -t && systemctl reload nginx

echo ""
echo "Recovery complete. Test: curl -I http://127.0.0.1:3000"
echo "Then open: https://www.nepatronix.org"
