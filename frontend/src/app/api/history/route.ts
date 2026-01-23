import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const BASE = process.env.BASE_API_URL
  const KEY = process.env.X_INTERNAL_SECRET

  const { searchParams } = new URL(req.url)

  if (!BASE || !KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(`${BASE}/data/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      id: userId,
      k: KEY,
    },
    cache: 'no-store',
  })

  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}
