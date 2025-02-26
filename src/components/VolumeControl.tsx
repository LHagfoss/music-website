'use client';

import { useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export default function VolumeControl({ volume, onChange }: VolumeControlProps) {
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeClick = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onChange(0);
    } else {
      onChange(previousVolume);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleVolumeClick}
        className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors tooltip-trigger"
      >
        {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        <span className="tooltip">
          {volume === 0 ? 'Unmute' : 'Mute'}
        </span>
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-24 accent-purple-500"
      />
    </div>
  );
}