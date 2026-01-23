'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

import ChatUI from '@/components/ChatUI'

export default function DashboardPage() {
  const router = useRouter()

  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()

  // Redirect unauthenticated users
  useEffect(() => {
    if (authLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [authLoaded, isSignedIn, router])

  // Loading state (auth + user)
  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex h-screen items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">Loading your Chat</p>
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    )
  }

  // Safety guard (should never hit, but prevents crashes)
  if (!isSignedIn || !user) {
    return null
  }

  return <ChatUI />
}
