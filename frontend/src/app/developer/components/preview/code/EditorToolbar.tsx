'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'
import { Check, Copy, Download } from 'lucide-react'
import { Fragment, useState } from 'react'

import { Button } from '../../ui/button'
import { FileNode } from './types'

interface EditorToolbarProps {
  selectedFile: FileNode | null
  onCopy: () => void
  onDownload: () => void
  getBreadcrumbPath: (file: FileNode | null) => string[]
}

export default function EditorToolbar({
  selectedFile,
  onCopy,
  onDownload,
  getBreadcrumbPath,
}: EditorToolbarProps) {
  const [showCopyConfirm, setShowCopyConfirm] = useState(false)

  const handleCopy = async () => {
    await onCopy()
    setShowCopyConfirm(true)
    setTimeout(() => setShowCopyConfirm(false), 2000)
  }
  return (
    <div className="flex items-center justify-between border-b border-border px-2 py-1">
      <Breadcrumb>
        <BreadcrumbList>
          {getBreadcrumbPath(selectedFile).map((segment, index, array) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {index === array.length - 1 ? (
                  <BreadcrumbPage className="text-sm">{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="text-sm">{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < array.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
        >
          {showCopyConfirm ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
