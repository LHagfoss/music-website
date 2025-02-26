'use client';

import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaListAlt, FaTimes, FaPlus, FaPlay, FaPause } from 'react-icons/fa';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useAudio } from '@/contexts/AudioContext';
import CreatePlaylistDialog from './CreatePlaylistDialog';

interface MusicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'favorites' | 'playlists';
  onTabChange: (tab: 'favorites' | 'playlists') => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MusicSidebar({ isOpen, onClose, activeTab, onTabChange }: MusicSidebarProps) {
  const { data: favorites } = useSWR('/api/favorites', fetcher);
  const { data: playlists } = useSWR('/api/playlists', fetcher);
  const { playSong, currentSong, isPlaying, togglePlay } = useAudio();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const handlePlaySong = (song: any) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 w-96 h-[70vh] bg-zinc-900/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } border-r border-zinc-800/50 z-40 rounded-r-xl`}>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => onTabChange('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'favorites' ? 'bg-purple-500' : 'bg-zinc-800'
              }`}
            >
              <FaHeart /> Favorites
            </button>
            <button
              onClick={() => onTabChange('playlists')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'playlists' ? 'bg-purple-500' : 'bg-zinc-800'
              }`}
            >
              <FaListAlt /> Playlists
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'favorites' ? (
            <div className="space-y-2">
              {favorites?.map((song: any) => (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer group"
                >
                  <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden">
                    {song.coverUrl && (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{song.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Your Playlists</h3>
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="p-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              {playlists?.map((playlist: any) => (
                <Link
                  key={playlist.id}
                  href={`/playlists/${playlist.id}`}
                  className="block p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">{playlist.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreatePlaylist && (
        <CreatePlaylistDialog
          onClose={() => setShowCreatePlaylist(false)}
        />
      )}
    </div>
  );
}