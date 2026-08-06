#!/usr/bin/env bash
# One-time: install supercronic to ~/bin (static Go binary, no root needed)
# and add the login guard to ~/.profile so the scheduler revives on SSH login
# after a container restart.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION=v0.2.34
URL="https://github.com/aptible/supercronic/releases/download/$VERSION/supercronic-linux-amd64"

mkdir -p "$HOME/bin"
if [ ! -x "$HOME/bin/supercronic" ]; then
  curl -fsSL -o "$HOME/bin/supercronic" "$URL"
  chmod +x "$HOME/bin/supercronic"
  echo "installed $("$HOME/bin/supercronic" -version 2>&1 | head -1) → ~/bin/supercronic"
else
  echo "supercronic already installed: $("$HOME/bin/supercronic" -version 2>&1 | head -1)"
fi

GUARD="[ -x $SCRIPT_DIR/start-scheduler.sh ] && $SCRIPT_DIR/start-scheduler.sh >/dev/null 2>&1 || true # social-pipeline scheduler guard"
if ! grep -qF 'social-pipeline scheduler guard' "$HOME/.profile" 2>/dev/null; then
  printf '\n%s\n' "$GUARD" >> "$HOME/.profile"
  echo "added login guard to ~/.profile"
else
  echo "login guard already present in ~/.profile"
fi
