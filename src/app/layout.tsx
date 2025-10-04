import './globals.css';
import type { PropsWithChildren } from 'react';
import Navbar from '../components/Navbar';

export const metadata = { title: 'BetterAuth Starter' };

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main className='container mx-auto p-6'>{children}</main>
      </body>
    </html>
  );
}
