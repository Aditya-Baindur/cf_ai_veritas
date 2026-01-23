// components/banner.tsx
'use client'

import { Megaphone } from 'lucide-react'

export default function Banner() {
  return (
    <div className="border-muted bg-muted/50 text-muted-foreground supports-[backdrop-filter]:bg-muted/30 flex w-full items-center justify-center gap-1 border-b px-2 py-4 text-[15px] leading-none backdrop-blur">
      <Megaphone className="h-4 w-4 shrink-0" />
      <span>
        Servera Chat is in testing mode — features may break and data can be
        wiped anytime without notice.
      </span>
    </div>
  )
}
