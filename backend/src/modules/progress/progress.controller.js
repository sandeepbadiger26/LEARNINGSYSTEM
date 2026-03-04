const { body, validationResult } = require('express-validator');
const progressService = require('./progress.service');

const updateProgressValidation = [
  body('last_position_seconds')
    .optional()
    .isInt({ min: 0 })
    .withMessage('last_position_seconds must be a non-negative integer'),
  body('is_completed')
    .optional()
    .isBoolean()
    .withMessage('is_completed must be a boolean')
];

class ProgressController {
  async getSubjectProgress(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.userId;
      const progress = await progressService.getSubjectProgress(userId, subjectId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getVideoProgress(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.userId;
      const progress = await progressService.getVideoProgress(userId, videoId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async updateVideoProgress(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { videoId } = req.params;
      const userId = req.user.userId;
      const data = req.body;

      const progress = await progressService.updateProgress(userId, videoId, data);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  progressController: new ProgressController(),
  updateProgressValidation
};
