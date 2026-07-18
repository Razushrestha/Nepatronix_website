#!/usr/bin/env bash
# Patch nginx upload limits without removing certbot SSL lines.
# Run on VPS: bash deploy/patch-nginx-uploads.sh

set -euo pipefail

SITE="${1:-/etc/nginx/sites-available/nepatronix}"

if [ ! -f "$SITE" ]; then
  echo "ERROR: nginx site not found: $SITE"
  exit 1
fi

echo "==> Patching nginx upload limits in $SITE"

# Backup
sudo cp -a "$SITE" "${SITE}.bak.$(date +%Y%m%d%H%M%S)"

# Unlimited body size (0 = no limit in nginx)
if grep -q 'client_max_body_size' "$SITE"; then
  sudo sed -i 's/client_max_body_size[^;]*;/client_max_body_size 0;/g' "$SITE"
else
  sudo sed -i '/server {/a \    client_max_body_size 0;' "$SITE"
fi

# Long timeouts for large video uploads
for key in proxy_read_timeout proxy_send_timeout client_body_timeout; do
  if grep -q "$key" "$SITE"; then
    sudo sed -i "s/${key}[^;]*;/${key} 3600s;/g" "$SITE"
  else
    sudo sed -i "/client_max_body_size 0;/a\\    ${key} 3600s;" "$SITE"
  fi
done

# Dedicated upload route (insert once if missing)
if ! grep -q 'location /api/hr/upload' "$SITE"; then
  sudo sed -i '/location \/ {/i\
    location /api/hr/upload {\
        client_max_body_size 0;\
        proxy_pass http://127.0.0.1:3000;\
        proxy_http_version 1.1;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_read_timeout 3600s;\
        proxy_send_timeout 3600s;\
        client_body_timeout 3600s;\
        proxy_request_buffering off;\
    }\
' "$SITE"
fi

sudo nginx -t
sudo systemctl reload nginx

echo "==> nginx upload limits patched (client_max_body_size 0, 1h timeouts)"
grep client_max_body_size "$SITE" || true
