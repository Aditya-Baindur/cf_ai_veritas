export BASE_URL="https://api.chat.adityabaindur.dev"

# Only resolve root if not already set or invalid
if [ -z "$root" ] || [ ! -d "$root/.git" ]; then
  if git rev-parse --show-toplevel >/dev/null 2>&1; then
    export root="$(git rev-parse --show-toplevel)"
  else
    echo "⚠️ Not inside a git repo — keeping existing root: $root"
  fi
fi

unalias f 2>/dev/null
unalias d 2>/dev/null
unalias o 2>/dev/null
unalias t 2>/dev/null
unalias fd 2>/dev/null

f() {
  local current_path="$PWD"

  if [ ! -f "$root/package.json" ]; then
    echo "❌ Invalid project root: $root"
    return 1
  fi

  cd "$root" || return
  npm run format
  cd "$current_path" || return
}

d() {
  cd "$root" || return
  npm run deploy
}

o() {
  open "$BASE_URL"
}

t() {
  cd "$root" || return
  npm run tail
}

fd() {
  f
  d
}

# Load local env vars (API keys, secrets)
[ -f "$root/.env.zsh" ] && source "$root/.env.zsh"

echo "Loaded local zsh config: $root"
