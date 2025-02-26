'use client';

import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { FaPlay, FaPause, FaTrash, FaEdit, FaCheck, FaTimes, FaListAlt } from 'react-icons/fa';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PlaylistPage({ params }: { params: { playlistId: string } }) {
  const router = useRouter();
  const { data: playlist, mutate } = useSWR(`/api/playlists/${params.playlistId}`, fetcher);
  const { playSong, currentSong, isPlaying, togglePlay } = useAudio();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(playlist?.name || '');

  const handlePlaySong = (song: any) => {
    if (playlist?.songs) {
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        playSong(song);
      }
    }
  };

  const handleUpdateName = async () => {
    try {
      await fetch(`/api/playlists/${params.playlistId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      mutate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update playlist:', error);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      await fetch(`/api/playlists/${params.playlistId}/songs/${songId}`, {
        method: 'DELETE',
      });
      mutate();
    } catch (error) {
      console.error('Failed to remove song:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    
    try {
      await fetch(`/api/playlists/${params.playlistId}`, {
        method: 'DELETE',
      });
      router.push('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  if (!playlist) return <div>Loading...</div>;

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaListAlt className="text-purple-500 w-8 h-8" />
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-zinc-800 px-3 py-1 rounded-lg"
                  autoFocus
                />
                <button
                  onClick={handleUpdateName}
                  className="p-2 text-green-500 hover:bg-zinc-800 rounded-lg"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-red-500 hover:bg-zinc-800 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{playlist.name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  <FaEdit />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleDeletePlaylist}
            className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg"
          >
            Delete Playlist
          </button>
        </div>

        <div className="space-y-2">
          {playlist.songs.map((song: any) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                {song.coverUrl && (
                  <Image
                    src={song.coverUrl}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySong(song)}
                  className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>
                <button
                  onClick={() => handleRemoveSong(song.id)}
                  className="p-2 text-red-500 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}