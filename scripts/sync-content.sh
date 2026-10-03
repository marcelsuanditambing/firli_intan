#!/usr/bin/env bash
# =============================================================================
# Terapkan perubahan site.config.js ke situs yang SUDAH berjalan.
#   1. generate ulang file konten (seed SQL, config frontend, favicon)
#   2. terapkan konten ke database yang sedang jalan
#      (ucapan & statistik pengunjung TIDAK terhapus)
#   3. rebuild frontend (teks, foto, tema ikut berubah)
#
# Pakai:
#   ./scripts/sync-content.sh                 # stack produksi (docker-compose.prod.yml)
#   COMPOSE_FILE=docker-compose.yml ./scripts/sync-content.sh   # stack lokal
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
COMPOSE="docker compose -f $COMPOSE_FILE"

[ -f .env ] || { echo "ERROR: .env tidak ditemukan"; exit 1; }
set -a; . ./.env; set +a
: "${DB_NAME:?}"; : "${DB_ROOT_PASSWORD:?}"

echo "### 1/3 generate konten dari site.config.js"
if command -v node >/dev/null 2>&1; then
  node scripts/generate.mjs
else
  # Server tanpa Node.js: jalankan generator di container sementara
  docker run --rm -v "$PWD":/app -w /app node:20-alpine node scripts/generate.mjs
fi

echo "### 2/3 terapkan konten ke database"
$COMPOSE exec -T mariadb sh -c \
  "exec mariadb -u root -p\"$DB_ROOT_PASSWORD\" \"$DB_NAME\"" < database/init/03-content.sql

echo "### 3/3 rebuild frontend"
$COMPOSE up -d --build frontend

echo "Selesai. Konten situs sudah diperbarui."
