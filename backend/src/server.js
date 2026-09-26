/**
 * server.js – Entry point
 *
 * Connects to MongoDB, then binds the Express application to PORT and
 * starts listening.
 * Run with:  node src/server.js
 * Dev mode:  npm run dev
 */

require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const { connectDB } = require('./db');

const PORT = process.env.PORT || 5000;

let server;

connectDB()
  .then(() => {
    console.log('[db] Connected to MongoDB.');

    server = app.listen(PORT, () => {
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
    });
  })
  .catch((err) => {
    console.error('[db] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await mongoose.connection.close();
      console.log('[db] MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
