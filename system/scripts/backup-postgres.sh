#!/usr/bin/env sh
set -eu

BACKUP_ROOT="${BACKUP_ROOT:-/opt/backups/zhiyu}"
TS="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_ROOT/$TS"
mkdir -p "$TARGET"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required for backup" >&2
  exit 1
fi

pg_dump -Fc "$DATABASE_URL" > "$TARGET/full.dump"
pg_dump --schema=zhiyu "$DATABASE_URL" > "$TARGET/schema-zhiyu.sql"
find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
echo "backup written to $TARGET"