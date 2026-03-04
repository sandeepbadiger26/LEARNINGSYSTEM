const subjectService = require('./subject.service');

class SubjectController {
  async getSubjects(req, res, next) {
    try {
      const { page = 1, pageSize = 20, q: search } = req.query;
      const result = await subjectService.getSubjects({ page, pageSize, search });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectById(req, res, next) {
    try {
      const { subjectId } = req.params;
      const subject = await subjectService.getSubjectById(subjectId);
      res.json(subject);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectTree(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.userId;
      const tree = await subjectService.getSubjectTree(subjectId, userId);
      res.json(tree);
    } catch (error) {
      next(error);
    }
  }

  async getFirstVideo(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.userId;
      const result = await subjectService.getFirstVideo(subjectId, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();
