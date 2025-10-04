import { NextResponse } from 'next/server';
import { connectMongo } from '../../../../lib/mongoose';
import Pdf from '../../../../models/Pdf';
import { verifyToken } from '../../../../lib/betterAuth';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('ba_token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    await connectMongo();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid PDF ID' }, { status: 400 });
    }

    const pdf = await Pdf.findById(params.id);
    if (!pdf) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (pdf.owner.toString() !== payload.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const headers = new Headers();
    const url = new URL(req.url);
    const download = url.searchParams.get('download') === 'true';
    headers.set('Content-Type', pdf.contentType);
    headers.set('Content-Disposition', download
      ? `attachment; filename="${pdf.filename}"`
      : `inline; filename="${pdf.filename}"`);

    return new Response(pdf.data, { headers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
