'use client'

import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Send, Paperclip } from 'lucide-react'
import { useChat } from './ChatProvider'
import suggestedPrompts from './suggestedPrompts'
import { useChatNavigationStore } from '../../store/chatNavigation'

export default function WelcomeScreen() {
  const { input, setInput, isProcessing } = useChat()
  const router = useRouter()

  const setPendingMessage = useChatNavigationStore((s) => s.setPendingMessage)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = 'auto'
    const maxHeight = 144
    const nextHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [input])

  const handleWelcomeSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isProcessing) return

    setPendingMessage(trimmed)
    setInput('')

    router.push('/developer/build')
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="mb-2 text-4xl font-medium">
        What do you want to build today?
      </h1>

      <Card className="mb-8 w-full max-w-2xl rounded-xl p-0">
        <div className="flex w-full flex-col">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleWelcomeSend()
              }
            }}
            placeholder="What do you want to build?"
            rows={1}
            className="max-h-36 min-h-12 w-full resize-none rounded-xl border-0 px-4 py-3 text-sm focus-visible:ring-0"
          />

          <div className="flex items-center justify-end gap-2 px-3 pb-3">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleWelcomeSend}
              size="icon"
              variant="ghost"
              disabled={!input.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 lg:grid-cols-2">
        {suggestedPrompts.map((p) => (
          <Button
            key={p}
            variant="outline"
            className="w-full justify-start rounded-xl p-4 text-left"
            onClick={() => setInput(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  )
}
