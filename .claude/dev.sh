#!/bin/bash
# Single source of truth for running the dev server with a portless named URL.
#
# Used by BOTH:
#   - `pnpm dev`                  (manual / agents)         -> auto-picks a free port
#   - Claude Code preview         (runs `pnpm dev --port N`) -> uses the port it injects
#
# Every git worktree gets its OWN unique URL automatically, derived from its
# branch name — no per-worktree setup. Whatever port the server binds, this
# script publishes it through portless at that worktree-aware URL:
#   main branch        -> https://mitchdesigns.localhost:1355
#   worktree <branch>  -> https://<branch>.mitchdesigns.localhost:1355
# Because each worktree is on its own branch, parallel worktrees never collide:
# unique branch -> unique name -> unique URL, and each picks its own free port.
#
# Portless is optional: if it isn't installed, this just runs `next dev`.

set -uo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# portless needs Node 24+; pnpm lives in the pnpm home bin dir. Prepend if present.
[ -d "/Users/ojja/.nvm/versions/node/v24.15.0/bin" ] && export PATH="/Users/ojja/.nvm/versions/node/v24.15.0/bin:$PATH"
[ -d "/Users/ojja/Library/pnpm" ] && export PATH="/Users/ojja/Library/pnpm:$PATH"

# OpenNext dev spins up a workerd/Miniflare instance (initOpenNextCloudflareForDev).
# wrangler's shared global telemetry DB causes "SQLITE_BUSY" when two dev servers
# run at once (parallel worktrees), so disable metrics to keep them isolated.
export WRANGLER_SEND_METRICS=false

BASE_NAME="mitchdesigns"
PROXY_PORT="1355"

# --- worktree-aware portless name (mirrors portless' own branch-prefix scheme) ---
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
SLUG="$(printf '%s' "$BRANCH" | tr '[:upper:]' '[:lower:]' | tr '/' '-' | tr -cd 'a-z0-9-')"
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ] || [ -z "$SLUG" ]; then
  NAME="$BASE_NAME"
else
  NAME="$SLUG.$BASE_NAME"
fi
URL="https://$NAME.localhost:$PROXY_PORT"

# --- decide the bind port ---
# Preview injects `--port N`; honor it. Otherwise derive a stable per-branch port
# (below) so multiple worktrees running `pnpm dev` at once don't collide, then scan
# upward for the first free, non-reserved port.
PORT=""
args=("$@")
for ((i = 0; i < ${#args[@]}; i++)); do
  case "${args[$i]}" in
    --port) PORT="${args[$((i + 1))]:-}" ;;
    --port=*) PORT="${args[$i]#--port=}" ;;
  esac
done

EXTRA_ARGS=()
if [ -z "$PORT" ]; then
  # Deterministic per-branch base port so parallel worktrees don't fight over 3000:
  # main -> 3000; any other branch -> a stable port derived from its name.
  if [ "$NAME" = "$BASE_NAME" ]; then
    PORT=3000
  else
    H="$(printf '%s' "$NAME" | cksum | cut -d' ' -f1)"
    PORT=$((3100 + H % 2000))   # 3100-5099, stable per branch
  fi
  # Skip ports already in use and ports Chromium/Next refuse (reserved/"unsafe").
  RESERVED=" 3659 4045 5060 5061 6000 6566 6665 6666 6667 6668 6669 6697 "
  while lsof -ti:"$PORT" >/dev/null 2>&1 || [ "${RESERVED#*" $PORT "}" != "$RESERVED" ]; do
    PORT=$((PORT + 1))
  done
  EXTRA_ARGS=(--port "$PORT")   # pin Next to the port we chose
fi

# --- publish through portless once the server is accepting connections ---
if command -v portless >/dev/null 2>&1; then
  portless proxy start --port "$PROXY_PORT" --https >/dev/null 2>&1 || true
  (
    up=""
    for _ in $(seq 1 90); do
      if curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then up=1; break; fi
      sleep 1
    done
    # Only publish if the server actually came up, so a failed start never
    # clobbers another worktree's working alias.
    if [ -n "$up" ]; then
      portless alias "$NAME" "$PORT" >/dev/null 2>&1 || true
      echo ""
      echo "  [portless] $URL  ->  127.0.0.1:$PORT"
      echo ""
    fi
  ) &
else
  echo "[portless] not installed — serving on http://localhost:$PORT only"
fi

# --- run Next (turbopack); pin our chosen port for manual runs, forward preview flags ---
exec ./node_modules/.bin/next dev --turbopack "${EXTRA_ARGS[@]+${EXTRA_ARGS[@]}}" "$@"
