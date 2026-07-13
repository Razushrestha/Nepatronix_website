#!/usr/bin/env bash
# Run on the VPS after uploading nepatronix-dump.zip from your PC.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Nepatronix blog + gallery import ==="

if ! command -v mongorestore >/dev/null 2>&1; then
  echo "mongorestore not found. Install with:"
  echo "  sudo apt update && sudo apt install -y mongodb-database-tools"
  exit 1
fi

ZIP=""
for candidate in nepatronix-dump.zip data/nepatronix-dump.zip; do
  if [ -f "$candidate" ]; then
    ZIP="$candidate"
    break
  fi
done

if [ ! -d data/nepatronix-dump/nepatronix ]; then
  if [ -n "$ZIP" ]; then
    echo "Unzipping $ZIP ..."
    unzip -o "$ZIP" -d data/
  else
    echo ""
    echo "ERROR: No dump found."
    echo "Upload from your PC first:"
    echo '  scp "C:\Users\razus\OneDrive\Desktop\Final_Nep\my-app\data\nepatronix-dump.zip" root@YOUR_VPS:/var/www/nepatronix/'
    exit 1
  fi
fi

node scripts/check-dump.mjs

echo ""
echo "Importing blog posts, gallery, and images..."
npm run db:import:blog

echo ""
echo "Rebuilding site..."
npm run build:vps
pm2 restart nepatronix

echo ""
echo "=== Final check ==="
node scripts/db-status.mjs
npm run db:verify:blog
