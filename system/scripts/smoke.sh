#!/usr/bin/env bash
# Smoke-test the four public ports. Returns non-zero on failure.
set -euo pipefail

HOST=${1:-115.159.109.23}
FAILED=0

check() {
  local name="$1" url="$2" expect="$3"
  echo -n "[smoke] $name $url ... "
  CODE=$(curl -sS -o /tmp/_z_smoke -w '%{http_code}' --max-time 5 "$url" || echo '000')
  if [[ "$CODE" == "$expect" || ("$expect" == "2xx" && "$CODE" =~ ^2) ]]; then
    echo "OK ($CODE)"
  else
    echo "FAIL ($CODE)"
    FAILED=1
  fi
}

check 'app-fe' "http://$HOST:3100/" '2xx'
check 'admin-fe' "http://$HOST:4100/" '2xx'
check 'app-be /health' "http://$HOST:8100/health" '200'
check 'admin-be /health' "http://$HOST:9100/health" '200'
check 'app-be /ready' "http://$HOST:8100/ready" '200'
check 'admin-be /ready' "http://$HOST:9100/ready" '200'

if [[ "$FAILED" != "0" ]]; then
  echo '[smoke] FAILED'
  exit 1
fi
echo '[smoke] all checks passed'
