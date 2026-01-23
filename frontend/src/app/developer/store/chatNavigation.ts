import { create } from 'zustand'

interface ChatNavState {
  pendingMessage: string | null
  setPendingMessage: (msg: string) => void
  clearPendingMessage: () => void
}

export const useChatNavigationStore = create<ChatNavState>((set) => ({
  pendingMessage: null,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  clearPendingMessage: () => set({ pendingMessage: null }),
}))
