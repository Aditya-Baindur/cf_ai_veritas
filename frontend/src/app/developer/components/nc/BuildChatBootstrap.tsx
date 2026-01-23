'use client'

import { useEffect, useRef } from 'react'
import { useChatNavigationStore } from '../../store/chatNavigation'
import { useChat } from './ChatProvider'
import { usePreviewPanel } from '../preview/PreviewPanelContext'
import { useSidebar } from '../ui/sidebar'
import { usePathname } from 'next/navigation'

export function BuildChatBootstrap() {
  const pathname = usePathname()

  const pendingMessage = useChatNavigationStore((s) => s.pendingMessage)
  const clearPendingMessage = useChatNavigationStore(
    (s) => s.clearPendingMessage
  )

  const { handleSendWithMessage, setInput, isHydrated } = useChat()
  const { setShowPreview } = usePreviewPanel()
  const { setHideTrigger, setIsPinned } = useSidebar()

  const hasRunRef = useRef(false)
  const hasOpenedPreviewRef = useRef(false)

  /* ---------------------------
     🔥 AUTO-OPEN GRAPH ON LOAD
  --------------------------- */
  useEffect(() => {
    if (!isHydrated) return
    if (hasOpenedPreviewRef.current) return

    // only on /developer/build
    if (pathname?.includes('/developer/build')) {
      hasOpenedPreviewRef.current = true

      // force preview open
      setHideTrigger(true)
      setIsPinned(false)
      setShowPreview(true)
    }
  }, [isHydrated, pathname, setShowPreview, setHideTrigger, setIsPinned])

  /* ---------------------------
     Pending message handling
  --------------------------- */
  useEffect(() => {
    if (!pendingMessage) return
    if (!isHydrated) return
    if (hasRunRef.current) return

    hasRunRef.current = true

    const msg = pendingMessage.trim()
    if (!msg) {
      clearPendingMessage()
      return
    }

    setInput('')
    ;(async () => {
      await handleSendWithMessage(msg)
      clearPendingMessage()
    })()
  }, [
    pendingMessage,
    isHydrated,
    handleSendWithMessage,
    clearPendingMessage,
    setInput,
  ])

  return null
}
