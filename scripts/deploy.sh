#!/usr/bin/env bash
# Tarik kode terbaru, (re)build stack produksi, lalu sinkronkan konten
# site.config.js ke database (aman: ucapan & statistik tidak terhapus).
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"

git pull --ff-only || echo "git pull dilewati (bukan repo git / tidak ada remote)"

# Pastikan file hasil generate sesuai site.config.js
if command -v node >/dev/null 2>&1; then
  node scripts/generate.mjs
else
  docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app node:20-alpine node scripts/generate.mjs
fi

$COMPOSE up -d --build

# Tunggu MariaDB sehat lalu terapkan konten (idempotent)
set -a; . ./.env; set +a
for i in $(seq 1 30); do
  $COMPOSE exec -T mariadb healthcheck.sh --connect --innodb_initialized >/dev/null 2>&1 && break
  sleep 2
done
$COMPOSE exec -T mariadb sh -c \
  "exec mariadb -u root -p\"$DB_ROOT_PASSWORD\" \"$DB_NAME\"" < database/init/03-content.sql \
  && echo "Konten database tersinkron."

$COMPOSE ps
docker image prune -f >/dev/null 2>&1 || true
echo "Deployed."
