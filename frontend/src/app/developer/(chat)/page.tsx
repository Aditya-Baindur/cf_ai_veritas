'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChatProvider, useChat } from '../components/nc/ChatProvider'
import WelcomeScreen from '../components/nc/WelcomeScreen'

export const runtime = 'edge'

function DeveloperBootstrap() {
  const router = useRouter()
  const { isHydrated, messages } = useChat()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isHydrated) return

    // If history exists → go straight to build
    if (messages.length > 0) {
      router.replace('/developer/build')
      return
    }

    // Otherwise show welcome
    setChecked(true)
  }, [isHydrated, messages, router])

  if (!checked) {
    return (
      <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
        Loading your workspace…
      </div>
    )
  }

  return <WelcomeScreen />
}

export default function DeveloperPage() {
  return (
    <ChatProvider>
      <DeveloperBootstrap />
    </ChatProvider>
  )
}
