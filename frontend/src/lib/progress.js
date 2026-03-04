import apiClient from './apiClient';

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced progress update (5 seconds)
export const debouncedUpdateProgress = debounce(async (videoId, data) => {
  try {
    await apiClient.post(`/api/progress/videos/${videoId}`, data);
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}, 5000);

// Immediate progress update
export async function updateProgress(videoId, data) {
  const response = await apiClient.post(`/api/progress/videos/${videoId}`, data);
  return response.data;
}

// Get video progress
export async function getVideoProgress(videoId) {
  const response = await apiClient.get(`/api/progress/videos/${videoId}`);
  return response.data;
}

// Get subject progress
export async function getSubjectProgress(subjectId) {
  const response = await apiClient.get(`/api/progress/subjects/${subjectId}`);
  return response.data;
}
