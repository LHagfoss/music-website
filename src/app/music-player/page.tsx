'use client';

import useSWR from 'swr';
import { useAudio } from '@/contexts/AudioContext';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';

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
  const { data: songs, error, isLoading, mutate } = useSWR<Song[]>('/api/songs', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { playSong, setPlaylist, currentSong } = useAudio();

  const handleSongClick = (song: Song) => {
    if (songs) {
      setPlaylist(songs);
      playSong(song);
    }
  };

  const handleDeleteSong = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate();
      } else {
        alert('Failed to delete the song');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete the song');
    }
  };

  if (error) return <div className="w-full min-h-screen flex justify-center items-center text-center py-8">Failed to load songs</div>;

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Library</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="glass-effect p-4 rounded-lg">
                <div className="aspect-square bg-zinc-800/50 rounded-md mb-4 animate-pulse" />
                <div className="h-5 bg-zinc-800/50 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-zinc-800/50 rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-zinc-800/50 rounded w-1/2 mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : !songs || songs.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            No songs found. Upload some music to get started!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSongClick(song)}
                className={`glass-effect p-4 rounded-lg cursor-pointer hover:bg-opacity-75 transition-all relative group overflow-hidden ${currentSong?.id === song.id ? 'bg-purple-500/20' : ''}`}
                style={{
                  backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0" style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                <div className="relative z-10">
                  <button
                    onClick={(e) => handleDeleteSong(e, song.id)}
                    className="absolute top-2 right-2 p-2 bg-zinc-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-500"
                  >
                    <FaTrash size={14} />
                  </button>
                  <div className="aspect-square bg-zinc-800 rounded-md mb-4 overflow-hidden">
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={`${song.title} cover`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <span className="text-4xl text-zinc-600">🎵</span>
                      </div>
                    )}
                  </div>
                  <div className="font-medium truncate text-white">{song.title}</div>
                  <div className="text-sm text-neutral-200 truncate">{song.artist}</div>
                  {song.uploader && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-800">
                        {song.uploader.image ? (
                          <Image
                            src={song.uploader.image}
                            alt={song.uploader.name}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs">{song.uploader.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-neutral-300 truncate">
                        {song.uploader.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}