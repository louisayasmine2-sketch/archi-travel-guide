#!/usr/bin/env bash
# Shared plumbing for the social pipeline runners. Sourced, not executed.
# Conventions: fail fast, log everything with timestamps, never leave a
# half-committed branch, never die silently — every failure reaches Telegram.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOCIAL_DIR="$(dirname "$SCRIPT_DIR")"
REPO="$(cd "$SOCIAL_DIR/../.." && pwd)"
LOG_DIR="$SOCIAL_DIR/logs"
LOCK_DIR="/tmp/social-pipeline.lock"
GITHUB_REPO_URL="https://github.com/louisayasmine2-sketch/archi-travel-guide"

mkdir -p "$LOG_DIR"

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*"; }

# ---- .env -------------------------------------------------------------------
load_env() {
  local envfile="$SOCIAL_DIR/.env"
  [ -f "$envfile" ] || { log "FATAL: $envfile missing"; exit 1; }
  # shellcheck disable=SC1090
  set -a; . "$envfile"; set +a
  : "${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN missing in .env}"
  : "${TELEGRAM_CHAT_ID:?TELEGRAM_CHAT_ID missing in .env}"
}

# ---- Telegram ---------------------------------------------------------------
# telegram_send "message text" — plain text, no preview. Returns curl/API rc.
telegram_send() {
  local resp
  resp=$(curl -sS --max-time 30 \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=$1" \
    --data-urlencode "disable_web_page_preview=true") || { log "telegram: curl failed"; return 1; }
  if ! printf '%s' "$resp" | grep -q '"ok":true'; then
    log "telegram: API refused: $resp"
    return 1
  fi
  log "telegram: sent (message_id $(printf '%s' "$resp" | grep -o '"message_id":[0-9]*' | head -1 | cut -d: -f2))"
}

# ---- locking ----------------------------------------------------------------
acquire_lock() {
  if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    log "another run holds $LOCK_DIR — exiting"
    exit 0
  fi
  echo "$$ $(date -Is)" > "$LOCK_DIR/pid"
}
release_lock() { rm -rf "$LOCK_DIR"; }

# ---- failure handling -------------------------------------------------------
# Runners set RUN_NAME and LOG_FILE, then call arm_failure_trap. Any non-zero
# exit sends the log tail to Telegram and cleans up worktree + branch.
WT=""
BATCH_BRANCH=""
arm_failure_trap() {
  trap 'on_failure $?' ERR
  trap 'release_lock' EXIT
}
on_failure() {
  local rc=$1
  log "FAILED (rc=$rc) — cleaning up"
  cleanup_worktree
  local tail_txt
  tail_txt=$(tail -n 15 "$LOG_FILE" 2>/dev/null || echo 'no log')
  telegram_send "❌ ${RUN_NAME} FAILED (rc=$rc) on $(hostname) at $(date '+%H:%M %Z')

Last log lines:
${tail_txt}

Full log: ${LOG_FILE}" || true
  release_lock
  exit "$rc"
}
cleanup_worktree() {
  if [ -n "$WT" ] && [ -d "$WT" ]; then
    git -C "$REPO" worktree remove --force "$WT" 2>/dev/null || rm -rf "$WT"
    git -C "$REPO" worktree prune 2>/dev/null || true
  fi
  if [ -n "$BATCH_BRANCH" ] && git -C "$REPO" show-ref --quiet "refs/heads/$BATCH_BRANCH"; then
    # Only delete if unpushed — a pushed branch is a completed run.
    if ! git -C "$REPO" show-ref --quiet "refs/remotes/origin/$BATCH_BRANCH"; then
      git -C "$REPO" branch -D "$BATCH_BRANCH" 2>/dev/null || true
    fi
  fi
}

# ---- repo -------------------------------------------------------------------
update_repo() {
  if [ -n "$(git -C "$REPO" status --porcelain)" ]; then
    log "working tree dirty — skipping git pull, running from current HEAD"
  else
    git -C "$REPO" pull --ff-only 2>&1 | while read -r l; do log "git: $l"; done || {
      log "git pull failed — continuing from current HEAD"
    }
  fi
  log "HEAD: $(git -C "$REPO" log --oneline -1)"
}

make_worktree() {
  WT=$(mktemp -d /tmp/social-wt.XXXXXX)
  rmdir "$WT"
  git -C "$REPO" worktree add -b "$BATCH_BRANCH" "$WT" HEAD >/dev/null
  log "worktree $WT on branch $BATCH_BRANCH"
}

# Everything the batch may touch. Anything else appearing in git status fails
# the run before commit.
ALLOWED_PATHS_RE='^(tools/social/|social-output/)'
assert_only_allowed_changes() {
  local bad
  bad=$(git -C "$WT" status --porcelain | awk '{print $2}' | grep -Ev "$ALLOWED_PATHS_RE" || true)
  if [ -n "$bad" ]; then
    log "FATAL: run touched files outside tools/social + social-output:"
    printf '%s\n' "$bad" | while read -r l; do log "  $l"; done
    return 1
  fi
}

# ---- chromium libs (no root; recipe from tools/social/README.md) ------------
ensure_chromelibs() {
  local libdir=/tmp/chromelibs/usr/lib/x86_64-linux-gnu
  if [ ! -d "$libdir/nss" ]; then
    log "chromium system libs missing — downloading to /tmp/chromelibs"
    mkdir -p /tmp/chromelibs/debs
    (cd /tmp/chromelibs/debs &&
      apt-get download libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 \
        libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 \
        libasound2t64 libatspi2.0-0t64 libdrm2 libxi6 >/dev/null &&
      for d in *.deb; do dpkg-deb -x "$d" ..; done)
  fi
  export LD_LIBRARY_PATH="$libdir:$libdir/nss${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
  if ! ls "$HOME/.cache/ms-playwright" 2>/dev/null | grep -q chromium; then
    log "playwright chromium missing — installing"
    (cd "$SOCIAL_DIR" && PUPPETEER_SKIP_DOWNLOAD=true npx playwright install chromium >/dev/null)
  fi
}

# ---- claude -p --------------------------------------------------------------
# run_claude <mode_block_file> — runs headless claude in the worktree with
# tightly scoped permissions. No Bash, no web, writes only the week file and
# queue.json. Never uses --dangerously-skip-permissions.
run_claude() {
  local mode_file=$1
  local prompt
  prompt="$(cat "$SOCIAL_DIR/PROMPT.md"; printf '\n\n'; cat "$mode_file")"
  (cd "$WT" && claude -p "$prompt" \
    --allowedTools "Read" "Glob" "Grep" \
      "Edit(tools/social/weeks/**)" \
      "Edit(tools/social/queue.json)" \
    --disallowedTools "Bash" "WebFetch" "WebSearch" "Task" "NotebookEdit" \
    --max-turns 50 \
    2>&1) | while read -r l; do log "claude: $l"; done
}

# ---- summaries --------------------------------------------------------------
batch_summary() { # <weekFile>
  node -e '
    const d = require(process.argv[1]);
    for (const f of [...d.facts].sort((a,b)=>a.day-b.day))
      console.log(`day${f.day} ${f.date} — ${f.id} — ${f.figure} → ${f.targetPath}`);
  ' "$1"
}

compare_link() { echo "$GITHUB_REPO_URL/compare/main...$BATCH_BRANCH"; }
