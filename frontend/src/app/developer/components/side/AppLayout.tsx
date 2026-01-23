'use client'

import {
  RightSidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar'
import { memo, useEffect, useState } from 'react'
import AppSidebar from './app-sidebar'
import Header from '../header'
import PreviewPanel from '../preview'
import { useIsMobile } from '../../hooks/use-mobile'
import { usePathname } from 'next/navigation'
import { usePreviewPanel } from '../preview/PreviewPanelContext'
import { useAuth, SignInButton } from '@clerk/nextjs'

const ContentArea = memo(function ContentArea({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  const pathname = usePathname()
  const isChatScreen = pathname?.includes('/')

  return (
    <div
      className={`relative h-full w-full overflow-auto bg-background ${
        !isChatScreen
          ? 'rounded-x-xl rounded-t-xl border-x border-t border-border px-4'
          : ''
      }`}
      style={style}
    >
      {!isChatScreen && (
        <SidebarTrigger className="absolute left-4 top-4 z-10 hidden md:flex" />
      )}
      {children}
    </div>
  )
})

function MobileSidebarControl() {
  const isMobile = useIsMobile()
  const { setOpen, setIsPinned } = useSidebar()
  useEffect(() => {
    if (isMobile) {
      setIsPinned(false)
      setOpen(false)
    }
  }, [isMobile, setIsPinned, setOpen])
  return null
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isPreviewOpen, togglePreview, showPreview } = usePreviewPanel()
  const [sidebarWidth, setSidebarWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth * 0.4 : 500
  )
  const pathname = usePathname()
  const isChatScreen = pathname?.includes('/')
  const isMobile = useIsMobile()
  const { isLoaded, isSignedIn } = useAuth()

  const handleSidebarWidthChange = (newWidth: number) => {
    requestAnimationFrame(() => {
      setSidebarWidth(newWidth)
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarWidth(window.innerWidth * 0.4)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      if (isPreviewOpen) {
        const currentPercent = sidebarWidth / window.innerWidth
        setSidebarWidth(window.innerWidth * currentPercent)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isPreviewOpen, sidebarWidth])

  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-xl font-semibold">Please sign in to continue</p>
        <SignInButton mode="modal">
          <button className="bg-primary rounded-md px-4 py-2 text-white transition hover:opacity-90">
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  }

  return (
    <SidebarProvider open={desktopOpen} setOpen={setDesktopOpen} defaultPinned>
      <MobileSidebarControl />
      <main className="flex h-screen w-full flex-col overflow-x-hidden bg-background">
        <Header
          onMobileMenuClick={() => setMobileOpen(true)}
          isChatScreen={isChatScreen}
        />
        <div className="max-w-screen relative flex flex-1 overflow-hidden">
          <div className={isChatScreen ? 'absolute inset-y-0 left-0 z-20' : ''}>
            <AppSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>

          {isChatScreen ? (
            <div className="relative flex w-full">
              {showPreview && !isMobile ? (
                <div className="relative flex w-full">
                  <div
                    id="content-area"
                    className="transition-all duration-300 ease-in-out will-change-transform"
                    style={{
                      width: isPreviewOpen
                        ? `calc(100% - ${sidebarWidth}px)`
                        : '100%',
                    }}
                  >
                    <ContentArea>{children}</ContentArea>
                  </div>
                  <RightSidebar
                    open={isPreviewOpen}
                    width={sidebarWidth}
                    setWidth={handleSidebarWidthChange}
                    minWidth={
                      typeof window !== 'undefined'
                        ? window.innerWidth * 0.3
                        : 300
                    }
                    maxWidth={
                      typeof window !== 'undefined'
                        ? window.innerWidth * 0.7
                        : 800
                    }
                    contentId="content-area"
                  >
                    <PreviewPanel
                      isOpen={isPreviewOpen}
                      onToggle={togglePreview}
                    />
                  </RightSidebar>
                </div>
              ) : (
                <div className="flex w-full justify-center">
                  <div className="w-full max-w-3xl">
                    <ContentArea>{children}</ContentArea>
                    {showPreview && isMobile && (
                      <PreviewPanel
                        isOpen={isPreviewOpen}
                        onToggle={togglePreview}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ContentArea>{children}</ContentArea>
          )}
        </div>
      </main>
    </SidebarProvider>
  )
}
