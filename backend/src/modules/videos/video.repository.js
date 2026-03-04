const db = require('../../config/db');

class VideoRepository {
  async findById(id) {
    return db('videos')
      .select(
        'videos.id',
        'videos.section_id',
        'videos.title',
        'videos.description',
        'videos.youtube_url',
        'videos.order_index',
        'videos.duration_seconds',
        'videos.created_at',
        'videos.updated_at',
        'sections.subject_id',
        'sections.title as section_title',
        'subjects.title as subject_title'
      )
      .join('sections', 'videos.section_id', 'sections.id')
      .join('subjects', 'sections.subject_id', 'subjects.id')
      .where('videos.id', id)
      .first();
  }

  async findBySectionId(sectionId) {
    return db('videos')
      .select('id', 'section_id', 'title', 'description', 'youtube_url', 'order_index', 'duration_seconds')
      .where('section_id', sectionId)
      .orderBy('order_index');
  }

  async getVideosBySubjectId(subjectId) {
    return db('videos')
      .select(
        'videos.id',
        'videos.section_id',
        'videos.title',
        'videos.order_index',
        'videos.duration_seconds'
      )
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId)
      .orderBy('sections.order_index')
      .orderBy('videos.order_index');
  }
}

module.exports = new VideoRepository();
