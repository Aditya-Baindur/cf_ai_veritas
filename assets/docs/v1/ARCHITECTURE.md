# Architecture

This document explains the architectural decisions behind the
`chat.adityabaindur.dev` monorepo.

---

## 🎯 Goals

- Single Git repository
- No submodules
- Clear ownership of tooling
- Cloudflare-first deployment model
- Minimal abstraction, maximum clarity

---

## 🧱 Monorepo Layout

```
repo root
│
├─ frontend/        → Next.js app (pnpm)
├─ gemini-worker/  → Cloudflare Worker (npm + wrangler)
└─ package.json    → Script dispatcher only
```

Each application is **fully self-contained**.

---

## 📦 Package Management Strategy

| Location      | Package Manager | Reason                  |
| ------------- | --------------- | ----------------------- |
| repo root     | none            | no dependencies         |
| frontend      | pnpm            | fast, strict, symlinked |
| gemini-worker | npm             | Wrangler compatibility  |

The root `package.json` exists only to route commands.

---

## 🚫 Why No Workspaces (Yet)

pnpm workspaces and Turborepo were intentionally avoided because:

- Cloudflare Pages expects a clear project root
- Worker and frontend have unrelated dependency graphs
- Tooling clarity > premature optimization

This setup can be upgraded later without breaking changes.

---

## 🔐 Environment Isolation

Each app manages its own environment variables:

- `frontend/` → `.env.local`
- `gemini-worker/` → Wrangler secrets / `.dev.vars`

Secrets are never shared implicitly.

---

## ☁️ Cloudflare Architecture

- **Frontend** → Cloudflare Pages
- **AI / Gemini calls** → Cloudflare Worker
- Network proximity handled by Cloudflare edge
- No traditional backend server required

---

## 🧠 Design Principles

- Explicit over implicit
- No magic dependency hoisting
- Each folder owns its runtime
- Root is infrastructure, not an app

---

## 🔮 Future Extensions

This architecture can evolve to support:

- pnpm workspaces
- Turborepo caching
- Shared type packages
- Worker ↔ Pages service bindings

Without requiring structural rewrites.

---

## 📌 Summary

This monorepo is designed to be:

- Understandable at a glance
- Safe to deploy
- Easy to extend
- Friendly to Cloudflare tooling

No unnecessary abstractions. No hidden coupling.
