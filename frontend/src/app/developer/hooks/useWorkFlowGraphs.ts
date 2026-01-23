// hooks/useWorkflowGraph.ts
'use client'

import { useEffect, useState } from 'react'

interface WorkflowLatestResponse {
  graph: string | null
}

export function useWorkflowGraph(pollKey: number, pollMs: number = 1000) {
  const [graph, setGraph] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let intervalId: number | null = null

    setGraph(null)
    setLoading(true)
    setError(null)

    const poll = async (): Promise<void> => {
      try {
        const res = await fetch('/api/workflow/latest/dev', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!res.ok) return

        const data: WorkflowLatestResponse = await res.json()

        if (!cancelled && data.graph !== null) {
          const normalized = data.graph.trimStart()

          const withElk = `---
config:
  layout: elk
  elk:
    algorithm: layered
    direction: RIGHT
    spacing:
      nodeNode: 70
      edgeNode: 50
      layer: 110
---
${normalized}`

          setGraph(withElk)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load preview')
          setLoading(false)
        }
      }
    }

    void poll()
    intervalId = window.setInterval(poll, pollMs)

    return () => {
      cancelled = true
      if (intervalId !== null) clearInterval(intervalId)
    }
  }, [pollKey, pollMs])

  return { graph, loading, error }
}

/**
 * ---
config:
  layout: elk
---
 */
