declare module 'svg-pan-zoom' {
  export interface SvgPanZoomInstance {
    destroy(): void
    resetZoom(): void
    fit(): void
    center(): void
    zoom(scale: number): void
    getZoom(): number
    panBy(point: { x: number; y: number }): void
    getSizes(): { width: number; height: number }
  }

  export default function svgPanZoom(
    svg: SVGElement,
    options?: Record<string, unknown>
  ): SvgPanZoomInstance
}
