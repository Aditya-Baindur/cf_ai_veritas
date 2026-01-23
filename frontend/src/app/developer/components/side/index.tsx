'use client'

import { SidebarProvider } from '../ui/sidebar'
import { PreviewPanelProvider } from '../preview/PreviewPanelContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PreviewPanelProvider>
        <main className="h-screen w-full overflow-hidden bg-white text-foreground">
          {children}
        </main>
      </PreviewPanelProvider>
    </SidebarProvider>
  )
}
