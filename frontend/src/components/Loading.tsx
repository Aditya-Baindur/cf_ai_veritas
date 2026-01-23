import React from 'react'
import { Loader2 } from 'lucide-react'

export default function loading() {
  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center">
      <p>
        Loading{' '}
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />{' '}
      </p>
    </div>
  )
}
