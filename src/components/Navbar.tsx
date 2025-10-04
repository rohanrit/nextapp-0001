import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center p-4 bg-white shadow'>
      <div className='text-lg font-bold'>BetterLabs</div>
      <div className='space-x-4'>
        <Link href='/'>Home</Link>
        <Link href='/signin'>Sign In</Link>
        <Link href='/signup'>Sign Up</Link>
      </div>
    </nav>
  );
}
