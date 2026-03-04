const express = require('express');
const router = express.Router();
const subjectController = require('./subject.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

// Public routes
router.get('/', subjectController.getSubjects);
router.get('/:subjectId', subjectController.getSubjectById);

// Protected routes
router.get('/:subjectId/tree', authMiddleware, subjectController.getSubjectTree);
router.get('/:subjectId/first-video', authMiddleware, subjectController.getFirstVideo);

module.exports = router;
