import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { createToken, setSessionCookie } from '../../../../lib/betterAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectMongo();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = createToken({ userId: user._id.toString(), email: user.email });
    const res = NextResponse.json({ ok: true });
    setSessionCookie(res.headers, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
