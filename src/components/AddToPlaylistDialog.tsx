'use client';

import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import useSWR from 'swr';

interface Props {
  songId: string;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AddToPlaylistDialog({ songId, onClose }: Props) {
  const { data: playlists, mutate } = useSWR('/api/playlists', fetcher);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName }),
      });
      const newPlaylist = await res.json();
      await fetch(`/api/playlists/${newPlaylist.id}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      mutate();
      onClose();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      onClose();
    } catch (error) {
      console.error('Failed to add to playlist:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {showCreateNew ? (
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Create & Add
              </button>
              <button
                type="button"
                onClick={() => setShowCreateNew(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {playlists?.map((playlist: any) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full p-4 text-left bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors"
                >
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreateNew(true)}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaPlus /> Create New Playlist
            </button>
          </>
        )}
      </div>
    </div>
  );
}