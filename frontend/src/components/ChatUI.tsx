'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, MessageSquare, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'

import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { useUser } from '@clerk/nextjs'
import { AssistantMapAvatar } from './AssistantAvatar'

import Link from 'next/link'

import Image from 'next/image'

type ChatMessage = {
  sender: 'user' | 'assistant'
  content: string
}

type HistoryRow = {
  user: string
  assistant: string
}

function normalizeHistory(rows: HistoryRow[]): ChatMessage[] {
  return rows.flatMap((row) => [
    { sender: 'user', content: row.user },
    { sender: 'assistant', content: row.assistant },
  ])
}

export default function ChatUI() {
  const { user } = useUser()

  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter();
  const [devLoading, setDevLoading] = useState(false);


  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      try {
        const res = await fetch('/api/history', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const data: HistoryRow[] = await res.json()

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setChatHistory(normalizeHistory(data))
        }
      } catch (err) {
        console.error('Failed to load history', err)
      }
    }

    loadHistory()

    return () => {
      cancelled = true
    }
  }, [])

  // ----------------------------------------------------
  // CORE LOGIC: wait until backend DB has a new record
  // ----------------------------------------------------
  const waitForAssistant = async (startingCount: number) => {
    while (true) {
      await new Promise((r) => setTimeout(r, 1000))

      const res = await fetch('/api/workflow/latest', {
        method: 'GET',
        cache: 'no-store',
      })

      if (!res.ok) continue

      const data: { count: number; assistant: string | null } = await res.json()

      if (data.count > startingCount) {
        const assistant = data.assistant
        if (assistant === null) return

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'assistant',
            content: assistant, // ← now guaranteed string
          },
        ])
        return
      }
    }
  }

  // ----------------------------------------------------
  // SEND MESSAGE
  // ----------------------------------------------------
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const sentMessage = message
    setMessage('')

    const startingCount = chatHistory.filter(
      (m) => m.sender === 'assistant'
    ).length

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', content: sentMessage },
    ])

    try {
      setIsLoading(true)

      // Kick off workflow (fire-and-forget)
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: sentMessage }),
      })

      // 2️⃣ Wait until DB has new record
      await waitForAssistant(startingCount)
    } catch (err) {
      console.error(err)
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: '🚨 Failed to process message.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
  const renderMarkdown = (content: string) => (
    <MarkdownRenderer>{content}</MarkdownRenderer>
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-terminal font-mono text-terminal-foreground">
      {/* TERMINAL GRID */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10 border-b border-terminal-border bg-terminal-widget">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/mainlogo.png"
              alt="AI Logo"
              width={200}
              height={100}
            />

            <div>
              <p className="text-sm">{'> Veritas AI'}</p>
              <p className="text-[10px] text-terminal-muted">
                Secure Reasoning Console
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
<button
  onClick={() => {
    if (devLoading) return;
    setDevLoading(true);
    router.push("/developer");
  }}
  disabled={devLoading}
  className="
    text-xs font-mono 
    text-terminal-muted 
    hover:text-terminal-accent 
    hover:underline
    transition-colors
    relative
    z-20
    flex items-center gap-2
    disabled:opacity-70
    disabled:cursor-not-allowed
  "
>
  {devLoading ? (
    <>
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>{"> loading"}</span>
    </>
  ) : (
    <span>{"> developer"}</span>
  )}
</button>


            {/* Welcome badge */}
            <Badge
              variant="outline"
              className="border-terminal-border p-4 text-xs text-terminal-muted"
            >
              Welcome {user?.fullName} !
            </Badge>

            {/* Power / Sign out */}
            <Link href="/sign-out">
              <Button variant="ghost" size="icon">
                <Power className="h-4 w-4 hover:text-white/30" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CHAT LOG */}
      <ScrollArea className="relative z-10 flex-1 px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-5">
          {chatHistory.length === 0 && (
            <div className="flex h-[60vh] flex-col items-center justify-center text-xs text-terminal-muted">
              <MessageSquare className="mb-3 h-8 w-8 opacity-50" />
              <p>{'> Awaiting input_'}</p>
            </div>
          )}

          {chatHistory.map((chat, i) => (
            <div
              key={i}
              className={`flex ${
                chat.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {chat.sender === 'assistant' && (
                <Avatar className="mr-2 h-7 w-7 border border-terminal-border">
                  <AssistantMapAvatar />
                </Avatar>
              )}

              <div
                className={`max-w-[75%] whitespace-pre-wrap border px-3 py-2 text-sm ${
                  chat.sender === 'user'
                    ? 'border-terminal-accent text-terminal-foreground'
                    : 'border-terminal-border bg-terminal-widget'
                }`}
              >
                {renderMarkdown(chat.content)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-terminal-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Thinking</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* INPUT BAR */}
      <div className="relative z-10 border-t border-terminal-border bg-terminal-widget px-4 py-3">
        <form
          onSubmit={handleMessageSubmit}
          className="mx-auto flex max-w-5xl items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="> enter command"
            disabled={isLoading}
            className="border-terminal-border bg-transparent font-mono text-terminal-foreground placeholder:text-terminal-muted focus:ring-1 focus:ring-terminal-accent"
          />

          <Button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="border border-terminal-border bg-transparent hover:bg-terminal-header"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
