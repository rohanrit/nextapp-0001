'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert('Select a PDF');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      router.refresh();
      alert('Uploaded');
    } else {
      alert('Upload failed');
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex items-center gap-2'>
      <input type='file' accept='application/pdf' onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className='bg-green-600 text-white px-4 py-2 rounded' type='submit'>Upload</button>
    </form>
  );
}
