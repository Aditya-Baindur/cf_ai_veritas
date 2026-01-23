'use client'

import React, { createContext, useContext, useState } from 'react'

type PreviewPanelContextType = {
  isPreviewOpen: boolean
  togglePreview: () => void
  showPreview: boolean
  setShowPreview: (show: boolean) => void
}

const PreviewPanelContext = createContext<PreviewPanelContextType | undefined>(
  undefined
)

export function usePreviewPanel() {
  const context = useContext(PreviewPanelContext)
  if (!context) {
    throw new Error(
      'usePreviewPanel must be used within a PreviewPanelProvider'
    )
  }
  return context
}

export function PreviewPanelProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const togglePreview = () => {
    setIsPreviewOpen((prev) => !prev)
  }

  return (
    <PreviewPanelContext.Provider
      value={{
        isPreviewOpen,
        togglePreview,
        showPreview,
        setShowPreview,
      }}
    >
      {children}
    </PreviewPanelContext.Provider>
  )
}
