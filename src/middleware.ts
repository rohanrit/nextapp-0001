// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/betterAuth';

export const config = {
  matcher: ['/dashboard/:path*'],
  runtime: 'nodejs', // 👈 This forces Node.js runtime
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('ba_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      const payload = verifyToken(token);
      if (!payload?.userId) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}
