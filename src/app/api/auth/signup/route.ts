import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { createToken, setSessionCookie } from '../../../../lib/betterAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log("✅ Received signup fields");

    await connectMongo();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, passwordHash });

    const token = createToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    const response = NextResponse.json(
      {
        ok: true,
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      { status: 201 }
    );

    setSessionCookie(response.headers, token);

    return response;
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
