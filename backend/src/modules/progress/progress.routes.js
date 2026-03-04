const express = require('express');
const router = express.Router();
const { progressController, updateProgressValidation } = require('./progress.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/subjects/:subjectId', authMiddleware, progressController.getSubjectProgress);
router.get('/videos/:videoId', authMiddleware, progressController.getVideoProgress);
router.post('/videos/:videoId', authMiddleware, updateProgressValidation, progressController.updateVideoProgress);

module.exports = router;
