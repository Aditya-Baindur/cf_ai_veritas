'use client'

import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, Loader2 } from 'lucide-react'
import PreviewButton from '../preview/PreviewButton'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header({
  onMobileMenuClick,
  isChatScreen,
}: {
  onMobileMenuClick?: () => void
  isChatScreen?: boolean
}) {
  const { user } = useUser()
  const { signOut } = useClerk()

  const router = useRouter()
  const [devLoading, setDevLoading] = useState(false)

  return (
    <header className="w-full bg-background">
      <div className="flex w-full items-center justify-between p-2">

        {/* LEFT */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuClick}
            className="md:hidden"
          >
            <Menu size={24} />
          </Button>

          <Link href="/" className="flex items-center">
            <Image
              src="https://cdn.adityabaindur.dev/veritas-ai/chat_logo.png"
              alt="Veritas Ai logo"
              width={32}
              height={32}
              priority
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {isChatScreen && <PreviewButton />}

          {/* dashboard */}
          <button
            onClick={() => {
              if (devLoading) return
              setDevLoading(true)
              router.push('/dashboard')
            }}
            disabled={devLoading}
            className="
              text-xs font-mono 
              text-muted-foreground 
              hover:text-foreground 
              hover:underline
              transition-colors
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
              <span>{"> General Question? "}</span>
            )}
          </button>

          {/* AUTH */}
          {user ? (
            <div className="flex items-center space-x-2">
              <UserButton />
              <button
                onClick={() => signOut({ redirectUrl: '/sign-out' })}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
