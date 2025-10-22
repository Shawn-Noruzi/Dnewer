import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith('/studio')) return NextResponse.next();


  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  const user = process.env.STUDIO_USER || 'admin';
  const pass = process.env.STUDIO_PASS || '';


  // Decode Basic auth in Edge runtime
  const valid = scheme === 'Basic' && encoded;
  if (valid) {
    try {
      const decoded = atob(encoded);
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) return NextResponse.next();
    } catch { }
  }


  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Studio", charset="UTF-8"',
    },
  });
}


export const config = {
  matcher: ['/studio/:path*'],
};