'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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
  };
}

export interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playlist: Song[];
  duration: number;
  currentTime: number;
  isRepeat: boolean;
  isShuffle: boolean;
  playSong: (song: Song) => void;
  setPlaylist: (songs: Song[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isShuffle) {
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      setShuffledPlaylist(shuffled);
    } else {
      setShuffledPlaylist([]);
    }
  }, [isShuffle, playlist]);

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const playNext = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentPlaylist = isShuffle ? shuffledPlaylist : playlist;
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const nextSong = currentPlaylist[(currentIndex + 1) % currentPlaylist.length];
    if (nextSong) playSong(nextSong);
  };

  const playPrevious = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentPlaylist = isShuffle ? shuffledPlaylist : playlist;
    const currentIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    const previousSong = currentPlaylist[(currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length];
    if (previousSong) playSong(previousSong);
  };

  // Update volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if (currentSong && isPlaying) {
    fetch('/api/discord/presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songTitle: currentSong.title,
        artist: currentSong.artist,
      }),
    }).catch(console.error);
  }
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // Add event listener for song end
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        playNext();
      };
    }
  }, [currentSong, playlist]);

  const value = {
    currentSong,
    isPlaying,
    progress,
    volume,
    playlist,
    duration,
    currentTime,
    isRepeat,
    isShuffle,
    playSong,
    setPlaylist,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    toggleRepeat,
    toggleShuffle,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}