'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { useUser } from '@clerk/nextjs'
import { usePreviewPanel } from '../preview/PreviewPanelContext'
import { useSidebar } from '../ui/sidebar'

/* ----------------------------------------
   Types
---------------------------------------- */

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

type HistoryRow = {
  user: string
  assistant: string
}

interface ChatContextValue {
  input: string
  setInput: (v: string) => void
  messages: Message[]
  isTyping: boolean
  isProcessing: boolean
  isHydrated: boolean
  handleSend: () => void
  handleSendWithMessage: (content: string) => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/* ----------------------------------------
   Context
---------------------------------------- */

const ChatContext = createContext<ChatContextValue | null>(null)

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}

/* ----------------------------------------
   Helpers
---------------------------------------- */

function normalizeHistory(
  rows: HistoryRow[],
  decode: (text: string) => string
): Message[] {
  return rows.flatMap((row) => [
    { role: 'user', content: decode(row.user) },
    { role: 'assistant', content: decode(row.assistant) },
  ])
}

/* ----------------------------------------
   Provider
---------------------------------------- */

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser()

  const { setShowPreview } = usePreviewPanel()
  const { isPinned, setIsPinned, setHideTrigger } = useSidebar()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // prevents duplicate sends
  const inFlightRef = useRef(false)

  // assistant count ref (avoids stale closures)
  const assistantCountRef = useRef(0)

  useEffect(() => {
    assistantCountRef.current = messages.reduce(
      (acc, m) => acc + (m.role === 'assistant' ? 1 : 0),
      0
    )
  }, [messages])

  const decodeHTMLEntities = useCallback((text: string): string => {
    const t = document.createElement('textarea')
    t.innerHTML = text
    return t.value
  }, [])

  /* ----------------------------------------
     Load History (HYDRATION GATE)
  ---------------------------------------- */

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      try {
        const res = await fetch('/api/history/dev', { cache: 'no-store' })
        if (!res.ok) return

        const data: HistoryRow[] = await res.json()

        if (!cancelled && data.length > 0) {
          setMessages((prev) => {
            const history = normalizeHistory(data, decodeHTMLEntities)

            // If we already injected a user message, keep it
            if (prev.length === 0) return history

            return [...history, ...prev]
          })
        }
      } catch (err) {
        console.error('Failed to load history', err)
      } finally {
        if (!cancelled) {
          setIsHydrated(true)
        }
      }
    }

    loadHistory()

    return () => {
      cancelled = true
    }
  }, [decodeHTMLEntities])

  /* ----------------------------------------
     Poll assistant
  ---------------------------------------- */

  const waitForAssistant = useCallback(
    async (startingCount: number) => {
      while (true) {
        await new Promise((r) => setTimeout(r, 1000))

        const res = await fetch('/api/workflow/latest/dev', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!res.ok) continue

        const data: { count: number; assistant: string | null } =
          await res.json()

        if (data.count > startingCount && typeof data.assistant === 'string') {
          const assistantText = data.assistant

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: decodeHTMLEntities(assistantText),
            },
          ])
          return
        }
      }
    },
    [decodeHTMLEntities]
  )

  /* ----------------------------------------
     Send message
  ---------------------------------------- */

  const handleSendWithMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      if (!isSignedIn) return

      if (inFlightRef.current) {
        console.warn('Blocked duplicate send')
        return
      }

      inFlightRef.current = true
      setIsProcessing(true)
      setIsTyping(true)

      setMessages((prev) => [...prev, { role: 'user', content }])
      setInput('')

      // UI coordination
      setHideTrigger(true)
      if (isPinned) setIsPinned(false)
      setShowPreview(true)

      const startingCount = assistantCountRef.current

      try {
        const res = await fetch('/api/send?type=dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ msg: content }),
        })

        if (!res.ok) {
          throw new Error(`Send failed: ${res.status}`)
        }

        await waitForAssistant(startingCount)
      } catch (err) {
        console.error(err)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '🚨 Failed to process message.' },
        ])
      } finally {
        setIsTyping(false)
        setIsProcessing(false)
        inFlightRef.current = false
      }
    },
    [
      isPinned,
      isSignedIn,
      setHideTrigger,
      setIsPinned,
      setShowPreview,
      waitForAssistant,
    ]
  )

  const handleSend = () => {
    handleSendWithMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <ChatContext.Provider
      value={{
        input,
        setInput,
        messages,
        isTyping,
        isProcessing,
        isHydrated,
        handleSend,
        handleSendWithMessage,
        handleKeyDown,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
