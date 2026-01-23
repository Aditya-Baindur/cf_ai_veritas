'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ApiResponse = { error: string } | Record<string, unknown>

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Unknown error occurred'
}

export default function TestApiPage() {
  const [msg, setMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSend(): Promise<void> {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/send?type=dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msg }),
      })

      const data: ApiResponse = await res.json()

      if (!res.ok) {
        if ('error' in data && typeof data.error === 'string') {
          throw new Error(data.error)
        }
        throw new Error('Request failed')
      }

      setResponse(data)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">API POST Test</h1>

      <Textarea
        placeholder="Enter test message…"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={4}
      />

      <Button onClick={handleSend} disabled={loading || msg.trim() === ''}>
        {loading ? 'Sending…' : 'Send POST'}
      </Button>

      {error && (
        <pre className="rounded bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </pre>
      )}

      {response && (
        <pre className="bg-muted overflow-auto rounded p-3 text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  )
}
