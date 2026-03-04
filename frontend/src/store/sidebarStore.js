import { create } from 'zustand';
import apiClient from '../lib/apiClient';

export const useSidebarStore = create((set, get) => ({
  // State
  tree: null,
  loading: false,
  error: null,
  subjectId: null,

  // Actions
  fetchTree: async (subjectId) => {
    set({ loading: true, error: null, subjectId });
    
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
      set({ tree: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to load subject tree', 
        loading: false 
      });
    }
  },

  markVideoCompleted: (videoId) => {
    set((state) => {
      if (!state.tree) return state;

      const newTree = {
        ...state.tree,
        sections: state.tree.sections.map((section) => ({
          ...section,
          videos: section.videos.map((video) => {
            if (video.id === videoId) {
              return { ...video, is_completed: true, locked: false };
            }
            // Unlock next video if this was its prerequisite
            const videoIndex = section.videos.findIndex((v) => v.id === videoId);
            const nextVideo = section.videos[videoIndex + 1];
            if (nextVideo && videoIndex !== -1) {
              return { ...nextVideo, locked: false };
            }
            return video;
          })
        }))
      };

      return { tree: newTree };
    });
  },

  clearTree: () =>
    set({
      tree: null,
      loading: false,
      error: null,
      subjectId: null
    })
}));
