/**
 * Ordering and locking logic for videos within a subject
 * 
 * Global order: sections ordered by order_index, then videos ordered by order_index within each section
 * This flattened sequence defines global prev/next navigation
 */

/**
 * Build a flattened list of all videos in a subject in global order
 * @param {Array} sections - Array of sections with their videos
 * @returns {Array} Flattened list of videos with section info
 */
function buildGlobalVideoOrder(sections) {
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  
  const globalOrder = [];
  sortedSections.forEach(section => {
    const sortedVideos = [...(section.videos || [])].sort((a, b) => a.order_index - b.order_index);
    sortedVideos.forEach(video => {
      globalOrder.push({
        ...video,
        section_id: section.id,
        section_title: section.title,
        section_order_index: section.order_index
      });
    });
  });
  
  return globalOrder;
}

/**
 * Find the previous and next video in global sequence
 * @param {Array} globalOrder - Flattened list of videos in global order
 * @param {number} currentVideoId - Current video ID
 * @returns {Object} { previous_video_id, next_video_id }
 */
function findPrevNextVideos(globalOrder, currentVideoId) {
  const currentIndex = globalOrder.findIndex(v => v.id === parseInt(currentVideoId, 10));
  
  if (currentIndex === -1) {
    return { previous_video_id: null, next_video_id: null };
  }
  
  const previous_video_id = currentIndex > 0 ? globalOrder[currentIndex - 1].id : null;
  const next_video_id = currentIndex < globalOrder.length - 1 ? globalOrder[currentIndex + 1].id : null;
  
  return { previous_video_id, next_video_id };
}

/**
 * Determine if a video is unlocked based on completion of prerequisite
 * @param {Array} globalOrder - Flattened list of videos in global order
 * @param {number} videoId - Video ID to check
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {Object} { locked: boolean, unlock_reason: string|null }
 */
function getVideoLockStatus(globalOrder, videoId, completedVideoIds) {
  const currentIndex = globalOrder.findIndex(v => v.id === parseInt(videoId, 10));
  
  if (currentIndex === -1) {
    return { locked: true, unlock_reason: 'Video not found' };
  }
  
  // First video is always unlocked
  if (currentIndex === 0) {
    return { locked: false, unlock_reason: null };
  }
  
  const prerequisiteVideo = globalOrder[currentIndex - 1];
  const isPrerequisiteCompleted = completedVideoIds.has(prerequisiteVideo.id);
  
  if (isPrerequisiteCompleted) {
    return { locked: false, unlock_reason: null };
  }
  
  return { 
    locked: true, 
    unlock_reason: `Complete "${prerequisiteVideo.title}" to unlock this video` 
  };
}

/**
 * Get the first unlocked video in a subject
 * @param {Array} globalOrder - Flattened list of videos in global order
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {number|null} First unlocked video ID or null
 */
function getFirstUnlockedVideo(globalOrder, completedVideoIds) {
  if (globalOrder.length === 0) {
    return null;
  }
  
  // First video is always unlocked
  return globalOrder[0].id;
}

/**
 * Build subject tree with lock status for each video
 * @param {Array} sections - Sections with videos
 * @param {Set} completedVideoIds - Set of completed video IDs
 * @returns {Array} Sections with videos including locked status
 */
function buildSubjectTreeWithLocks(sections, completedVideoIds) {
  const globalOrder = buildGlobalVideoOrder(sections);
  
  return sections.map(section => ({
    ...section,
    videos: (section.videos || []).map(video => {
      const lockStatus = getVideoLockStatus(globalOrder, video.id, completedVideoIds);
      return {
        ...video,
        is_completed: completedVideoIds.has(video.id),
        locked: lockStatus.locked
      };
    }).sort((a, b) => a.order_index - b.order_index)
  })).sort((a, b) => a.order_index - b.order_index);
}

module.exports = {
  buildGlobalVideoOrder,
  findPrevNextVideos,
  getVideoLockStatus,
  getFirstUnlockedVideo,
  buildSubjectTreeWithLocks
};
