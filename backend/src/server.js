/**
 * server.js – Entry point
 *
 * Binds the Express application to PORT 5000 and starts listening.
 * Run with:  node src/server.js
 * Dev mode:  npm run dev
 */

const app  = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       🚀  Capacity Connect API Server        ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Status  : Running                           ║`);
  console.log(`║  Port    : ${PORT}                               ║`);
  console.log(`║  Health  : http://localhost:${PORT}/api/health   ║`);
  console.log(`║  Mode    : ${process.env.NODE_ENV || 'development'}                      ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('  Available Endpoints:');
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  GET    /api/users`);
  console.log(`  PATCH  /api/users/:id/status`);
  console.log(`  GET    /api/courses`);
  console.log(`  GET    /api/courses/:id`);
  console.log(`  GET    /api/assessments/course/:courseId`);
  console.log(`  POST   /api/assessments/submit`);
  console.log(`  GET    /api/library`);
  console.log(`  POST   /api/library`);
  console.log(`  GET    /api/competency/match/:courseId`);
  console.log(`  GET    /api/announcements`);
  console.log(`  GET    /api/health`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Server] SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
});

module.exports = server;
