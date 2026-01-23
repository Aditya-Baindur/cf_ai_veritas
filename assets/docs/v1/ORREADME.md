# chat.adityabaindur.dev

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://developers.cloudflare.com/workers/)
[![pnpm](https://img.shields.io/badge/pnpm-8-blue?logo=pnpm)](https://pnpm.io/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Private-lightgrey)](#license)

Monorepo for **chat.adityabaindur.dev**, containing a Next.js frontend and a Cloudflare Worker that powers Gemini-based AI functionality.

This repository is intentionally structured for clarity, explicit tooling, and reliable Cloudflare deployments.

---

## 📁 Repository Structure

```text
chat.adityabaindur.dev/
├─ frontend/        # Next.js frontend (pnpm)
├─ gemini-worker/  # Cloudflare Worker (Wrangler / npm)
├─ package.json    # Root script dispatcher (no deps)
└─ README.md
```

---

## ✨ What’s Inside

### `frontend/`

- Next.js (App Router)
- Tailwind CSS + shadcn/ui
- Uses **pnpm**
- Deployed via **Cloudflare Pages**

### `gemini-worker/`

- Cloudflare Worker
- Wraps the Google Gemini API
- Uses **Wrangler** + **npm**
- Deployed to **Cloudflare Workers**

---

## 🚀 Development

### Frontend

```bash
pnpm run dev:frontend
```

### Gemini Worker

```bash
pnpm run dev:worker
```

All commands are run from the repo root.

---

## 📦 Deployment

### Frontend (Cloudflare Pages)

| Setting         | Value        |
| --------------- | ------------ |
| Root directory  | `frontend`   |
| Package manager | `pnpm`       |
| Build command   | `pnpm build` |
| Build output    | `.next`      |

### Gemini Worker

```bash
pnpm run deploy:worker
```

---

## 🧰 Root Scripts

The root `package.json` acts only as a **command router**:

```json
{
  "private": true,
  "scripts": {
    "dev:frontend": "pnpm --dir frontend dev",
    "build:frontend": "pnpm --dir frontend build",
    "dev:worker": "npm --prefix gemini-worker run dev",
    "deploy:worker": "npm --prefix gemini-worker run deploy"
  }
}
```

No dependencies or lockfiles live at the root.

---

## 📐 Architecture

For detailed design decisions and rationale, see  
👉 **[ARCHITECTURE.md](ARCHITECTURE.md)**

---

## 📄 License

Private repository.  
All rights reserved.

![Architecture Diagram](https://cdn.adityabaindur.dev/veritas-ai/v1/arch.png)
