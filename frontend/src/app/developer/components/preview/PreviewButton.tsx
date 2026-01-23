'use client'

import { ChevronLeft, Eye } from 'lucide-react'

import { Button } from '../ui/button'
import React from 'react'
import { useIsMobile } from '../../hooks/use-mobile'
import { usePreviewPanel } from './PreviewPanelContext'

export default function PreviewButton({
  showFloating = false,
}: {
  showFloating?: boolean
}) {
  const { isPreviewOpen, togglePreview, showPreview } = usePreviewPanel()
  const isMobile = useIsMobile()

  if (!showPreview) return null

  if (!isMobile && isPreviewOpen && !showFloating) return null

  if (isMobile && !showFloating) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={togglePreview}
        title="Toggle Preview"
      >
        <Eye className="mr-1 h-4 w-4" /> Preview
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePreview}
      title="Open Preview"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
}
