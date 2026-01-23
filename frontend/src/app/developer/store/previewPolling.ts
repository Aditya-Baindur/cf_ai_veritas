// stores/previewPolling.ts
import { create } from 'zustand'

interface PreviewPollingState {
  pollKey: number
  bumpPollKey: () => void
}

export const usePreviewPolling = create<PreviewPollingState>((set) => ({
  pollKey: 0,
  bumpPollKey: () => set((s) => ({ pollKey: s.pollKey + 1 })),
}))
