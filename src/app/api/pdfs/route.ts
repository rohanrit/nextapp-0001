import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import Pdf from '@/models/Pdf';
import { verifyToken } from '@/lib/betterAuth';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('ba_token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    const formData = await req.formData();
    const file = formData.get('pdf') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const data = Buffer.from(await file.arrayBuffer());
    await connectMongo();

    const pdf = await Pdf.create({
      filename: file.name,
      contentType: file.type,
      data,
      owner: new mongoose.Types.ObjectId(payload.userId),
    });

    return NextResponse.json({ message: 'PDF uploaded', pdfId: pdf._id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('ba_token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    await connectMongo();

    const pdfs = await Pdf.find({ owner: payload.userId }).select('_id filename createdAt');
    return NextResponse.json({ pdfs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch PDFs' }, { status: 500 });
  }
}
