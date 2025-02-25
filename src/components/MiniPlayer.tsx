'use client';

import React, { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
    toggleMute,
    setVolume,
    seek,
    playNext,
    playPrevious
  } = useAudio();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-zinc-900/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden">
            {currentSong?.coverUrl && (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{currentSong?.title || 'No song playing'}</div>
            <div className="text-sm text-zinc-400">{currentSong?.artist || 'Select a song'}</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="group relative">
              <button
                onClick={toggleShuffle}
                className={`p-2 transition-colors ${isShuffle ? 'text-purple-500' : 'hover:text-purple-500'}`}
              >
                <FaRandom size={16} />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Toggle Shuffle
              </div>
            </div>
            <div className="group relative">
              <button
                onClick={playPrevious}
                className="p-2 hover:text-purple-500 transition-colors"
                disabled={!currentSong}
              >
                <FaStepBackward size={20} />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Previous Song
              </div>
            </div>
            <div className="group relative">
              <button
                onClick={togglePlay}
                className="p-2 hover:text-purple-500 transition-colors"
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {isPlaying ? 'Pause' : 'Play'}
              </div>
            </div>
            <div className="group relative">
              <button
                onClick={playNext}
                className="p-2 hover:text-purple-500 transition-colors"
                disabled={!currentSong}
              >
                <FaStepForward size={20} />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Next Song
              </div>
            </div>
            <div className="group relative">
              <button
                onClick={toggleRepeat}
                className={`p-2 transition-colors ${isRepeat ? 'text-purple-500' : 'hover:text-purple-500'}`}
              >
                <FaRedo size={16} />
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Toggle Repeat
              </div>
            </div>
          </div>
          <div className="w-96 flex items-center gap-2 text-sm text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleTimeChange}
                className="w-full h-full appearance-none bg-transparent cursor-pointer absolute top-0 left-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
              />
              <div
                className="absolute top-0 left-0 h-full bg-purple-500 pointer-events-none"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="group relative">
            <button
              onClick={toggleMute}
              className="p-2 hover:text-purple-500 transition-colors"
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {isMuted ? 'Unmute' : 'Mute'}
            </div>
          </div>
          <div className="relative w-24">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full overflow-hidden absolute [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 hover:cursor-pointer"
            />
            <div
              className="absolute top-0 left-0 h-1 bg-purple-500 rounded-full pointer-events-none"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="absolute w-32 h-32 -bottom-16 -left-16 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-500/0 blur-2xl" />
      <div className="absolute w-32 h-32 -bottom-16 -right-16 rounded-full bg-gradient-to-l from-purple-500/30 to-purple-500/0 blur-2xl" />
    </div>
  );
}