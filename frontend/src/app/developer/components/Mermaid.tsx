'use client'

import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Button } from './ui/button'
import { Download, Maximize2 } from 'lucide-react'
import { SvgPanZoomInstance } from 'svg-pan-zoom'

type MermaidProps = {
  code: string
  className?: string
  filename?: string
}

let mermaidInitialized = false

export default function Mermaid({
  code,
  className,
  filename = 'diagram.svg',
}: MermaidProps) {
  const id = useId().replace(/:/g, '_')
  const containerRef = useRef<HTMLDivElement>(null)
  const panZoomRef = useRef<SvgPanZoomInstance | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)

  // Init Mermaid once
  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
      })
      mermaidInitialized = true
    }
  }, [])

  // Render Mermaid + attach svg-pan-zoom (CLIENT ONLY)
  useEffect(() => {
    let cancelled = false

    async function run() {
      setError(null)
      setSvg(null)

      if (!containerRef.current) return
      containerRef.current.innerHTML = ''

      // Destroy previous pan/zoom
      panZoomRef.current?.destroy()
      panZoomRef.current = null

      try {
        const { svg } = await mermaid.render(`m_${id}`, code)
        if (cancelled || !containerRef.current) return

        setSvg(svg)
        containerRef.current.innerHTML = svg

        const svgEl = containerRef.current.querySelector('svg')
        if (!svgEl) return

        svgEl.setAttribute('width', '100%')
        svgEl.setAttribute('height', '100%')
        svgEl.style.maxWidth = 'none'
        svgEl.style.maxHeight = 'none'

        // 🔥 CLIENT-ONLY IMPORT
        const svgPanZoom = (await import('svg-pan-zoom')).default

        panZoomRef.current = svgPanZoom(svgEl, {
          zoomEnabled: true,
          panEnabled: true,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          minZoom: 0.1,
          maxZoom: 10,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
        })

        const panZoom = panZoomRef.current

        const currentZoom = panZoom.getZoom()
        panZoom.zoom(currentZoom * 0.4)
        panZoom.center()

        const sizes = panZoom.getSizes()
        panZoom.panBy({
          x: 0,
          y: -sizes.height * 0.15,
        })
      } catch (e: unknown) {
        if (!cancelled) {
          setError(String(e) + ' Mermaid render failed')
        }
      }
    }

    run()
    return () => {
      cancelled = true
      panZoomRef.current?.destroy()
      panZoomRef.current = null
    }
  }, [code, id])

  function downloadSvg() {
    if (!svg) return

    const blob = new Blob([svg], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function resetView() {
    const panZoom = panZoomRef.current
    if (!panZoom) return

    panZoom.resetZoom()
    panZoom.fit()
    panZoom.center()

    const z = panZoom.getZoom()
    panZoom.zoom(z * 0.4)

    const sizes = panZoom.getSizes()
    panZoom.panBy({
      x: 0.5,
      y: -sizes.height * 0.15,
    })
  }

  if (error) {
    return (
      <div className="bg-muted rounded-md border border-border p-3 text-sm">
        <div className="mb-1 font-medium">Diagram error</div>
        <pre className="whitespace-pre-wrap opacity-80">{error}</pre>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Toolbar */}
      <div className="relative flex items-center justify-end pr-4">
        {/* Centered interaction hint */}
        <div className="text-muted-foreground pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-xs">
          Scroll / pinch to zoom · Drag to pan
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={resetView}
            title="Fit to view"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={downloadSvg}
            disabled={!svg}
            title="Download SVG"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative flex-1 overflow-hidden rounded-md border border-border bg-background">
        <div
          ref={containerRef}
          className={`h-full w-full ${className ?? ''}`}
        />
      </div>
    </div>
  )
}
