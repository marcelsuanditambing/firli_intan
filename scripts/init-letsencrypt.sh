#!/usr/bin/env bash
# Obtain the first Let's Encrypt certificate, then start serving HTTPS.
# Run once after DNS for DOMAIN (and www) points at this server.
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"

[ -f .env ] || { echo "ERROR: .env not found (copy .env.production.example)"; exit 1; }
set -a; . ./.env; set +a
: "${DOMAIN:?set DOMAIN in .env}"
: "${CERTBOT_EMAIL:?set CERTBOT_EMAIL in .env}"

live="/etc/letsencrypt/live/$DOMAIN"
staging_arg=""; [ "${CERTBOT_STAGING:-0}" != "0" ] && staging_arg="--staging"

echo "### 1/5 dummy certificate so nginx can boot"
$COMPOSE run --rm --entrypoint "sh -c \"mkdir -p $live && \
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout $live/privkey.pem -out $live/fullchain.pem -subj '/CN=localhost' && \
  cp $live/fullchain.pem $live/chain.pem\"" certbot

echo "### 2/5 dhparams (one-time, may take a minute)"
$COMPOSE run --rm --entrypoint "sh -c \"[ -f /etc/letsencrypt/ssl-dhparams.pem ] || \
  openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048\"" certbot

echo "### 3/5 starting nginx"
$COMPOSE up -d nginx

echo "### 4/5 replacing dummy with real certificate"
$COMPOSE run --rm --entrypoint "sh -c \"rm -rf /etc/letsencrypt/live/$DOMAIN \
  /etc/letsencrypt/archive/$DOMAIN /etc/letsencrypt/renewal/$DOMAIN.conf\"" certbot
$COMPOSE run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot \
  $staging_arg -d $DOMAIN -d www.$DOMAIN \
  --email $CERTBOT_EMAIL --agree-tos --no-eff-email --force-renewal" certbot

echo "### 5/5 reloading nginx"
$COMPOSE exec nginx nginx -s reload || $COMPOSE restart nginx
echo "Done. https://$DOMAIN should now be live (allow a few seconds)."
