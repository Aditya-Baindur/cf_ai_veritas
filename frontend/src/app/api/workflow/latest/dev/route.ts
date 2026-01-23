import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'edge'

type ChatBlock = {
  user: string
  assistant: string
  graph?: string | null
}

export async function GET(req: NextRequest) {
  const BASE = process.env.BASE_API_URL
  const KEY = process.env.X_INTERNAL_SECRET

  if (!BASE || !KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    id: userId,
    k: KEY,
  }

  const res = await fetch(`${BASE}/data/get/dev`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Backend error' }, { status: res.status })
  }

  const data: ChatBlock[] = await res.json()

  const count = Array.isArray(data) ? data.length : 0
  const last = count > 0 ? data[count - 1] : null

  return NextResponse.json(
    {
      count,
      assistant: last?.assistant ?? null,
      graph: last?.graph ?? null,
    },
    { status: 200 }
  )
}
