import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define the protected routes directly
// Pricing should be public imo
const isProtectedRoute = createRouteMatcher([
  '/',
  '/welcome',
  '/building',
  '/error-building',
  '/test-page',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect() // Only protect the specified routes
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
