const db = require('../../config/db');

class SubjectRepository {
  async findAll({ page = 1, pageSize = 20, search = null }) {
    // Build base query for filtering
    const baseQuery = db('subjects').where('is_published', true);

    if (search) {
      baseQuery.where(function() {
        this.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }

    const offset = (page - 1) * pageSize;
    
    // Get total count separately
    const countQuery = db('subjects')
      .where('is_published', true);
    
    if (search) {
      countQuery.where(function() {
        this.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }

    const [countResult, rows] = await Promise.all([
      countQuery.count('id as count').first(),
      baseQuery
        .select('id', 'title', 'slug', 'description', 'is_published', 'created_at')
        .orderBy('created_at', 'desc')
        .limit(pageSize)
        .offset(offset)
    ]);

    return {
      data: rows,
      pagination: {
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        total: countResult.count,
        totalPages: Math.ceil(countResult.count / pageSize)
      }
    };
  }

  async findById(id) {
    return db('subjects')
      .select('id', 'title', 'slug', 'description', 'is_published', 'created_at', 'updated_at')
      .where('id', id)
      .first();
  }

  async findBySlug(slug) {
    return db('subjects')
      .select('id', 'title', 'slug', 'description', 'is_published', 'created_at', 'updated_at')
      .where('slug', slug)
      .first();
  }

  async findTreeById(subjectId) {
    const subject = await this.findById(subjectId);
    if (!subject) return null;

    const sections = await db('sections')
      .select('id', 'title', 'order_index')
      .where('subject_id', subjectId)
      .orderBy('order_index');

    const sectionIds = sections.map(s => s.id);
    
    let videos = [];
    if (sectionIds.length > 0) {
      videos = await db('videos')
        .select('id', 'section_id', 'title', 'order_index', 'duration_seconds')
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

    // Attach videos to sections
    const sectionsWithVideos = sections.map(section => ({
      ...section,
      videos: videosBySection[section.id] || []
    }));

    return {
      ...subject,
      sections: sectionsWithVideos
    };
  }

  async getAllVideoIds(subjectId) {
    const result = await db('videos')
      .select('videos.id')
      .join('sections', 'videos.section_id', 'sections.id')
      .where('sections.subject_id', subjectId)
      .orderBy('sections.order_index')
      .orderBy('videos.order_index');
    
    return result.map(r => r.id);
  }
}

module.exports = new SubjectRepository();
