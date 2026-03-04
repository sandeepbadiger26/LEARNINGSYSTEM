const db = require('../../config/db');

class ProgressRepository {
  async findByUserAndVideo(userId, videoId) {
    return db('video_progress')
      .where({
        user_id: userId,
        video_id: videoId
      })
      .first();
  }

  async upsert(userId, videoId, data) {
    const existing = await this.findByUserAndVideo(userId, videoId);
    
    const updateData = {
      last_position_seconds: data.last_position_seconds,
      updated_at: new Date()
    };

    if (data.is_completed !== undefined) {
      updateData.is_completed = data.is_completed;
      if (data.is_completed && !existing?.is_completed) {
        updateData.completed_at = new Date();
      }
    }

    if (existing) {
      await db('video_progress')
        .where({ id: existing.id })
        .update(updateData);
    } else {
      await db('video_progress').insert({
        user_id: userId,
        video_id: videoId,
        ...updateData,
        created_at: new Date()
      });
    }

    return this.findByUserAndVideo(userId, videoId);
  }

  async getSubjectProgress(userId, subjectId) {
    // Get all videos in subject
    const videos = await db('videos')
      .select('videos.id', 'videos.duration_seconds')
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId);

    const totalVideos = videos.length;
    const videoIds = videos.map(v => v.id);

    if (totalVideos === 0) {
      return {
        total_videos: 0,
        completed_videos: 0,
        percent_complete: 0,
        last_video_id: null,
        last_position_seconds: 0
      };
    }

    // Get progress for all videos
    const progress = await db('video_progress')
      .where('user_id', userId)
      .whereIn('video_id', videoIds);

    const completedVideos = progress.filter(p => p.is_completed).length;
    const percentComplete = Math.round((completedVideos / totalVideos) * 100);

    // Find last accessed video (most recently updated)
    const lastProgress = progress
      .filter(p => p.last_position_seconds > 0)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

    return {
      total_videos: totalVideos,
      completed_videos: completedVideos,
      percent_complete: percentComplete,
      last_video_id: lastProgress?.video_id || null,
      last_position_seconds: lastProgress?.last_position_seconds || 0
    };
  }

  async getVideoProgress(userId, videoId) {
    const progress = await this.findByUserAndVideo(userId, videoId);
    
    return {
      last_position_seconds: progress?.last_position_seconds || 0,
      is_completed: progress?.is_completed || false
    };
  }

  async getCompletedVideos(userId, videoIds) {
    const result = await db('video_progress')
      .select('video_id')
      .where('user_id', userId)
      .whereIn('video_id', videoIds)
      .where('is_completed', true);
    
    return new Set(result.map(r => r.video_id));
  }
}

module.exports = new ProgressRepository();
