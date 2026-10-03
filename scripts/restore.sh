#!/usr/bin/env bash
# Restore the database from a backup file (.sql.gz or .sql). DESTRUCTIVE.
# Usage: ./scripts/restore.sh backups/<app>_<db>_YYYYMMDD-HHMMSS.sql.gz
set -euo pipefail
cd "$(dirname "$0")/.."
COMPOSE="docker compose -f docker-compose.prod.yml"

file="${1:-}"
[ -n "$file" ] && [ -f "$file" ] || { echo "Usage: $0 <backup .sql.gz|.sql>"; exit 1; }

set -a; . ./.env; set +a
: "${DB_NAME:?}"; : "${DB_ROOT_PASSWORD:?}"

echo "WARNING: this will OVERWRITE database '$DB_NAME' with '$file'."
read -r -p "Type the database name to confirm: " confirm
[ "$confirm" = "$DB_NAME" ] || { echo "Aborted."; exit 1; }

reader="cat"; case "$file" in *.gz) reader="gzip -dc";; esac
echo "[$(date -Is)] Restoring..."
$reader "$file" | $COMPOSE exec -T mariadb sh -c \
  "exec mariadb -u root -p\"$DB_ROOT_PASSWORD\" \"$DB_NAME\""
echo "[$(date -Is)] Restore complete."
