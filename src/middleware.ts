import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/betterAuth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('ba_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
