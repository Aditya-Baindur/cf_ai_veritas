'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function path() {
  const pathname = usePathname()
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-2xl text-white">{pathname}</div>
    </div>
  )
}
