import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { createToken, setSessionCookie } from '../../../../lib/betterAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectMongo();
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: 'Email exists' }, { status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash: hash });

    const token = createToken({ userId: user._id.toString(), email: user.email });
    const res = NextResponse.json({ ok: true });
    setSessionCookie(res.headers, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
