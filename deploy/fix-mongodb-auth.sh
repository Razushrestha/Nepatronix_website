#!/usr/bin/env bash
# Fix MongoDB "Command find requires authentication" on VPS.
# Run as root: bash deploy/fix-mongodb-auth.sh

set -euo pipefail

echo "==> Checking MongoDB status..."
systemctl is-active mongod >/dev/null || systemctl start mongod

echo "==> Testing connection without auth..."
if mongosh "mongodb://127.0.0.1:27017/nepatronix" --quiet --eval "db.runCommand({ ping: 1 })" 2>/dev/null; then
  echo "OK: MongoDB accepts unauthenticated local connections."
  echo "Ensure .env.local has:"
  echo '  MONGODB_URI=mongodb://127.0.0.1:27017/nepatronix'
  exit 0
fi

echo "==> Auth required. Checking mongod.conf..."
CONF=/etc/mongod.conf
if grep -q 'authorization: enabled' "$CONF" 2>/dev/null; then
  echo "Disabling authorization for local VPS use (127.0.0.1 only)..."
  sed -i 's/^\(\s*\)authorization: enabled/\1# authorization: enabled/' "$CONF"
  systemctl restart mongod
  sleep 2
  if mongosh "mongodb://127.0.0.1:27017/nepatronix" --quiet --eval "db.runCommand({ ping: 1 })"; then
    echo "OK: Auth disabled. Use MONGODB_URI=mongodb://127.0.0.1:27017/nepatronix"
    exit 0
  fi
fi

echo ""
echo "Could not auto-fix. Create a MongoDB user manually:"
echo ""
echo "  mongosh"
echo '  use nepatronix'
echo '  db.createUser({ user: "nepatronix", pwd: "YOUR_PASSWORD", roles: [{ role: "readWrite", db: "nepatronix" }] })'
echo ""
echo "Then set in /var/www/nepatronix/.env.local:"
echo '  MONGODB_URI=mongodb://nepatronix:YOUR_PASSWORD@127.0.0.1:27017/nepatronix?authSource=nepatronix'
exit 1
