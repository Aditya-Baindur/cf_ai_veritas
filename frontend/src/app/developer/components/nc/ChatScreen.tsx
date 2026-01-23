'use client'

import { useEffect, useRef } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Send, Paperclip } from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { useChat } from './ChatProvider'

export default function ChatScreen() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    handleKeyDown,
    isTyping,
    isProcessing,
    isHydrated,
  } = useChat()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔥 prevents double auto-scroll on mount
  const hasAutoScrolledRef = useRef(false)

  /* ----------------------------------------
     🔥 SCROLL TO BOTTOM ON FIRST HYDRATION
  ---------------------------------------- */
  useEffect(() => {
    if (!isHydrated) return
    if (hasAutoScrolledRef.current) return

    hasAutoScrolledRef.current = true

    // wait for DOM paint
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' })
    })
  }, [isHydrated])

  /* ----------------------------------------
     LIVE AUTO-SCROLL (new messages / typing)
  ---------------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  /* ----------------------------------------
     AUTO-RESIZE TEXTAREA
  ---------------------------------------- */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = 'auto'
    const maxHeight = 144
    const nextHeight = Math.min(el.scrollHeight, maxHeight)

    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [input])

  /* ----------------------------------------
     HARD HYDRATION GATE
  ---------------------------------------- */

  if (!isHydrated) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Loading conversation…
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col overflow-hidden px-4">
      {/* ───────────── Messages ───────────── */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === 'user' ? 'text-right' : 'text-left'}
            >
              <div className="bg-muted inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm">
                <MarkdownRenderer>{m.content}</MarkdownRenderer>
              </div>
            </div>
          ))}

          {isTyping && (
            <p className="text-muted-foreground text-sm">Thinking…</p>
          )}
        </div>

        {/* 🔥 anchor for scrolling */}
        <div ref={bottomRef} />
      </div>

      {/* ───────────── Input Dock ───────────── */}
      <div className="border-t border-border bg-background pt-3">
        <Card className="rounded-xl p-0">
          <div className="flex flex-col">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Continue the conversation…"
              rows={1}
              disabled={isProcessing}
              className="max-h-36 min-h-12 resize-none rounded-xl border-0 px-4 py-3 text-sm focus-visible:ring-0"
            />

            <div className="flex items-center justify-end gap-2 px-3 pb-3">
              <Button
                variant="ghost"
                size="icon"
                disabled={isProcessing}
                className="h-8 w-8 rounded-full"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleSend}
                size="icon"
                variant="ghost"
                disabled={!input.trim() || isProcessing}
                className="h-8 w-8 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
