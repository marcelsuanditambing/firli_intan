#!/usr/bin/env bash
# Dump the MariaDB database to ./backups, gzip it, and rotate old backups.
# Cron example (daily 02:30):
#   30 2 * * * cd /opt/<folder-situs> && ./scripts/backup.sh >> /var/log/<app>-backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

set -a; . ./.env; set +a
: "${DB_NAME:?}"; : "${DB_ROOT_PASSWORD:?}"
APP="${APP_NAME:-babysite}"

mkdir -p backups
ts="$(date +%Y%m%d-%H%M%S)"
out="backups/${APP}_${DB_NAME}_${ts}.sql.gz"

echo "[$(date -Is)] Backing up '$DB_NAME' -> $out"
$COMPOSE exec -T mariadb sh -c \
  "exec mariadb-dump --single-transaction --routines --triggers --events \
   -u root -p\"$DB_ROOT_PASSWORD\" \"$DB_NAME\"" | gzip -9 > "$out"

# Integrity check: a valid gzip with content
if ! gzip -t "$out" || [ ! -s "$out" ]; then
  echo "ERROR: backup verification failed; removing $out"; rm -f "$out"; exit 1
fi

echo "[$(date -Is)] OK ($(du -h "$out" | cut -f1)). Pruning backups older than ${RETENTION_DAYS}d"
find backups -name "${APP}_*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -print -delete
