/**
 * routes/announcements.js
 * GET /api/announcements – Public announcements and achievements
 */

const express = require('express');
const { findAll } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { type } = req.query;   // optional: ?type=announcement|achievement

  const items = findAll('announcements', (a) => {
    const matchType = type ? a.type === type : true;
    return a.isPublic && matchType;
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json({ success: true, count: items.length, announcements: items });
});

module.exports = router;
