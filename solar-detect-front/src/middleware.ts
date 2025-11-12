import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if we are in protected routes
  if (path.startsWith('/solardetect') || path.startsWith('/user')) {
    // Get the token from cookies (Next.js automatically parses cookies)
    const token = request.cookies.get('token')?.value

    // If no token found, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If not matching any protected route or has valid token, continue
  return NextResponse.next()
}
 
export const config = {
  // Match protected routes
  matcher: ['/solardetect/:path*', '/user/:path*'],
}