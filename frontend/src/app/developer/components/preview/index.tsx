// components/preview/PreviewPanel.tsx
'use client'

import { useState } from 'react'
import { ChevronRight, Code, Eye, Loader } from 'lucide-react'
import { motion } from 'framer-motion'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useIsMobile } from '@/hooks/use-mobile'
import { usePreviewPanel } from './PreviewPanelContext'
import { usePreviewPolling } from '../../store/previewPolling'
import { useWorkflowGraph } from '../../hooks/useWorkFlowGraphs'

import Graph from '../Graph'
import CodeEditor from './code/CodeEditor'

type PreviewPanelProps = {
  isOpen: boolean
  onToggle: () => void
}

type PreviewTab = 'diagram' | 'code'

function PreviewLoading() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center gap-2 text-sm">
      <Loader className="h-4 w-4 animate-spin" />
      Generating…
    </div>
  )
}

function DesktopPreviewPanel({ isOpen, onToggle }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('diagram')
  const pollKey = usePreviewPolling((s) => s.pollKey)
  const { graph, loading, error } = useWorkflowGraph(pollKey)

  return (
    <motion.div
      className="z-30 flex h-full w-full flex-col overflow-hidden bg-background"
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center border-b border-border p-2">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as PreviewTab)}
        >
          <TabsList>
            <TabsTrigger value="diagram">
              <Eye className="mr-1 h-4 w-4" />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-1 h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {loading && <PreviewLoading />}

        {error !== null && (
          <div className="flex h-full w-full items-center justify-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && graph !== null && (
          <Tabs
            value={activeTab}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <TabsContent value="diagram" className="m-0 flex-1 p-0">
              <Graph graph={graph} />
            </TabsContent>

            <TabsContent value="code" className="m-0 flex-1 p-0">
              <CodeEditor className="h-full" graph={graph} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </motion.div>
  )
}

export default function PreviewPanel({ isOpen, onToggle }: PreviewPanelProps) {
  const { showPreview } = usePreviewPanel()
  const isMobile = useIsMobile()

  if (!showPreview) return null

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onToggle}>
      <DrawerContent className="h-[80vh]">
        <DesktopPreviewPanel isOpen onToggle={onToggle} />
      </DrawerContent>
    </Drawer>
  ) : (
    <DesktopPreviewPanel isOpen={isOpen} onToggle={onToggle} />
  )
}
