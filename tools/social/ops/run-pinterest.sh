#!/usr/bin/env bash
# Daily Pinterest publish: 07:00 WIB. Pins today's card from the batch that is
# already merged to main. Reads everything from origin/main, so an unmerged
# batch is invisible to it; a day with no card is a logged no-op, not an error.
# Credentials not yet installed in .env is also a no-op, with a Telegram
# reminder at most once every 3 days — ❌ stays reserved for real failures.
#
# Usage: run-pinterest.sh [--dry-run] [--date YYYY-MM-DD] [extra publisher flags]

. "$(dirname "$0")/lib.sh"

RUN_NAME="social pinterest publish"
LOG_FILE="$LOG_DIR/pinterest-$(date +%Y%m%d-%H%M%S).log"
exec >>"$LOG_FILE" 2>&1

TODAY=$(date +%Y-%m-%d)

log "=== $RUN_NAME start ($TODAY) ==="
load_env
acquire_lock
arm_failure_trap

PIN_ENV="${PINTEREST_ENV:-sandbox}"
log "environment: $PIN_ENV"

# The publisher fetches origin/main itself; update_repo keeps the checkout in
# step so a human looking at the box sees what the runner published from.
update_repo

OUTPUT_FILE=$(mktemp)
set +e
node "$SOCIAL_DIR/publish-pinterest.js" "$@" >"$OUTPUT_FILE" 2>&1
RC=$?
set -e
while read -r l; do log "publish: $l"; done <"$OUTPUT_FILE"

if [ "$RC" -ne 0 ]; then
  log "publisher exited $RC"
  rm -f "$OUTPUT_FILE"
  false   # hands over to on_failure: Telegram gets the log tail
fi

# The success line is prefixed "[SANDBOX] " outside production.
# `|| true` on both: a dry run matches neither pattern, and a grep miss under
# `set -e` would otherwise fire the failure trap on a successful run.
SUMMARY=$(grep -E '^(\[SANDBOX\] )?(published|already published|nothing scheduled)' "$OUTPUT_FILE" | tail -1 || true)
PIN_LINE=$(grep -E '^created pin ' "$OUTPUT_FILE" | tail -1 || true)
WAITING=$(grep -E '^waiting for credentials' "$OUTPUT_FILE" | tail -1 || true)
DRY=false
for a in "$@"; do [ "$a" = "--dry-run" ] && DRY=true; done
rm -f "$OUTPUT_FILE"

# Credentials not installed is a waiting state, not a failure: the daily run is
# a quiet no-op, and Telegram carries at most one reminder every 3 days so the
# alarm channel stays reserved for real failures.
if [ -n "$WAITING" ]; then
  log "waiting for credentials — quiet no-op (${WAITING})"
  CRED_REMINDER="$LOG_DIR/.pinterest-cred-reminder"
  if [ ! -f "$CRED_REMINDER" ] || [ -n "$(find "$CRED_REMINDER" -mmin +4320 2>/dev/null)" ]; then
    AUTH_FLAG=""
    [ "$PIN_ENV" = "sandbox" ] && AUTH_FLAG=" --sandbox"
    if telegram_send "⏳ ${RUN_NAME}

Publisher menunggu kredensial Pinterest — tools/social/.env belum berisi token untuk environment ${PIN_ENV}.
Pasang dengan: node tools/social/pinterest-auth.js${AUTH_FLAG}

Pengingat ini maksimal 1× per 3 hari; run harian lainnya no-op senyap."; then
      touch "$CRED_REMINDER"
    else
      log "credential reminder not sent — will retry on a later run"
    fi
  else
    log "credential reminder throttled (last sent under 3 days ago)"
  fi
  log "=== done ==="
  exit 0
fi

case "$SUMMARY" in
  nothing*|already*)
    # Quiet days stay quiet: no Telegram noise for a no-op.
    log "no notification sent (${SUMMARY})"
    ;;
  *)
    if $DRY; then
      log "dry run — no notification sent"
      release_lock
      log "=== done ==="
      exit 0
    fi
    PREFIX="✅"
    [ "$PIN_ENV" = "sandbox" ] && PREFIX="🧪 [SANDBOX]"
    telegram_send "${PREFIX} ${RUN_NAME}

${SUMMARY}
${PIN_LINE}

Log: ${LOG_FILE}"
    ;;
esac

log "=== done ==="
