'use client';

import { useState } from 'react';
import { FaListAlt, FaPlus, FaMusic } from 'react-icons/fa';
import useSWR from 'swr';
import Link from 'next/link';

interface Playlist {
  id: string;
  name: string;
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    coverUrl?: string;
  }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Playlists() {
  const { data: playlists, error, isLoading, mutate } = useSWR<Playlist[]>('/api/playlists', fetcher);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName })
      });
      setNewPlaylistName('');
      setIsCreating(false);
      mutate();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaListAlt className="text-purple-500 w-8 h-8" />
            <h1 className="text-3xl font-bold">Your Playlists</h1>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaPlus /> New Playlist
          </button>
        </div>
        
        {isCreating && (
          <form onSubmit={handleCreatePlaylist} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-purple-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists?.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlists/${playlist.id}`}
              className="group bg-zinc-900/50 backdrop-blur-md rounded-xl p-6 border border-zinc-800/50 hover:border-purple-500/50 transition-all"
            >
              <div className="aspect-square bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                {playlist.songs[0]?.coverUrl ? (
                  <img
                    src={playlist.songs[0].coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaMusic className="w-12 h-12 text-zinc-600" />
                )}
              </div>
              <h3 className="font-medium truncate group-hover:text-purple-400 transition-colors">
                {playlist.name}
              </h3>
              <p className="text-sm text-zinc-400">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}