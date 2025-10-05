import jwt from 'jsonwebtoken';

const SECRET = process.env.BETTER_AUTH_SECRET;

if (!SECRET) {
  throw new Error('BETTER_AUTH_SECRET not set in environment variables');
}

export interface TokenPayload {
  userId: string;
  email?: string;
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function setSessionCookie(headers: Headers, token: string) {
  const cookie = `ba_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;
  headers.append('Set-Cookie', cookie);
}
