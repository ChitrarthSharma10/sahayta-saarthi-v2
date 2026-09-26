/**
 * app.js – Express application factory
 *
 * Creates and configures the Express app with all middleware and routes.
 * Exported so it can be imported by server.js (for running) or by test
 * suites without binding to a port.
 */

const express = require('express');
const cors    = require('cors');

// Route modules
const authRouter          = require('./routes/auth');
const usersRouter         = require('./routes/users');
const coursesRouter       = require('./routes/courses');
const assessmentsRouter   = require('./routes/assessments');
const libraryRouter       = require('./routes/library');
const competencyRouter    = require('./routes/competency');
const announcementsRouter = require('./routes/announcements');
const analyticsRouter     = require('./routes/analytics');
const feedbackRouter      = require('./routes/feedback');
const enrollmentsRouter   = require('./routes/enrollments');
const aiRouter            = require('./routes/ai');

const app = express();

/* ─────────────────────────────────────────────
   GLOBAL MIDDLEWARE
───────────────────────────────────────────── */
app.use(cors({
  origin: '*',          // Tighten this in production (e.g. your React app origin)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'Capacity Connect API',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────── */
app.use('/api/auth',          authRouter);
app.use('/api/users',         usersRouter);
app.use('/api/courses',       coursesRouter);
app.use('/api/assessments',   assessmentsRouter);
app.use('/api/library',       libraryRouter);
app.use('/api/competency',    competencyRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/analytics',     analyticsRouter);
app.use('/api/feedback',      feedbackRouter);
app.use('/api/enrollments',   enrollmentsRouter);
app.use('/api/ai',           aiRouter);

/* ─────────────────────────────────────────────
   404 CATCH-ALL
───────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

/* ─────────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

module.exports = app;
