'use client';

import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { FaHeart, FaPlay, FaPause } from 'react-icons/fa';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
  uploader?: {
    name: string;
    id: string;
    image?: string;
  };
}

export default function Favorites() {
  const { data: favorites, error, isLoading, mutate } = useSWR<Song[]>('/api/favorites', fetcher);
  const { playSong, setPlaylist, currentSong, isPlaying, togglePlay } = useAudio();

  const handleSongClick = (song: Song) => {
    if (favorites) {
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        setPlaylist(favorites);
        playSong(song);
      }
    }
  };

  const handleUnfavorite = async (songId: string) => {
    try {
      await fetch(`/api/favorites/${songId}`, { method: 'DELETE' });
      mutate();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  return (
    <main className="w-screen min-h-screen pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <FaHeart className="text-purple-500 w-8 h-8" />
          <h1 className="text-3xl font-bold">Your Favorites</h1>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites?.map((song) => (
            <div
              key={song.id}
              className="group bg-zinc-900/50 backdrop-blur-md rounded-xl p-4 border border-zinc-800/50 hover:border-purple-500/50 transition-all"
            >
              <div className="relative aspect-square mb-4">
                <div className="absolute inset-0 bg-zinc-800 rounded-lg overflow-hidden">
                  {song.coverUrl && (
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <button
                  onClick={() => handleSongClick(song)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <FaPause className="w-12 h-12 text-white" />
                  ) : (
                    <FaPlay className="w-12 h-12 text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleUnfavorite(song.id)}
                  className="absolute top-2 right-2 p-2 bg-black/40 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaHeart />
                </button>
              </div>
              <h3 className="font-medium truncate">{song.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}