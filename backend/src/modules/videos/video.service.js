const videoRepository = require('./video.repository');
const sectionRepository = require('../sections/section.repository');
const { buildGlobalVideoOrder, findPrevNextVideos, getVideoLockStatus } = require('../../utils/ordering');
const db = require('../../config/db');

class VideoService {
  async getVideoById(videoId, userId) {
    const video = await videoRepository.findById(videoId);
    if (!video) {
      const error = new Error('Video not found');
      error.statusCode = 404;
      throw error;
    }

    // Get all sections with videos for this subject to build global order
    const sections = await sectionRepository.findWithVideos(video.subject_id);
    const globalOrder = buildGlobalVideoOrder(sections);

    // Get user's completed videos
    const videoIds = globalOrder.map(v => v.id);
    let completedVideoIds = new Set();
    
    if (userId && videoIds.length > 0) {
      const progress = await db('video_progress')
        .select('video_id')
        .where('user_id', userId)
        .whereIn('video_id', videoIds)
        .where('is_completed', true);
      
      completedVideoIds = new Set(progress.map(p => p.video_id));
    }

    // Get prev/next and lock status
    const { previous_video_id, next_video_id } = findPrevNextVideos(globalOrder, videoId);
    const lockStatus = getVideoLockStatus(globalOrder, videoId, completedVideoIds);

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtube_url: video.youtube_url,
      order_index: video.order_index,
      duration_seconds: video.duration_seconds,
      section_id: video.section_id,
      section_title: video.section_title,
      subject_id: video.subject_id,
      subject_title: video.subject_title,
      previous_video_id,
      next_video_id,
      locked: lockStatus.locked,
      unlock_reason: lockStatus.unlock_reason
    };
  }
}

module.exports = new VideoService();
