'use client';

import { FaUserFriends, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import useSWR from 'swr';
import Image from 'next/image';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface User {
  id: string;
  name: string;
  image: string | null;
  _count: {
    followers: number;
    following: number;
  };
}

export default function Social() {
  const { data: users, mutate } = useSWR<User[]>('/api/users', fetcher);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setFollowingIds(prev => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });
        mutate();
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <FaUserFriends className="text-purple-500 w-8 h-8" />
          <h1 className="text-3xl font-bold">Social</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users?.map(user => (
            <div key={user.id} className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-6 border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {user.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="text-sm text-zinc-400">
                    <span>{user._count.followers} followers</span>
                    <span className="mx-2">•</span>
                    <span>{user._count.following} following</span>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    followingIds.has(user.id)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {followingIds.has(user.id) ? <FaUserCheck /> : <FaUserPlus />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}