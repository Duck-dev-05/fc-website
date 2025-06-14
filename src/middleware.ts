import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
      "style-src 'self' 'unsafe-inline';",
      "img-src 'self' data: https:;",
      "font-src 'self' https: data:;",
      "connect-src 'self' https:;",
      "frame-src 'none';",
      "object-src 'none';"
    ].join(' ')
  );
  return response;
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware for more info 