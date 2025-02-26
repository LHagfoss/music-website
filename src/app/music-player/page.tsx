'use client';

import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { FaPlay, FaPause, FaTrash, FaPlus, FaListAlt, FaHeart } from 'react-icons/fa';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import AddToPlaylistDialog from '@/components/AddToPlaylistDialog';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  uploader?: {
    name: string;
    id: string;
    image?: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MusicPlayer() {
  const { data: songs, error, isLoading, mutate } = useSWR<Song[]>('/api/songs', fetcher);
  const { data: favorites, mutate: mutateFavorites } = useSWR<Song[]>('/api/favorites', fetcher);
  const { playSong, setPlaylist, currentSong, isPlaying, togglePlay } = useAudio();
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSongClick = (song: Song) => {
    if (songs) {
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        setPlaylist(songs);
        playSong(song);
      }
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      });
      mutate();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  const handleToggleFavorite = async (songId: string) => {
    try {
      const isFavorite = favorites?.some(fav => fav.id === songId);
      await fetch(`/api/favorites/${songId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
      });
      mutateFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <Link
            href="/upload"
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Upload Music
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs?.map((song) => (
            <div
              key={song.id}
              onClick={() => handleSongClick(song)}
              style={{
                backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : undefined,
              }}
              className="group relative bg-zinc-900/50 backdrop-blur-md p-5 inset-0  border-zinc-800/50 hover:border-purple-500/50 transition-all cursor-pointer rounded-3xl"
            >
              {/* Background blur overlay */}
              <div 
                className="absolute inset-0 rounded-3xl" 
                style={{
                  backdropFilter: 'blur(16px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }} 
              />

              {/* Content container */}
              <div className="relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(song.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors text-red-500 opacity-0 group-hover:opacity-100 z-20 tooltip-trigger"
                >
                  <FaTrash size={14} />
                  <span className="tooltip">Delete Song</span>
                </button>

                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                  {song.coverUrl && (
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {currentSong?.id === song.id && isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
                  </div>
                </div>

                <h3 className="font-medium truncate relative z-10">{song.title}</h3>
                <p className="text-sm text-zinc-400 truncate relative z-10">{song.artist}</p>
                {song.album && (
                  <p className="text-xs text-zinc-500 truncate mt-1 relative z-10">{song.album}</p>
                )}

                <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(song.id);
                    }}
                    className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors tooltip-trigger"
                  >
                    <FaHeart 
                      size={14} 
                      className={favorites?.some(fav => fav.id === song.id) ? 'text-purple-500' : ''} 
                    />
                    <span className="tooltip">
                      {favorites?.some(fav => fav.id === song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSongId(song.id);
                    }}
                    className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors tooltip-trigger"
                  >
                    <FaListAlt size={14} />
                    <span className="tooltip">Add to Playlist</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSongId && (
        <AddToPlaylistDialog
          songId={selectedSongId}
          onClose={() => setSelectedSongId(null)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Delete Song</h2>
            <p className="text-zinc-400 mb-6">Are you sure you want to delete this song? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteSong(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}