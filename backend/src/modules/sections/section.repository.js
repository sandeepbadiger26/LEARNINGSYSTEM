const db = require('../../config/db');

class SectionRepository {
  async findById(id) {
    return db('sections')
      .select('id', 'subject_id', 'title', 'order_index', 'created_at', 'updated_at')
      .where('id', id)
      .first();
  }

  async findBySubjectId(subjectId) {
    return db('sections')
      .select('id', 'subject_id', 'title', 'order_index', 'created_at', 'updated_at')
      .where('subject_id', subjectId)
      .orderBy('order_index');
  }

  async findWithVideos(subjectId) {
    const sections = await this.findBySubjectId(subjectId);
    const sectionIds = sections.map(s => s.id);
    
    let videos = [];
    if (sectionIds.length > 0) {
      videos = await db('videos')
        .select('id', 'section_id', 'title', 'description', 'youtube_url', 'order_index', 'duration_seconds')
        .whereIn('section_id', sectionIds)
        .orderBy('order_index');
    }

    // Group videos by section
    const videosBySection = {};
    videos.forEach(video => {
      if (!videosBySection[video.section_id]) {
        videosBySection[video.section_id] = [];
      }
      videosBySection[video.section_id].push(video);
    });

    return sections.map(section => ({
      ...section,
      videos: videosBySection[section.id] || []
    }));
  }
}

module.exports = new SectionRepository();
