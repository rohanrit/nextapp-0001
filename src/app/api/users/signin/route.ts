import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/betterAuth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectMongo();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateToken(user._id.toString());
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set('ba_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error signing in" }, { status: 500 });
  }
}
