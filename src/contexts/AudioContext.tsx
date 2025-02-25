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

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.15);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (audioRef.current) {
      setCurrentSong(song);
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const getNextSongIndex = () => {
    if (!currentSong || playlist.length === 0) return -1;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length);
    }
    return (currentIndex + 1) % playlist.length;
  };

  const getPreviousSongIndex = () => {
    if (!currentSong || playlist.length === 0) return -1;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length);
    }
    return (currentIndex - 1 + playlist.length) % playlist.length;
  };

  const playNext = () => {
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      playSong(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    const previousIndex = getPreviousSongIndex();
    if (previousIndex !== -1) {
      playSong(playlist[previousIndex]);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        isRepeat,
        isShuffle,
        playlist,
        setPlaylist,
        playSong,
        togglePlay,
        seek,
        setVolume: handleVolumeChange,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        playNext,
        playPrevious,
      }}
    >
      {children}
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