// layout.tsx - This is the root layout component where metadata is defined.

import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Export metadata for server-side rendering
export const metadata: Metadata = {
  title: 'Veritas AI',
  description: 'An AI chatbot for you!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-terminal-accent`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
