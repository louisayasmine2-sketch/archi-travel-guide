# Social pipeline ops

Unattended production loop for the fact-card batches. Publishing stays
manual (Postiz later): each run pushes a dated branch and sends a Telegram
message with the compare link; merging and scheduling happen from a phone.

## Moving parts

| Piece | What it does |
|---|---|
| `../harvest.js` | Mines dated, figure-bearing sentences verbatim from `frontend/src/data/` into `../queue.json` (status `candidate`). Deterministic; never invents. |
| `../PROMPT.md` | Frozen production prompt for headless `claude -p`: selection rules, editorial absolutes, output schema. Claude writes only `../weeks/<WEEK>.json` + queue status updates. |
| `../verify.js` | Pre-commit gate: verbatim figures and quotes, direction-with-counts (RECONCILE.md), banned phrases, UTM/path hygiene. A failing gate fails the run. |
| `run-weekly.sh` | Sunday 20:00 WIB — next week's 7 packages → branch `social/<ISO-week>` → push → Telegram. `--test` flag for E2E rehearsals. |
| `run-daily.sh` | 06:30 WIB — if an article's `datePublished` is today, one same-day promo package → branch `social/promo-<date>` → push → Telegram. Clean silent no-op otherwise. |
| `run-pinterest.sh` | 07:00 WIB — pins today's card to Pinterest via `../publish-pinterest.js`, reading the batch from `origin/main` only. No card today, or already pinned: logged no-op, no Telegram. |
| `../publish-pinterest.js` + `../pinterest-auth.js` | Pinterest API v5 client: OAuth with rotating refresh tokens, one pin a day from the merged batch, readback before anything is recorded. Sandbox by default; refuses production until Standard access. See `../README.md` and `../STANDARD-APPLICATION.md`. |
| `lib.sh` | Shared: .env loading, timestamped logs, locking, Telegram, worktree isolation, failure trap, chromium-libs bootstrap. |
| `crontab` + `start-scheduler.sh` + `install-scheduler.sh` | supercronic schedule (see below). |

## Why supercronic, not systemd timers

This box is a Docker container: PID 1 is `sh`, there is no systemd, no cron
daemon, no `crontab` binary, and no root to install any of them. supercronic
is a single static binary running as a user process — the only scheduler
this environment can host. The trade-offs and mitigations:

- **Container restart kills it.** A guard in `~/.profile` (added by
  `install-scheduler.sh`) revives it on the next SSH login. For zero-gap
  scheduling, add `tools/social/ops/start-scheduler.sh` to the container's
  entrypoint on the host — that part is outside this repo's reach.
- No catch-up runs after downtime: a missed Sunday slot means running
  `run-weekly.sh` by hand (it is idempotent — it exits if the week's branch
  already exists on origin).
- **Schedule changes need a reload.** supercronic reads `crontab` once at
  start. `start-scheduler.sh` now passes `-inotify`, so an edited or newly
  merged crontab reloads in place — but an instance started before that change
  has to be restarted once for the flag to take effect:
  `kill "$(cat /tmp/supercronic.pid)" && ops/start-scheduler.sh`.

## Runner guarantees

- **Isolation:** all generation happens in a throwaway `git worktree`; the
  main checkout is never dirtied (its `git pull` is skipped if you left
  uncommitted work there).
- **No half-committed branches:** the batch is committed once, at the end,
  only after `verify.js` and a path allowlist check pass; any failure removes
  the worktree and the unpushed branch.
- **No silent death:** every failure sends the log tail to Telegram; every
  run logs with timestamps to `../logs/`.
- **Scoped headless permissions:** `claude -p` runs with read-only repo
  access plus writes to exactly two paths (`weeks/<WEEK>.json`, `queue.json`);
  Bash/web/subagents disallowed; no `--dangerously-skip-permissions`.
- **Human gate intact:** runs push dated branches, never merge, never PR
  (the GitHub token stays Contents-only).

## Routine operations

```bash
ops/install-scheduler.sh   # once: supercronic → ~/bin, guard → ~/.profile
ops/start-scheduler.sh     # start (idempotent; auto on SSH login)
kill "$(cat /tmp/supercronic.pid)"          # stop
tail -f ../logs/supercronic.log             # scheduler log
ls -t ../logs/ | head                       # recent run logs
ops/run-weekly.sh --test   # E2E rehearsal on a social/test-e2e-* branch
ops/run-pinterest.sh --dry-run --verbose    # Pinterest publish, no API call
node ../publish-pinterest.js --dry-run --date 2026-08-12 --verbose
```

After merging `tools/social-pipeline` into main, keep the repo checkout on
`main` (`git checkout main`) — the runners execute whatever code the checkout
has, and pull it before each run.

Telegram credentials live in `../.env` (gitignored); `../.env.example`
documents the BotFather steps.
