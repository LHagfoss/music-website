'use client';

import { useRef, useEffect, useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function Slider({ min, max, value, onChange, className = '' }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + (max - min) * percentage;
    onChange(newValue);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMouseMove(e);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={progressRef}
      onMouseDown={handleMouseDown}
      className={`h-1 bg-zinc-800 rounded-full cursor-pointer relative ${className}`}
    >
      <div
        className="absolute h-full bg-purple-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute w-3 h-3 bg-white rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}