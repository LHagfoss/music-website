'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import SignInDialog from './SignInDialog';
import { FaMusic } from 'react-icons/fa';
import MusicSidebar from './MusicSidebar';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'favorites' | 'playlists'>('favorites');

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Library', path: '/music-player' },
    { 
      name: 'Favorites', 
      action: () => {
        setSidebarView('favorites');
        setIsSidebarOpen(true);
      }
    },
    { 
      name: 'Playlists', 
      action: () => {
        setSidebarView('playlists');
        setIsSidebarOpen(true);
      }
    },
    { name: 'Upload', path: '/upload' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-16 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">NextMusic</Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`hover:text-purple-400 text-sm px-4 py-2 rounded-full transition-colors ${
                    pathname === item.path ? 'bg-purple-500' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={item.action}
                  className={`hover:text-purple-400 px-4 py-2 rounded-full transition-colors ${
                    isSidebarOpen && sidebarView === item.name.toLowerCase() ? 'bg-purple-500' : ''
                  }`}
                >
                  {item.name}
                </button>
              )
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
                onClick={() => setIsSignInOpen(true)}
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

      <SignInDialog 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
      <MusicSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeTab={sidebarView}
        onTabChange={setSidebarView}
      />
    </>
  );
}