#!/usr/bin/env bash
# Run on the VPS after uploading data/nepatronix-dump.zip
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Nepatronix blog + gallery import ==="

if [ ! -d data/nepatronix-dump/nepatronix ]; then
  if [ -f data/nepatronix-dump.zip ]; then
    echo "Unzipping data/nepatronix-dump.zip ..."
    unzip -o data/nepatronix-dump.zip -d data/
  else
    echo "Missing data/nepatronix-dump/ — upload nepatronix-dump.zip first."
    exit 1
  fi
fi

npm run db:import:blog
npm run build:vps
pm2 restart nepatronix

echo ""
echo "Done. Check:"
echo "  node scripts/db-status.mjs"
echo "  curl -s http://127.0.0.1:3000/blog | head"
