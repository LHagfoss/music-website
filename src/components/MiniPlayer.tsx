'use client';

import React, { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo } from 'react-icons/fa';
import Image from 'next/image';
import { formatTime } from '@/lib/utils';
import VolumeControl from './VolumeControl';

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    duration,
    currentTime,
    isRepeat,
    isShuffle,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    toggleRepeat,
    toggleShuffle,
  } = useAudio();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 5));
          break;
        case 'MediaPlayPause':
          togglePlay();
          break;
        case 'MediaTrackNext':
          playNext();
          break;
        case 'MediaTrackPrevious':
          playPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, seek, currentTime, duration, playNext, playPrevious]);

  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album || undefined,
        artwork: currentSong.coverUrl ? [
          { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ] : undefined
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
  }, [currentSong, togglePlay, playNext, playPrevious]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/50 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
            {currentSong.coverUrl && (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{currentSong.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors tooltip-trigger ${
                isShuffle ? 'text-purple-500' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FaRandom />
              <span className="tooltip">Shuffle</span>
            </button>
            <button
              onClick={playPrevious}
              className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors tooltip-trigger"
            >
              <FaStepBackward />
              <span className="tooltip">Previous</span>
            </button>
            <button
              onClick={togglePlay}
              className="p-4 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors tooltip-trigger"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span className="tooltip">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={playNext}
              className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors tooltip-trigger"
            >
              <FaStepForward />
              <span className="tooltip">Next</span>
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors tooltip-trigger ${
                isRepeat ? 'text-purple-500' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FaRedo />
              <span className="tooltip">Repeat</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-zinc-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-purple-500"
            />
            <span className="text-xs text-zinc-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <VolumeControl volume={volume} onChange={setVolume} />
        </div>
      </div>
    </div>
  );
}