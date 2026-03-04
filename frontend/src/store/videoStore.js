import { create } from 'zustand';

export const useVideoStore = create((set, get) => ({
  // Current video state
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  
  // Navigation
  nextVideoId: null,
  prevVideoId: null,
  
  // Actions
  setCurrentVideo: (videoId, subjectId, videoData = {}) =>
    set({
      currentVideoId: videoId,
      subjectId,
      nextVideoId: videoData.next_video_id || null,
      prevVideoId: videoData.previous_video_id || null,
      isCompleted: false,
      currentTime: 0
    }),

  setCurrentTime: (time) =>
    set({ currentTime: time }),

  setDuration: (duration) =>
    set({ duration }),

  setIsPlaying: (isPlaying) =>
    set({ isPlaying }),

  setIsCompleted: (isCompleted) =>
    set({ isCompleted }),

  setNavigation: (nextVideoId, prevVideoId) =>
    set({ nextVideoId, prevVideoId }),

  reset: () =>
    set({
      currentVideoId: null,
      subjectId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null
    })
}));
