#!/usr/bin/env bash
# Redeploy after git push — run on VPS from /var/www/nepatronix
# bash deploy/deploy.sh

set -euo pipefail

cd /var/www/nepatronix

echo "==> Pulling latest code..."
git pull origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build

echo "==> Restarting app..."
pm2 restart nepatronix || pm2 start ecosystem.config.js
pm2 save

echo "==> Done. Check: pm2 logs nepatronix --lines 30"
