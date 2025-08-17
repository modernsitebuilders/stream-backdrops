import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host')
  
  // Redirect www to non-www
  if (host === 'www.streambackdrops.com') {
    const url = request.nextUrl.clone()
    url.host = 'streambackdrops.com'
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}