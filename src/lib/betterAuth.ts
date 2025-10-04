import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { NextRequest } from 'next/server';

const TOKEN_NAME = 'ba_token';
const SECRET = process.env.BETTER_AUTH_SECRET as string;
if (!SECRET) {
  // allow import but runtime operations will throw if secret missing
}

export function createToken(payload: object) {
  if (!SECRET) throw new Error('BETTER_AUTH_SECRET not set');
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  if (!SECRET) throw new Error('BETTER_AUTH_SECRET not set');
  return jwt.verify(token, SECRET) as any;
}

export function setSessionCookie(headers: Headers, token: string) {
  const cookie = serialize(TOKEN_NAME, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  });
  headers.append('Set-Cookie', cookie);
}

export function clearSessionCookie(headers: Headers) {
  const cookie = serialize(TOKEN_NAME, '', { httpOnly: true, path: '/', expires: new Date(0) });
  headers.append('Set-Cookie', cookie);
}

export function getTokenFromRequest(req: NextRequest) {
  const cookie = req.headers.get('cookie') || '';
  const parsed = parse(cookie || '');
  return parsed[TOKEN_NAME];
}
