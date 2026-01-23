# cf_ai_veritas_edge_assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Edge%20Platform-F38020?logo=cloudflare)](https://cloudflare.com)
[![Cloudflare Workers](https://img.shields.io/badge/Workers-Compute-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/D1-Database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Cloudflare Workflows](https://img.shields.io/badge/Workflows-Orchestration-F38020?logo=cloudflare)](https://developers.cloudflare.com/workflows/)

![AI-CF Agent](https://img.shields.io/badge/AI-CF%20Agent-orange?logo=cloudflare)

[![pnpm](https://img.shields.io/badge/pnpm-8-blue?logo=pnpm)](https://pnpm.io/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=nodedotjs)](https://nodejs.org/)

## Overview

Veritas AI is a Cloudflare Native platform which allows users to chat to Lamma 3.3 and build architechtures for their projects.

## Why Cloudflare

Why Workers, Workflows, D1, Workers AI.

I chose cloudflare as I already had experience with their different products. But more specifically, the choice of different products go as follow.

Workflow -> CF workflow allowed me to have multi-agent orchestration. For example, the [main](https://chat.adityabaindur.dev/dashboard) has 3 states, Search, Normal, Reasoning

D1 -> Simple sqlLite db which is always online, making it much better than supabase or such products as it is always online.

Worker AI -> Am using [llama-3.3-70b-instruct-fp8](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/)-fast on cloudflare worker

R2 -> I host all my assets on my own R2 Bucket which i use for edge level caching. CDN

<p align="center">
  <br />
  <img 
    src="./assets/worker_overview.svg"
    alt="Veritas AI Worker Internals"
    width="900"
  />
  <br />
</p>

<p align="center">
  <sub>End-to-end request flow inside the Veritas AI Cloudflare Worker.</sub>
</p>

## Architecture

Diagram + explanation.

<p align="center">
  <br />
  <img 
    src="./assets/arch.svg"
    alt="Overall Flow"
    width="900"
  />
  <br />
</p>
<p align="center">
  <sub>Overall Arch.</sub>
</p>

## Features

Bullet list (classification, workflows, memory, etc.).

## Running Locally

Steps using wrangler + Pages.

### Clone the repo

```bash
git clone https://github.com/Aditya-Baindur/cf_ai_veritas
cd cf_ai_veritas

```

### Install all dependencies from root

```bash
npm run i-all

```

### Run Frontend

```bash
npm run frontend

```

### Run Backend

```bash
npm run backend

```

## Deployment

How it’s deployed on Cloudflare.

To deploy, you do :

```bash

wrangler login


```

then follow the steps to login

## AI Prompts

Link or reference PROMPTS.md.

## Tradeoffs & Future Work

Shows maturity.
