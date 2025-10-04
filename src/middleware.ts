import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, verifyToken } from './src/lib/betterAuth';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith('/dashboard')) {
    const token = getTokenFromRequest(req as any);
    if (!token) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (e) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
