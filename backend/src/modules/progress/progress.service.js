const progressRepository = require('./progress.repository');
const videoRepository = require('../videos/video.repository');

class ProgressService {
  async updateProgress(userId, videoId, data) {
    // Get video to validate and cap position at duration
    const video = await videoRepository.findById(videoId);
    if (!video) {
      const error = new Error('Video not found');
      error.statusCode = 404;
      throw error;
    }

    let { last_position_seconds, is_completed } = data;

    // Validate and cap position
    if (last_position_seconds !== undefined) {
      last_position_seconds = Math.max(0, last_position_seconds);
      if (video.duration_seconds) {
        last_position_seconds = Math.min(last_position_seconds, video.duration_seconds);
      }
    }

    // Auto-complete if position is near end
    if (video.duration_seconds && last_position_seconds >= video.duration_seconds - 5) {
      is_completed = true;
    }

    const progress = await progressRepository.upsert(userId, videoId, {
      last_position_seconds,
      is_completed
    });

    return {
      last_position_seconds: progress.last_position_seconds,
      is_completed: progress.is_completed
    };
  }

  async getSubjectProgress(userId, subjectId) {
    return progressRepository.getSubjectProgress(userId, subjectId);
  }

  async getVideoProgress(userId, videoId) {
    return progressRepository.getVideoProgress(userId, videoId);
  }
}

module.exports = new ProgressService();
