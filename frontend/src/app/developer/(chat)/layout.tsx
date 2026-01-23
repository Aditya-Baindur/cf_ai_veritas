// src/app/chat/layout.tsx
import type { ReactNode } from 'react'
import Layout from '../components/nc/layout'
import { PreviewPanelProvider } from '../components/preview/PreviewPanelContext'

export const dynamic = 'force-dynamic'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <PreviewPanelProvider>
      <Layout>{children}</Layout>
    </PreviewPanelProvider>
  )
}
