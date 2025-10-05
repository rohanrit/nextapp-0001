import { connectMongo } from '../../lib/mongoose';
import { verifyToken } from '../../lib/betterAuth';
import { cookies } from 'next/headers';
import UploadForm from './UploadForm';
import Navbar from '../../components/Navbar';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('ba_token')?.value;

  if (!token) {
    return (
      <div>
        <Navbar />
        <div className="p-6 bg-white rounded shadow mt-6">
          <h2 className="text-xl font-semibold">Not authenticated</h2>
          <p>
            Please <a href="/signin" className="text-blue-600 underline">sign in</a>.
          </p>
        </div>
      </div>
    );
  }

  try {
    const payload = verifyToken(token);
    await connectMongo();

    return (
      <div>
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <UploadForm />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div>
        <Navbar />
        <div className="p-6 bg-white rounded shadow mt-6">
          <h2 className="text-xl font-semibold">Invalid session</h2>
          <p>
            Please <a href="/signin" className="text-blue-600 underline">sign in</a> again.
          </p>
        </div>
      </div>
    );
  }
}
