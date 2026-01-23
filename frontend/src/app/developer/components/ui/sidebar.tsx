// NOT SHADCN, custom sidebar component

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeft, X } from 'lucide-react'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { Button } from './button'
import { cn } from '../../lib/utils'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isPinned: boolean
  setIsPinned: React.Dispatch<React.SetStateAction<boolean>>
  hideTrigger: boolean
  setHideTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  defaultPinned = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  defaultPinned?: boolean
}) => {
  const [openState, setOpenState] = useState(defaultPinned)
  const [isPinned, setIsPinned] = useState(defaultPinned)
  const [hideTrigger, setHideTrigger] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  useEffect(() => {
    setOpen(isPinned)
  }, [isPinned, setOpen])

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        isPinned,
        setIsPinned,
        hideTrigger,
        setHideTrigger,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={className}>{children}</div>
}

export const SidebarBody = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return <DesktopSidebar className={className}>{children}</DesktopSidebar>
}

export const DesktopSidebar = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const { open, setOpen, isPinned } = useSidebar()

  return (
    <>
      <div
        className="fixed bottom-0 left-0 top-0 z-10 hidden w-4 md:block"
        onMouseEnter={() => !isPinned && setOpen(true)}
      />
      <motion.div
        className={cn(
          'bg-sidebar absolute bottom-0 left-0 top-0 z-20 hidden w-60 rounded-tr-xl border border-border px-4 py-4 md:flex md:flex-col',
          className
        )}
        initial={{ x: '-100%' }}
        animate={{ x: open || isPinned ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onMouseLeave={() => !isPinned && setOpen(false)}
      >
        {children}
      </motion.div>
    </>
  )
}

export const MobileSidebar = ({
  open,
  setOpen,
  className,
  children,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  children: React.ReactNode
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'fixed inset-0 z-[100] flex flex-col bg-background',
            className
          )}
        >
          <div className="flex items-center justify-end p-2">
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <div className="flex-1 overflow-auto px-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
} & React.HTMLAttributes<HTMLAnchorElement>) => {
  const { open } = useSidebar()
  return (
    <a
      href={link.href}
      className={cn(
        'group/sidebar flex items-center justify-start gap-2 py-2',
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          opacity: open ? 1 : 0,
        }}
        className="text-sidebar-foreground !m-0 inline-block whitespace-pre !p-0 text-sm transition duration-150 group-hover/sidebar:translate-x-1"
      >
        {link.label}
      </motion.span>
    </a>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { isPinned, setIsPinned, hideTrigger } = useSidebar()
  if (hideTrigger) return null
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsPinned(!isPinned)}
      className={cn(className)}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}

export const RightSidebar = ({
  className,
  children,
  open,
  width,
  setWidth,
  minWidth = 240,
  maxWidth = 600,
  contentId,
}: {
  className?: string
  children: React.ReactNode
  open: boolean
  width: number
  setWidth: (width: number) => void
  minWidth?: number
  maxWidth?: number
  contentId?: string
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const widthRef = React.useRef(width)

  // Keep the ref in sync with props
  React.useEffect(() => {
    widthRef.current = width
  }, [width])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', handleResizeEnd)
  }

  // Use ref to store the handleResize function to avoid recreating it on each render
  const handleResize = React.useCallback(
    (e: MouseEvent) => {
      // Calculate the new width
      const newWidth = window.innerWidth - e.clientX
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

      // Store current width in ref
      widthRef.current = clampedWidth

      // Directly update DOM without triggering React re-renders
      const sidebarElement = document.getElementById('right-sidebar')
      if (sidebarElement) {
        sidebarElement.style.width = `${clampedWidth}px`
      }

      // Synchronously update content area width if contentId is provided
      if (contentId) {
        const contentElement = document.getElementById(contentId)
        if (contentElement) {
          contentElement.style.width = `calc(100% - ${clampedWidth}px)`
        }
      }
    },
    [minWidth, maxWidth, contentId]
  )

  const handleResizeEnd = React.useCallback(() => {
    setIsResizing(false)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('mouseup', handleResizeEnd)

    // Update state once at the end, not during resizing
    setWidth(widthRef.current)
  }, [handleResize, setWidth])

  // Update min/max width on window resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWidth = () => {
        const currentPercentage = widthRef.current / window.innerWidth
        setWidth(currentPercentage * window.innerWidth)
      }
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }
  }, [setWidth])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="right-sidebar"
          className={cn(
            'absolute bottom-0 right-0 top-0 z-20 flex flex-col overflow-visible',
            isResizing && 'pointer-events-none select-none',
            className
          )}
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: isResizing ? `${widthRef.current}px` : `${width}px` }}
        >
          {/* container for content, don't want overflow to be visible because of rounded top left */}
          <div className="relative h-full w-full overflow-hidden rounded-tl-xl border-l border-t border-border bg-background">
            <div className="h-full w-full overflow-auto will-change-transform">
              {children}
            </div>
          </div>

          {/* handle OUTSIDE the sidebar */}
          <div
            className="group absolute -left-1 bottom-0 top-4 z-30 w-1 cursor-col-resize"
            onMouseDown={handleResizeStart}
          >
            <div
              className={cn(
                'absolute bottom-0 left-0 top-0 w-1 transition-all duration-300 ease-in-out',
                isResizing
                  ? 'bg-border/80'
                  : 'bg-transparent group-hover:bg-border'
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
