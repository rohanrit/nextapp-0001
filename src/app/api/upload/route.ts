import { NextResponse } from 'next/server';
import { connectMongo } from '../../../lib/mongoose';
import Pdf from '../../../models/Pdf';
import { verifyToken } from '../../../lib/betterAuth';
import formidable from 'formidable';
import fs from 'fs';

export const runtime = 'edge';

/*
Note: formidable doesn't work in edge runtime. For simplicity, this route sets runtime to default
*/
export async function POST(req: Request) {
  // Using Node.js runtime parsing - but Next's app router default is node
  try {
    // Parse multipart - use experimental FormData from Request
    const formData = await req.formData();
    const file = formData.get('file') as any;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDFs allowed' }, { status: 400 });

    // get token from cookie header
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('ba_token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    await connectMongo();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdf = await Pdf.create({
      owner: payload.userId,
      filename: file.name,
      data: buffer,
      contentType: file.type,
      size: buffer.length,
    });
    return NextResponse.json({ ok: true, pdfId: pdf._id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload error' }, { status: 500 });
  }
}
