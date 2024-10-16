import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Remove the admin token check from here
  // The check will now be done client-side in the admin page
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}