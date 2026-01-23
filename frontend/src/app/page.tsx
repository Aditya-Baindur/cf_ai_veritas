'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Github,
  ArrowDown,
  ArrowRight,
  Cpu,
  Sparkles,
  Network,
  GitBranch,
  Database,
  Workflow,
} from 'lucide-react'
import { DASH_URL, DEV_URL } from '@/utils/config'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ================= VISUAL FX ================= */

function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-terminal-accent/40 absolute h-1 w-1 rounded-full"
          initial={{
            x: Math.random() * 2000 - 500,
            y: Math.random() * 1200 - 300,
            opacity: 0,
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function DataStreams() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="via-terminal-success/40 absolute top-0 h-full w-px bg-gradient-to-b from-transparent to-transparent"
          style={{ left: `${10 + i * 12}%` }}
          animate={{ y: ['-120%', '120%'] }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/* ================= MAIN ================= */

export default function Landing() {
  // IMPORTANT: viewport-based scroll ONLY (no container ref = no jumps)
  const { scrollYProgress } = useScroll()
  const archOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-terminal font-mono text-terminal-foreground">
      {/* FX */}
      <ParticleField />
      <DataStreams />

      {/* GRID */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        animate={{ backgroundPosition: ['0px 0px', '80px 80px'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </motion.div>

      {/* ================= HEADER ================= */}
      <header className="bg-terminal-widget/80 sticky top-0 z-30 border-b border-terminal-border backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Image
            src="/images/mainlogo.png"
            alt="Veritas AI"
            width={100}
            height={80}
            priority
          />

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={DASH_URL}>General</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="border border-terminal-border bg-transparent hover:bg-terminal-header"
            >
              <Link href={DEV_URL}>Developer</Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <a href="/github" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative z-10 flex min-h-[calc(100dvh-80px)] items-center py-10">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-[1fr_1.3fr]">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center space-y-8"
          >
            <h1 className="text-5xl leading-tight tracking-tight lg:text-6xl">
              Design, reason about, and run{' '}
              <span className="text-terminal-accent selection:bg-black">
                Cloudflare-native
              </span>{' '}
              AI systems
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-terminal-muted">
              Veritas AI is a Cloudflare-first AI platform with two focused
              products: an architecture builder for developers, and a
              multi-workflow AI assistant running entirely on Workers,
              Workflows, D1, KV, and Workers AI.
            </p>

            <div className="flex gap-4 pt-2">
              <Button
                asChild
                className="border border-terminal-accent bg-transparent hover:bg-terminal-header"
              >
                <Link href={DEV_URL} className="flex items-center gap-2">
                  Enter Developer <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={DASH_URL}>General Mode</Link>
              </Button>
            </div>

            {/* FLOW ICON STRIP */}
            <div className="flex gap-6 pt-8 text-xs text-terminal-muted">
              <div className="flex items-center gap-1">
                <Network className="h-4 w-4 text-terminal-accent selection:bg-black" />{' '}
                Pages
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="h-4 w-4 text-terminal-success selection:bg-black" />{' '}
                Workers
              </div>
              <div className="flex items-center gap-1">
                <Workflow className="h-4 w-4 text-terminal-danger" /> Workflows
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4 text-terminal-muted" /> D1 / KV /
                R2
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div className="relative flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="relative w-full max-w-2xl" // ⬅ MUCH wider (md → 2xl)
            >
              {/* glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="from-terminal-accent/30 via-terminal-success/30 to-terminal-danger/30 absolute -inset-10 rounded-full bg-gradient-to-r blur-3xl"
              />

              {/* frame */}
              <div className="relative rounded-2xl border border-terminal-border bg-terminal-widget p-3 shadow-2xl">
                <video
                  src="https://cdn.adityabaindur.dev/veritas-ai/videos/dev-video.mov"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="// ⬅ MUCH taller max-h-[620px] w-full rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* SCROLL CUE */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-xs text-terminal-muted"
          >
            <span>Follow the execution path</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </div>
      </section>

      {/* ================= EXECUTION PATH ================= */}
      <section className="relative z-10 mx-auto max-w-6xl space-y-14 px-6 py-24">
        <h2 className="text-center text-3xl tracking-tight">
          Every request becomes an execution graph
        </h2>

        <div className="grid gap-14 text-center md:grid-cols-4">
          {[
            ['User Input', 'Request enters Pages or API'],
            ['Workers', 'Validation, routing, context'],
            ['Workflows', 'Multi-step orchestration'],
            ['AI + State', 'Workers AI, D1, KV, R2'],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="space-y-3"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-terminal-border bg-terminal-widget">
                {i === 0 && <Network />}
                {i === 1 && <Cpu />}
                {i === 2 && <GitBranch />}
                {i === 3 && <Sparkles />}
              </div>
              <div className="font-medium">{title}</div>
              <div className="text-xs text-terminal-muted">{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ARCH REVEAL ================= */}
      <motion.section
        style={{ opacity: archOpacity }}
        className="relative z-10 mx-auto max-w-6xl px-6 py-20"
      >
        <div className="rounded-xl border border-terminal-border bg-terminal-widget p-6 shadow-xl">
          <Image
            src="/images/flow.svg"
            alt="Architecture"
            width={1200}
            height={800}
            className="rounded-lg"
          />
          <p className="mt-4 text-center text-xs text-terminal-muted">
            Full end-to-end execution graph generated and visualized in real
            time
          </p>
        </div>
      </motion.section>

      {/* ================= PRODUCT SPLIT ================= */}
      <section className="relative z-10 grid border-t border-terminal-border py-24 md:grid-cols-2">
        {/* DEVELOPER */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-terminal-widget/40 flex items-center justify-center"
        >
          <div className="max-w-md space-y-6 p-10">
            <h2 className="text-3xl tracking-tight text-terminal-accent selection:bg-black">
              Developer Mode
            </h2>

            <p className="text-sm leading-relaxed text-terminal-muted">
              Describe the system you want to build. Veritas compiles a complete
              Cloudflare architecture and explains every decision.
            </p>

            <ul className="space-y-2 text-xs text-terminal-muted">
              <li>
                • Architecture graphs (Pages → Workers → Workflows → State)
              </li>
              <li>• Deterministic product selection</li>
              <li>• Reasoned explanations for every component</li>
              <li>• Visualized data flow and execution</li>
            </ul>

            <Button
              asChild
              className="border border-terminal-accent bg-transparent hover:bg-terminal-header"
            >
              <Link href={DEV_URL} className="flex items-center gap-2">
                Enter Developer Mode <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* GENERAL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-terminal-widget/30 flex items-center justify-center"
        >
          <div className="max-w-md space-y-6 p-10">
            <h2 className="text-3xl tracking-tight text-terminal-success selection:bg-black">
              General Mode
            </h2>

            <p className="text-sm leading-relaxed text-terminal-muted">
              A multi-workflow AI assistant running entirely on Cloudflare
              infrastructure. Each mode executes through its own orchestration
              pipeline.
            </p>

            <ul className="space-y-2 text-xs text-terminal-muted">
              <li>• Normal, Search, and Reasoning workflows</li>
              <li>• Persistent memory in D1 and KV</li>
              <li>• Step-level orchestration with Workflows</li>
              <li>• Edge-native execution across regions</li>
            </ul>

            <Button
              asChild
              className="border border-terminal-success bg-transparent hover:bg-terminal-header"
            >
              <Link href={DASH_URL} className="flex items-center gap-2">
                Enter General Mode <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-terminal-border px-6 py-8 text-xs text-terminal-muted">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>© {new Date().getFullYear()} Veritas AI</span>
          <span className="text-terminal-accent selection:bg-black">
            Edge-native • Deterministic • Auditable • Cloudflare-first
          </span>
        </div>
      </footer>
    </div>
  )
}
