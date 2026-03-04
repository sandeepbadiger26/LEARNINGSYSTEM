import React, { useRef, useEffect, useCallback, useState } from 'react';
import YouTube from 'react-youtube';
import { useVideoStore } from '../../store/videoStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { debouncedUpdateProgress, updateProgress } from '../../lib/progress';

// Extract YouTube video ID from URL
function extractVideoId(url) {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function VideoPlayer({ 
  videoId, 
  youtubeUrl, 
  startPositionSeconds = 0, 
  onProgress, 
  onCompleted 
}) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    setCurrentTime, 
    setDuration, 
    setIsPlaying, 
    setIsCompleted,
    nextVideoId,
    subjectId
  } = useVideoStore();
  
  const { markVideoCompleted } = useSidebarStore();

  const youtubeVideoId = extractVideoId(youtubeUrl);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      start: startPositionSeconds,
      rel: 0,
      modestbranding: 1,
    },
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    
    // Get and set duration
    const duration = event.target.getDuration();
    setDuration(duration);
    
    // Seek to start position if provided
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds, true);
    }
  };

  const handleStateChange = (event) => {
    const playerState = event.data;
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    switch (playerState) {
      case YouTube.PlayerState.PLAYING:
        setIsPlaying(true);
        // Start progress tracking interval (every 5 seconds)
        intervalRef.current = setInterval(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            setCurrentTime(currentTime);
            debouncedUpdateProgress(videoId, { last_position_seconds: Math.floor(currentTime) });
            if (onProgress) {
              onProgress(currentTime);
            }
          }
        }, 5000);
        break;
        
      case YouTube.PlayerState.PAUSED:
        setIsPlaying(false);
        // Send final progress update
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          updateProgress(videoId, { last_position_seconds: Math.floor(currentTime) });
        }
        break;
        
      case YouTube.PlayerState.ENDED:
        setIsPlaying(false);
        setIsCompleted(true);
        handleCompleted();
        break;
        
      default:
        setIsPlaying(false);
    }
  };

  const handleCompleted = useCallback(async () => {
    try {
      // Mark as completed in backend
      await updateProgress(videoId, { is_completed: true, last_position_seconds: 0 });
      
      // Update sidebar store
      markVideoCompleted(videoId);
      
      // Call onCompleted callback
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      console.error('Failed to mark video as completed:', error);
    }
  }, [videoId, markVideoCompleted, onCompleted]);

  const handleError = (event) => {
    console.error('YouTube player error:', event.data);
    setError('Failed to load video. Please try again later.');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Send final progress update on unmount
      if (playerRef.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          updateProgress(videoId, { last_position_seconds: Math.floor(currentTime) });
        } catch (e) {
          // Player might already be destroyed
        }
      }
    };
  }, [videoId]);

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
        <div className="text-center text-white">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!youtubeVideoId) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
        <div className="text-center text-white">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Invalid YouTube URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <YouTube
        videoId={youtubeVideoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
