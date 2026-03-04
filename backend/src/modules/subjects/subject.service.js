const subjectRepository = require('./subject.repository');
const { buildSubjectTreeWithLocks, getFirstUnlockedVideo, buildGlobalVideoOrder } = require('../../utils/ordering');

class SubjectService {
  async getSubjects(query) {
    return subjectRepository.findAll(query);
  }

  async getSubjectById(id) {
    const subject = await subjectRepository.findById(id);
    if (!subject) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }
    return subject;
  }

  async getSubjectTree(subjectId, userId) {
    const tree = await subjectRepository.findTreeById(subjectId);
    if (!tree) {
      const error = new Error('Subject not found');
      error.statusCode = 404;
      throw error;
    }

    // Get user's completed videos for this subject
    const db = require('../../config/db');
    const videoIds = await subjectRepository.getAllVideoIds(subjectId);
    
    let completedVideoIds = new Set();
    if (userId && videoIds.length > 0) {
      const progress = await db('video_progress')
        .select('video_id')
        .where('user_id', userId)
        .whereIn('video_id', videoIds)
        .where('is_completed', true);
      
      completedVideoIds = new Set(progress.map(p => p.video_id));
    }

    // Build tree with lock status
    const sectionsWithLocks = buildSubjectTreeWithLocks(tree.sections, completedVideoIds);

    return {
      id: tree.id,
      title: tree.title,
      slug: tree.slug,
      description: tree.description,
      sections: sectionsWithLocks
    };
  }

  async getFirstVideo(subjectId, userId) {
    const tree = await subjectRepository.findTreeById(subjectId);
    if (!tree || !tree.sections || tree.sections.length === 0) {
      const error = new Error('No videos found in this subject');
      error.statusCode = 404;
      throw error;
    }

    const globalOrder = buildGlobalVideoOrder(tree.sections);
    
    if (globalOrder.length === 0) {
      const error = new Error('No videos found in this subject');
      error.statusCode = 404;
      throw error;
    }

    // Get user's completed videos
    const db = require('../../config/db');
    const videoIds = globalOrder.map(v => v.id);
    
    let completedVideoIds = new Set();
    if (userId) {
      const progress = await db('video_progress')
        .select('video_id')
        .where('user_id', userId)
        .whereIn('video_id', videoIds)
        .where('is_completed', true);
      
      completedVideoIds = new Set(progress.map(p => p.video_id));
    }

    // Find first unlocked video
    for (const video of globalOrder) {
      const { getVideoLockStatus } = require('../../utils/ordering');
      const lockStatus = getVideoLockStatus(globalOrder, video.id, completedVideoIds);
      if (!lockStatus.locked) {
        return { video_id: video.id };
      }
    }

    // If all locked, return first video anyway
    return { video_id: globalOrder[0].id };
  }
}

module.exports = new SubjectService();
