#!/usr/bin/env bash
# Daily pg_dump backup of the supabase Postgres into /opt/backups/zhiyu/<ts>/.
# Retention: 30 days.
set -euo pipefail

BACKUP_ROOT="/opt/backups/zhiyu"
TS=$(date -u +%Y%m%dT%H%M%SZ)
DEST="$BACKUP_ROOT/$TS"
mkdir -p "$DEST"

DB_CONTAINER=${DB_CONTAINER:-supabase-db}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-postgres}

echo "[backup] dumping $DB_CONTAINER:$DB_NAME -> $DEST/zhiyu.dump"
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -n zhiyu -Fc \
  > "$DEST/zhiyu.dump"

echo "[backup] pruning items older than 30 days"
find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +30 -print -exec rm -rf {} +

echo "[backup] done"
