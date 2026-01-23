import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const BASE = process.env.BASE_API_URL
  const KEY = process.env.X_INTERNAL_SECRET

  const searchParams = req.nextUrl.searchParams
  const TYPE = searchParams.get('type') ?? 'default'

  if (!BASE || !KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Parse JSON body
  let body: { msg?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const msg = body.msg

  if (!msg || typeof msg !== 'string') {
    return NextResponse.json(
      { error: 'Missing msg in request body' },
      { status: 400 }
    )
  }

  // Auth
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized CLERK NOT INITIALIZED' },
      { status: 401 }
    )
  }

  // Forward to backend USING BODY
  const res = await fetch(`${BASE}/data/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      k: KEY, // auth header
      type: TYPE,
    },
    body: JSON.stringify({
      msg,
      clerkUserId: userId,
    }),
    cache: 'no-store',
  })
  const data = await res.json()

  // // Return it so you see it in browser too
  // return new Response(bodyText, {
  //   status: 500,
  //   headers: { 'content-type': 'text/plain' },
  // })

  return NextResponse.json(data, { status: res.status })
}
