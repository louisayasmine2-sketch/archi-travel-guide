#!/usr/bin/env bash
# Starts supercronic (idempotent — safe to call from ~/.profile on every
# login). This box is a Docker container without systemd or cron, so the
# scheduler is a user process; see ops/README.md for the restart caveat.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN="$HOME/bin/supercronic"
PIDFILE=/tmp/supercronic.pid
LOG="$SCRIPT_DIR/../logs/supercronic.log"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  exit 0  # already running
fi
[ -x "$BIN" ] || { echo "supercronic not installed — run ops/install-scheduler.sh" >&2; exit 1; }

mkdir -p "$(dirname "$LOG")"
nohup "$BIN" "$SCRIPT_DIR/crontab" >>"$LOG" 2>&1 &
echo $! > "$PIDFILE"
echo "supercronic started (pid $(cat "$PIDFILE")), schedule: $SCRIPT_DIR/crontab"
