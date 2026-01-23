'use client'

import React, { createContext, useContext, useState } from 'react'

type ScreenContextType = {
  isWelcomeScreen: boolean
  setIsWelcomeScreen: (isWelcome: boolean) => void
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined)

export function useScreen() {
  const context = useContext(ScreenContext)
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider')
  }
  return context
}

export function ScreenProvider({ children }: { children: React.ReactNode }) {
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true)

  return (
    <ScreenContext.Provider
      value={{
        isWelcomeScreen,
        setIsWelcomeScreen,
      }}
    >
      {children}
    </ScreenContext.Provider>
  )
}
