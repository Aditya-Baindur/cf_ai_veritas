'use client'

import { PreviewPanelProvider } from '../preview/PreviewPanelContext'
import React from 'react'

export default function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return <PreviewPanelProvider>{children}</PreviewPanelProvider>
}
