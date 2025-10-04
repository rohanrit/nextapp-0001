import { NextResponse } from 'next/server';
import { connectMongo } from '../../../lib/mongoose';
import Pdf from '../../../models/Pdf';
import { verifyToken } from '../../../lib/betterAuth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('ba_token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = verifyToken(token);
    await connectMongo();
    const pdfs = await Pdf.find({ owner: payload.userId }).select('-data').sort('-uploadedAt').lean();
    return NextResponse.json({ ok: true, pdfs });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
