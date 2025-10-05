import jwt from 'jsonwebtoken';

const SECRET = process.env.BETTER_AUTH_SECRET;
if (!SECRET) throw new Error('BETTER_AUTH_SECRET not set');

export interface TokenPayload {
  userId: string;
  email?: string;
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

export function setSessionCookie(headers: Headers, token: string) {
  headers.append(
    'Set-Cookie',
    `ba_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}`
  );
}
