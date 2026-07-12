#!/usr/bin/env bash
# One-time VPS setup for Nepatronix (Ubuntu 22.04/24.04)
# Run as root: bash deploy/vps-setup.sh

set -euo pipefail

APP_DIR="/var/www/nepatronix"
REPO="https://github.com/Razushrestha/Nepatronix_website.git"

echo "==> Updating system..."
apt update && apt upgrade -y

echo "==> Installing Node.js 20..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
node -v && npm -v

echo "==> Installing MongoDB..."
if ! command -v mongod &>/dev/null; then
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
  echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" \
    > /etc/apt/sources.list.d/mongodb-org-7.0.list
  apt update
  apt install -y mongodb-org
fi
systemctl enable mongod
systemctl start mongod

echo "==> Installing Nginx, Git, PM2..."
apt install -y nginx git certbot python3-certbot-nginx
npm install -g pm2

echo "==> Adding swap (helps Next.js build on small VPS)..."
if [ ! -f /swapfile ]; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> Cloning app (skip if already exists)..."
mkdir -p /var/www
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

if [ ! -f .env.local ]; then
  cp deploy/.env.production.example .env.local
  echo ""
  echo "IMPORTANT: Edit $APP_DIR/.env.local with your secrets before building!"
  echo "  nano $APP_DIR/.env.local"
fi

echo "==> Installing dependencies..."
npm ci

echo "==> Nginx site config..."
cp deploy/nginx-nepatronix.conf /etc/nginx/sites-available/nepatronix
ln -sf /etc/nginx/sites-available/nepatronix /etc/nginx/sites-enabled/nepatronix
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx

echo ""
echo "Setup complete. Next steps:"
echo "  1. nano $APP_DIR/.env.local"
echo "  2. cd $APP_DIR && npm run build"
echo "  3. pm2 start ecosystem.config.js && pm2 save && pm2 startup"
echo "  4. certbot --nginx -d nepatronix.org -d www.nepatronix.org"
echo "  5. npm run seed:admin && npm run seed:content  (first time only)"
echo "  6. Point Cloudflare A record @ and www to 163.47.151.250"
