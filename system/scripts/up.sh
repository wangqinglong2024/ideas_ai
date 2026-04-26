#!/usr/bin/env bash
# Idempotent stack bring-up. Usage:  ./up.sh [--no-build]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/docker"

if [[ ! -f .env ]]; then
  echo "[up] .env missing — copying from .env.example"
  cp .env.example .env
fi

# Port preflight (refuse to start if a port is busy and not owned by zhiyu).
for PORT in 3100 4100 8100 9100; do
  if ss -tlnp 2>/dev/null | awk '{print $4}' | grep -q ":${PORT}$"; then
    OWNER=$(docker ps --format '{{.Names}} {{.Ports}}' | awk -v p=":${PORT}->" '$0 ~ p {print $1; exit}')
    if [[ -z "$OWNER" || "$OWNER" != zhiyu-* ]]; then
      echo "[up] FATAL port ${PORT} is already in use by '${OWNER:-unknown}'." >&2
      exit 2
    fi
  fi
done

ARGS=(up -d --remove-orphans)
if [[ "${1:-}" != "--no-build" ]]; then
  ARGS+=(--build)
fi

docker compose "${ARGS[@]}"

echo "[up] waiting for healthchecks ..."
ATTEMPTS=40
for i in $(seq 1 $ATTEMPTS); do
  STATE=$(docker compose ps --format json 2>/dev/null | tr -d '\n' || true)
  UNHEALTHY=$(docker compose ps --format '{{.Name}} {{.Status}}' | grep -E 'unhealthy|starting' | wc -l | tr -d ' ')
  if [[ "$UNHEALTHY" == "0" ]]; then
    echo "[up] all containers healthy"
    docker compose ps
    exit 0
  fi
  sleep 3
done

echo "[up] some containers failed to become healthy:"
docker compose ps
exit 1
