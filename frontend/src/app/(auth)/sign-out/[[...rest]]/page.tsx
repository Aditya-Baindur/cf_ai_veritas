'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export const runtime = 'edge'

export default function SignOutPage() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-terminal font-mono text-terminal-foreground">
      {/* terminal grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* sign-out container */}
      <div className="relative z-10 w-full max-w-md space-y-6 rounded-lg border border-terminal-border bg-terminal-widget p-6">
        {/* header */}
        <div className="space-y-1 text-center">
          <p className="text-xs tracking-widest text-terminal-muted">
            SESSION CONTROL
          </p>
          <h1 className="text-lg text-terminal-foreground">
            End Active Session
          </h1>
        </div>

        {/* sign out button */}
        <button
          disabled={loading}
          onClick={async () => {
            if (loading) return
            setLoading(true)

            try {
              setLoading(true)
              await new Promise((r) => setTimeout(r, 400))
              await signOut()
              router.replace('/')
            } catch (e) {
              console.error('Sign out failed:', e)
              setLoading(false)
            }
          }}
          className={`mx-auto flex w-[85%] items-center justify-center gap-2 rounded-sm bg-terminal-foreground py-2 font-mono tracking-wide text-terminal transition ${loading ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90'} `}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              TERMINATING…
            </>
          ) : (
            'SIGN OUT'
          )}
        </button>

        {/* back link */}
        {!loading && (
          <div className="flex justify-center">
            <Link
              href="/"
              className="w-[85%] rounded-sm border border-terminal-border py-2 text-center text-xs tracking-widest text-terminal-muted transition hover:border-terminal-accent hover:text-terminal-foreground"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
