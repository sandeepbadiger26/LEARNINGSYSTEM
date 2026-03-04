import React from 'react';

export function VideoProgressBar({ currentTime, duration, className = '' }) {
  if (!duration || duration <= 0) return null;

  const progress = Math.min((currentTime / duration) * 100, 100);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
