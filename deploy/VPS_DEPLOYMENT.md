# Deploy Nepatronix to VPS (163.47.151.250)

Full stack on one server: **Next.js + Admin + APIs + MongoDB**.

## Architecture

```
nepatronix.org  →  Cloudflare DNS (optional)  →  163.47.151.250
                                                    ├── Nginx :80/443
                                                    ├── Next.js :3000 (PM2)
                                                    └── MongoDB :27017
```

## 1. DNS (Cloudflare)

Keep Cloudflare nameservers at your **domain registrar**. In **Cloudflare → DNS**:

| Type | Name | Content           | Proxy   |
|------|------|-------------------|---------|
| A    | `@`  | `163.47.151.250`  | Proxied |
| A    | `www`| `163.47.151.250`  | Proxied |

**SSL/TLS** → **Full (strict)** after you install Let's Encrypt on the VPS.

**Cache rules** — bypass cache for:
- `/admin/*`
- `/api/*`

Disable **Cloudflare Pages** if it was serving the old site.

## 2. One-time VPS setup

SSH into the server:

```bash
ssh root@163.47.151.250
```

Run:

```bash
cd /var/www
git clone https://github.com/Razushrestha/Nepatronix_website.git nepatronix
cd nepatronix
bash deploy/vps-setup.sh
```

Or manually:

```bash
apt update && apt install -y nodejs nginx git mongodb-org
npm install -g pm2
cd /var/www && git clone https://github.com/Razushrestha/Nepatronix_website.git nepatronix
cd nepatronix
cp deploy/.env.production.example .env.local
nano .env.local
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

## 3. Environment file

Edit `/var/www/nepatronix/.env.local`:

```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://nepatronix.org
MONGODB_URI=mongodb://127.0.0.1:27017/nepatronix
JWT_SECRET=<long-random-string>
ADMIN_SECRET=<strong-password>
ADMIN_EMAIL=admin@nepatronix.org
WEB3FORMS_KEY=<your-key>
```

**Never commit `.env.local` to GitHub.**

## 4. MongoDB + seed data

```bash
# Check MongoDB is running
systemctl status mongod

# Seed admin user + homepage content (first time)
cd /var/www/nepatronix
npm run seed:admin
npm run seed:content
npm run db-status   # optional check via scripts/db-status.mjs
```

Admin login: `https://nepatronix.org/admin/login`

## 5. SSL (HTTPS)

```bash
certbot --nginx -d nepatronix.org -d www.nepatronix.org
```

## 6. Migrate data from your PC

If your local MongoDB has the real content:

```bash
# On your Windows PC (with MongoDB tools)
mongodump --uri="mongodb://127.0.0.1:27017/nepatronix" --out=./nepatronix-dump
scp -r ./nepatronix-dump root@163.47.151.250:/tmp/

# On VPS
mongorestore --uri="mongodb://127.0.0.1:27017/nepatronix" --drop /tmp/nepatronix-dump/nepatronix
pm2 restart nepatronix
```

## 7. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

MongoDB stays on `127.0.0.1` only — do not expose port 27017 publicly.

## 8. Redeploy after code changes

```bash
cd /var/www/nepatronix
bash deploy/deploy.sh
```

## 9. Verify

```bash
pm2 status
pm2 logs nepatronix --lines 50
curl -I http://127.0.0.1:3000
```

From your PC:

```bash
npm run verify -- https://nepatronix.org
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `cd nepatronix: No such file` | Run `git clone` first |
| `npm ci` fails | Must run inside `/var/www/nepatronix` |
| Build OOM | Enable swap (see `vps-setup.sh`) |
| Admin login fails | Run `npm run seed:admin`, check `JWT_SECRET` |
| Empty site | Run `npm run seed:content` or restore mongodump |
| 502 Bad Gateway | `pm2 restart nepatronix`, check `pm2 logs` |
