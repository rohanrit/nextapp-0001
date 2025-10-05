'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes('ba_token=');
    setIsLoggedIn(hasToken);
  }, []);

  const handleLogout = () => {
    document.cookie = 'ba_token=; Path=/; Max-Age=0;';
    setIsLoggedIn(false);
    router.push('/signin');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-lg font-bold">BetterLabs</div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        {!isLoggedIn ? (
          <>
            <Link href="/signin">Sign In</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="text-red-600 hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
