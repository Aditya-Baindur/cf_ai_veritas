'use client'

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from 'lucide-react'

import { FileNode } from './types'
import React from 'react'

interface FileTreeProps {
  fileTree: FileNode[]
  selectedFile: FileNode | null
  onSelectFile: (file: FileNode) => void
  onToggleFolder: (folderId: string) => void
}

export default function FileTree({
  fileTree,
  selectedFile,
  onSelectFile,
  onToggleFolder,
}: FileTreeProps) {
  const renderFileTreeNode = (node: FileNode, depth: number = 0) => {
    const isSelected = selectedFile?.id === node.id && node.type === 'file'

    return (
      <div key={node.id} className="group relative">
        <div className="flex min-w-0">
          <div className="relative flex-shrink-0">
            {/* pixel stuff is so line aligns with chevron */}
            {Array.from({ length: depth }, (_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-border"
                style={{ left: `${(i + 1) * 12 + 1.5 + i * 10.5}px` }}
              />
            ))}
          </div>

          <div
            className={`hover:bg-muted/50 flex w-full flex-1 cursor-pointer items-center justify-start rounded-sm px-2 py-1 ${
              isSelected ? 'bg-muted' : ''
            }`}
            // pixel stuff is so line aligns with chevron
            style={
              depth > 0
                ? { marginLeft: `${depth * 12 + 10.5 + (depth - 1) * 10.5}px` }
                : {}
            }
            onClick={() => {
              if (node.type === 'folder') {
                onToggleFolder(node.id)
              } else {
                onSelectFile(node)
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                {node.isOpen ? (
                  <ChevronDown className="mr-1 h-3 w-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="mr-1 h-3 w-3 flex-shrink-0" />
                )}
                {node.isOpen ? (
                  <FolderOpen className="text-company mr-2 h-4 w-4 flex-shrink-0" />
                ) : (
                  <Folder className="text-company mr-2 h-4 w-4 flex-shrink-0" />
                )}
              </>
            ) : (
              <>
                <File className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
              </>
            )}
            <span className="truncate text-sm">{node.name}</span>
          </div>
        </div>

        {node.type === 'folder' && node.isOpen && node.children && (
          <div className="relative">
            {node.children.map((child) => renderFileTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-2">
      {fileTree.map((node) => renderFileTreeNode(node))}
    </div>
  )
}
