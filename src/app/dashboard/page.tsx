import { connectMongo } from '../../lib/mongoose';
import Pdf from '../../models/Pdf';
import { getTokenFromRequest, verifyToken } from '../../lib/betterAuth';
import { cookies } from 'next/headers';
import UploadForm from './UploadForm';

export default async function DashboardPage() {
  // auth - read cookie from headers via next/headers
  const cookieStore = cookies();
  const token = cookieStore.get('ba_token')?.value;
  if (!token) {
    return (
      <div className='p-6 bg-white rounded shadow'>
        <h2 className='text-xl'>Not authenticated</h2>
        <p>Please <a href='/signin' className='text-blue-600'>sign in</a>.</p>
      </div>
    );
  }

  try {
    const payload = verifyToken(token);
    await connectMongo();
    const pdfs = await Pdf.find({ owner: payload.userId }).select('-data').sort('-uploadedAt').lean();
    return (
      <div>
        <h1 className='text-2xl mb-4'>Dashboard</h1>
        <UploadForm />
        <h2 className='text-xl mt-6 mb-2'>Your PDFs</h2>
        <ul className='space-y-2'>
          {pdfs.map((p: any) => (
            <li key={p._id} className='border p-2 rounded bg-white'>{p.filename} — {new Date(p.uploadedAt).toLocaleString()}</li>
          ))}
        </ul>
      </div>
    );
  } catch (e) {
    return (
      <div className='p-6 bg-white rounded shadow'>
        <h2 className='text-xl'>Invalid session</h2>
        <p>Please <a href='/signin' className='text-blue-600'>sign in</a> again.</p>
      </div>
    );
  }
}
