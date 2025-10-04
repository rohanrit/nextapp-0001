import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/betterAuth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectMongo();

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const token = generateToken(user._id.toString());

    const res = NextResponse.json({ message: "Account created" });
    res.cookies.set('ba_token', token, { httpOnly: true, path: '/' });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error creating account" }, { status: 500 });
  }
}
