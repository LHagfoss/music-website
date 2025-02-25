'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Library', path: '/music-player' },
    { name: 'Upload', path: '/upload' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-zinc-900/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">NextMusic</Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`hover:text-purple-500 transition-colors ${pathname === item.path ? 'text-purple-500' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-full transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <div className="absolute w-32 h-32 -top-16 -left-16 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-500/0 blur-2xl" />
      <div className="absolute w-32 h-32 -top-16 -right-16 rounded-full bg-gradient-to-l from-purple-500/30 to-purple-500/0 blur-2xl" />
    </nav>
  );
}