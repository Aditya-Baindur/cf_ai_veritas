<p align="center">
  <img 
    src="https://cdn.adityabaindur.dev/veritas-ai/chat_logo.png" 
    alt="Veritas AI Logo"
    width="120"
  />
</p>

<h1 align="center">Veritas AI</h1>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)

[![Cloudflare](https://img.shields.io/badge/Cloudflare-Edge%20Platform-F38020?logo=cloudflare)](https://cloudflare.com)

[![Cloudflare Workers](https://img.shields.io/badge/Workers-Compute-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com/)

[![Cloudflare D1](https://img.shields.io/badge/D1-Database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)

[![Cloudflare Workflows](https://img.shields.io/badge/Workflows-Orchestration-F38020?logo=cloudflare)](https://developers.cloudflare.com/workflows/)

[![pnpm](https://img.shields.io/badge/pnpm-8-blue?logo=pnpm)](https://pnpm.io/)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=nodedotjs)](https://nodejs.org/)

Veritas Ai is a Cloudflare‑native AI assistant platform built as a
real‑world demonstration of edge‑first architecture, multi‑step workflow
orchestration, and persistent memory using Cloudflare's ecosystem.

Live Demo: [https://chat.adityabaindur.dev]()
Repository: [https://github.com/Aditya-Baindur/cf_ai_veritas]()

---

## Overview

Veritas AI provides:

- A general chat assistant for natural‑language queries\
- A developer‑mode assistant for generating Cloudflare architectures
  and code\
- Multi‑agent workflows for search, reasoning, and synthesis\
- Persistent chat history and memory\
- A modern Next.js frontend optimized for global edge delivery

This project is designed to showcase how Cloudflare Workers, Workflows,
D1, Pages, R2, and Workers AI can be combined into a full‑stack,
production‑style AI system.

---

## Technology Stack

**Frontend** - Next.js (App Router) - Tailwind CSS + shadcn/ui -
Markdown rendering - Dynamic preview panels (graph and code)

**Backend** - Cloudflare Workers (core compute) - Cloudflare Workflows
(multi‑step orchestration) - Cloudflare Workers AI (LLM execution) -
Cloudflare D1 (persistent SQL storage) - Cloudflare R2 (asset storage
and edge caching)

**Model** - llama‑3.3‑70b‑instruct‑fp8‑fast (via Workers AI)

---

## Architecture

### Worker Internals

![Worker Internals](./assets/worker_overview.svg)

This diagram illustrates the internal flow of a request through the
Cloudflare Worker, including classification, workflow routing, model
execution, memory persistence, and response assembly.

---

### System Flow

![System Architecture](./assets/arch.svg)

This diagram shows the end‑to‑end system architecture from the frontend
to the worker, workflows, databases, and response delivery.

---

## Core Features

- Multi‑agent workflows (Search, Reasoning, Developer)\
- Token‑aware prompt management and truncation\
- Persistent memory stored in D1\
- Architecture diagram generation (Mermaid)\
- Failsafe JSON auto‑repair for graph generation\
- Exportable SVG architecture diagrams\
- Edge‑first deployment with zero cold‑start backend

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/Aditya-Baindur/cf_ai_veritas
cd cf_ai_veritas
```

### Install all dependencies

```bash
npm run i-all
```

This installs dependencies for: - Root tooling\

- frontend/\
- ai-worker/

---

### Run the frontend

```bash
npm run frontend
```

---

### Run the backend

```bash
npm run backend
```

---

## Deployment

1. Authenticate Wrangler

```bash
wrangler login
```

2. Deploy the Worker

```bash
npm run deploy
```

3. Set environment variables

```bash
API_BASE=<your-worker-url>
```

4. Deploy the frontend

```bash
cd frontend
pnpm run build
wrangler pages deploy dist
```

---

## AI Prompts

All prompts used for orchestration and generation are documented in:

PROMPTS.md

This includes: - System prompts\

- Workflow prompts\
- Graph generation prompts\
- Failsafe repair prompts

---

## Repository Structure

    cf_ai_veritas/
    ├── frontend/        # Next.js UI
    ├── ai-worker/       # Cloudflare Worker + Workflows
    ├── assets/          # Architecture diagrams
    ├── PROMPTS.md       # AI prompt documentation
    └── package.json     # Root tooling + scripts

---

## Tradeoffs and Future Work

**Current Limitations** - Higher latency for large prompts (70B model) -
No per‑user rate limiting - Heuristic Mermaid graph auto‑repair

**Planned Improvements** - Durable Objects for per‑user chat state\

- Queues for async workflow fan‑out\
- Token streaming to the frontend\
- Cost‑aware model routing\
- Voice input via Realtime Workers

---

## License

MIT

---

## Purpose

This project was built to explore:

- AI‑powered applications at the edge\
- Multi‑agent orchestration with Workflows\
- Persistent memory without external databases\
- Practical latency constraints at Internet scale
