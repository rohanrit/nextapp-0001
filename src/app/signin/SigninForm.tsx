'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push('/dashboard');
    else alert('Invalid credentials');
  }

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <input className='w-full p-2 border rounded' placeholder='Email' type='email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input className='w-full p-2 border rounded' placeholder='Password' type='password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button className='w-full bg-blue-600 text-white p-2 rounded' type='submit'>Sign In</button>
    </form>
  );
}
