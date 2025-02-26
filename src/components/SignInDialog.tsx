'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaDiscord, FaTimes } from 'react-icons/fa';

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInDialog({ isOpen, onClose }: SignInDialogProps) {
  if (!isOpen) return null;

  const handleSignIn = (provider: 'google' | 'discord') => {
    signIn(provider, { callbackUrl: '/music-player' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Sign in to NextMusic</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            <FaGoogle size={20} />
            Continue with Google
          </button>
          
          <button
            onClick={() => handleSignIn('discord')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
          >
            <FaDiscord size={20} />
            Continue with Discord
          </button>
        </div>
        
        <p className="mt-6 text-sm text-zinc-400 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}