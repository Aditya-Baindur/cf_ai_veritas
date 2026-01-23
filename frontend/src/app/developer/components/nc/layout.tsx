'use client'

import {
  RightSidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar'
import { memo, useEffect, useState } from 'react'
import AppSidebar from '../side/app-sidebar'
import Header from '../header'
import PreviewPanel from '../preview'
import { useIsMobile } from '../../hooks/use-mobile'
import { usePathname, useRouter } from 'next/navigation'
import { usePreviewPanel } from '../preview/PreviewPanelContext'
import { useAuth } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { DEV_URL } from '@/utils/config'

const viewSizeOfDiagram = 0.7
const LEFT_SIDEBAR_WIDTH = 240

export const dynamic = 'force-dynamic'

/* ---------------- Content Area ---------------- */

const ContentArea = memo(function ContentArea({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isDevRoute = pathname?.startsWith('/developer')
  const isBuildRoute = pathname?.startsWith('/developer/build')

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        !isBuildRoute
          ? 'rounded-x-xl rounded-t-xl border-x border-t border-border px-4'
          : ''
      }`}
    >
      {/* Trigger only on welcome */}
      {!isBuildRoute && isDevRoute && (
        <SidebarTrigger className="absolute left-4 top-4 z-10 hidden md:flex" />
      )}
      {children}
    </div>
  )
})

/* ---------------- Mobile Sidebar Control ---------------- */

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

/* ---------------- Inner Layout ---------------- */

function LayoutInner({
  children,
  mobileOpen,
  setMobileOpen,
  sidebarWidth,
  setSidebarWidth,
}: {
  children: React.ReactNode
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  sidebarWidth: number
  setSidebarWidth: (w: number) => void
}) {
  const { open, isPinned } = useSidebar()
  const { isPreviewOpen, togglePreview, showPreview } = usePreviewPanel()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const isDevRoute = pathname?.startsWith('/developer')
  const isBuildRoute = pathname?.startsWith('/developer/build')

  /* ----------- WIDTH MATH ----------- */

  // LEFT SIDEBAR participates in flex layout (no margins)
  const leftWidth =
    isDevRoute && !isMobile && (open || isPinned) ? LEFT_SIDEBAR_WIDTH : 0

  // RIGHT PREVIEW only on build
  const rightWidth =
    isBuildRoute && !isMobile && isPreviewOpen ? sidebarWidth : 0

  const handleSidebarWidthChange = (newWidth: number) => {
    requestAnimationFrame(() => setSidebarWidth(newWidth))
  }

  return (
    <main className="flex h-screen w-full flex-col overflow-x-hidden bg-background">
      <Header
        onMobileMenuClick={() => setMobileOpen(true)}
        isChatScreen={isBuildRoute}
      />

      {/* MAIN ROW */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        {isDevRoute && !isMobile && (
          <div
            className="overflow-hidden transition-[width] duration-300 ease-in-out"
            style={{ width: leftWidth }}
          >
            <AppSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
        )}

        {/* CENTER + RIGHT */}
        <div className="relative ml-5 mr-5 flex h-full flex-1 overflow-hidden">
          {isBuildRoute ? (
            showPreview && !isMobile ? (
              /* BUILD WITH PREVIEW */
              <div className="relative flex h-full w-full overflow-hidden">
                {/* CHAT AREA — SHRINKS ONLY BY RIGHT PREVIEW */}
                <div
                  className="flex min-w-0 flex-1 transition-[margin] duration-300 ease-in-out"
                  style={{
                    marginRight: rightWidth,
                  }}
                >
                  <ContentArea>{children}</ContentArea>
                </div>

                {/* RIGHT PREVIEW PANEL */}
                <RightSidebar
                  open={isPreviewOpen}
                  width={sidebarWidth}
                  setWidth={handleSidebarWidthChange}
                  minWidth={
                    typeof window !== 'undefined'
                      ? window.innerWidth * 0.2
                      : 300
                  }
                  maxWidth={
                    typeof window !== 'undefined'
                      ? window.innerWidth * 0.85
                      : 1200
                  }
                >
                  <PreviewPanel
                    isOpen={isPreviewOpen}
                    onToggle={togglePreview}
                  />
                </RightSidebar>
              </div>
            ) : (
              /* BUILD WITHOUT PREVIEW OR MOBILE */
              <div className="flex h-full w-full justify-center overflow-hidden">
                <div className="h-full w-full max-w-3xl">
                  <ContentArea>{children}</ContentArea>

                  {showPreview && isMobile && (
                    <PreviewPanel
                      isOpen={isPreviewOpen}
                      onToggle={togglePreview}
                    />
                  )}
                </div>
              </div>
            )
          ) : (
            /* WELCOME ROUTE */
            <ContentArea>{children}</ContentArea>
          )}
        </div>
      </div>
    </main>
  )
}

/* ---------------- Outer Layout ---------------- */

export default function Layout({ children }: { children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { isLoaded, isSignedIn } = useAuth()
  const pathname = usePathname()
  const isBuildRoute = pathname?.startsWith('/developer/build')
  const router = useRouter()

  const [sidebarWidth, setSidebarWidth] = useState(viewSizeOfDiagram * 100)

  /* Init preview width */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarWidth(window.innerWidth * viewSizeOfDiagram)
    }
  }, [])

  /* Preserve ratio on resize */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onResize = () => {
      const percent = sidebarWidth / window.innerWidth
      setSidebarWidth(window.innerWidth * percent)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sidebarWidth])

  /* Auth Gate */
  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex h-screen w-full flex-col bg-background">
        <Header
          onMobileMenuClick={() => setMobileOpen(true)}
          isChatScreen={isBuildRoute}
        />
        <div className="grid flex-1 place-items-center">
          <div className="flex flex-col gap-3 text-center">
            <p>You need to sign in</p>
            <Button variant="outline" onClick={() => router.replace(DEV_URL)}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider open={desktopOpen} setOpen={setDesktopOpen} defaultPinned>
      <MobileSidebarControl />

      <LayoutInner
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
      >
        {children}
      </LayoutInner>
    </SidebarProvider>
  )
}
