'use client';

import { useSession } from 'next-auth/react';
import { FaDiscord, FaPalette, FaMoon, FaSun, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import DiscordConnect from '@/components/DiscordConnect';
import { useState } from 'react';

export default function Settings() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState('dark');
  const [volume, setVolume] = useState(50);

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-zinc-900/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <FaPalette size={24} className="text-purple-500" />
              <span>Theme</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded ${theme === 'light' ? 'bg-purple-500' : 'bg-zinc-700'}`}
              >
                <FaSun />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded ${theme === 'dark' ? 'bg-purple-500' : 'bg-zinc-700'}`}
              >
                <FaMoon />
              </button>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-zinc-900/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Audio</h2>
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              {volume === 0 ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
              <span>Default Volume</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-zinc-900/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Integrations</h2>
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <FaDiscord size={24} className="text-[#5865F2]" />
              <div className="flex flex-col">
                <span>Discord</span>
                <span className="text-sm text-zinc-400">Connect your Discord account</span>
              </div>
            </div>
            <DiscordConnect />
          </div>
        </div>
      </div>
    </div>
  );
}