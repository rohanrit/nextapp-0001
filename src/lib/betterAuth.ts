import jwt from 'jsonwebtoken';

if (!process.env.BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET not set");

const SECRET = process.env.BETTER_AUTH_SECRET;

export function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (e) {
    throw new Error("Invalid token");
  }
}
