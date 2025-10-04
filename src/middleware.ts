import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/betterAuth';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('ba_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/signin', req.url));
    try { verifyToken(token); } 
    catch { return NextResponse.redirect(new URL('/signin', req.url)); }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
