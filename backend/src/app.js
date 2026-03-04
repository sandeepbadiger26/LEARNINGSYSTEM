const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { corsOptions } = require('./config/security');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const subjectRoutes = require('./modules/subjects/subject.routes');
const videoRoutes = require('./modules/videos/video.routes');
const progressRoutes = require('./modules/progress/progress.routes');
const healthRoutes = require('./modules/health/health.routes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
