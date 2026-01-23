'use client'

import React, { useMemo, useRef, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import type * as MonacoType from 'monaco-editor'

import { registerMermaidLanguage } from './mermaid-language'
import { defaultEditorOptions, defineMonacoThemes } from './editor-config'
import EditorToolbar from './EditorToolbar'
import { FileNode, createInitialFileTree } from './types'

interface CodeEditorProps {
  className?: string
  graph: string
}

export default function CodeEditor({ className, graph }: CodeEditorProps) {
  /* ---------------------------------------------
   * Build initial tree from graph (runtime-safe)
   * --------------------------------------------- */
  const initialTree = useMemo(() => createInitialFileTree(graph), [graph])

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node
      if (node.children) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }

  /* ---------------------------------------------
   * State
   * --------------------------------------------- */
  const [fileTree, setFileTree] = useState<FileNode[]>(initialTree)
  const [selectedFile] = useState<FileNode | null>(findFirstFile(initialTree))
  const [code, setCode] = useState(findFirstFile(initialTree)?.content ?? '')
  const [cursorLine, setCursorLine] = useState<number | null>(null)
  const [theme] = useState('vs')

  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null)

  /* ---------------------------------------------
   * Actions
   * --------------------------------------------- */
  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
  }

  const handleDownload = () => {
    if (!selectedFile) return
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCodeChange = (value?: string) => {
    if (value === undefined || !selectedFile) return
    setCode(value)

    const updateFileContent = (nodes: FileNode[]): FileNode[] =>
      nodes.map((node) => {
        if (node.id === selectedFile.id) {
          return { ...node, content: value }
        }
        if (node.children) {
          return {
            ...node,
            children: updateFileContent(node.children),
          }
        }
        return node
      })

    setFileTree(updateFileContent(fileTree))
  }

  /* ---------------------------------------------
   * Monaco setup
   * --------------------------------------------- */
  const handleEditorDidMount = (
    editor: MonacoType.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor

    defineMonacoThemes(monaco)
    registerMermaidLanguage(monaco)

    editor.onDidChangeCursorPosition((e) => {
      setCursorLine(e.position.lineNumber)
    })

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    })

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    })
  }

  const getBreadcrumbPath = (file: FileNode | null): string[] => {
    if (!file) return []
    return file.id.split('/')
  }

  /* ---------------------------------------------
   * Render
   * --------------------------------------------- */
  return (
    <div className={`flex h-full min-h-0 flex-col ${className ?? ''}`}>
      <EditorToolbar
        selectedFile={selectedFile}
        onCopy={handleCopy}
        onDownload={handleDownload}
        getBreadcrumbPath={getBreadcrumbPath}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          value={code}
          theme={theme}
          language={
            selectedFile?.name.endsWith('.mermaid') ||
            selectedFile?.name.endsWith('.mmd')
              ? 'mermaid'
              : selectedFile?.name.endsWith('.ts') ||
                  selectedFile?.name.endsWith('.tsx')
                ? 'typescript'
                : selectedFile?.name.endsWith('.js') ||
                    selectedFile?.name.endsWith('.jsx')
                  ? 'javascript'
                  : selectedFile?.name.endsWith('.py')
                    ? 'python'
                    : 'plaintext'
          }
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            ...defaultEditorOptions,
            readOnly: true,
          }}
        />
      </div>

      <div className="bg-muted/30 flex h-6 shrink-0 items-center justify-between border-t border-border px-3">
        <span className="text-muted-foreground text-xs">
          {selectedFile?.name ?? 'No file selected'}
        </span>
        <span className="text-muted-foreground text-xs">
          {cursorLine ? `Line ${cursorLine}` : ''}
        </span>
      </div>
    </div>
  )
}
