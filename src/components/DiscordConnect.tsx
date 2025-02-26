'use client';

import { signIn } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';

export default function DiscordConnect() {
  const handleConnect = () => {
    signIn('discord', { callbackUrl: '/settings' });
  };

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-colors"
    >
      <FaDiscord className="w-5 h-5" />
      <span>Connect Discord</span>
    </button>
  );
}