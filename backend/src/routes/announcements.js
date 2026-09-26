/**
 * routes/announcements.js
 * GET /api/announcements – Public announcements and achievements
 */

const express = require('express');
const { findAll, insertOne, deleteById } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type } = req.query;   // optional: ?type=announcement|achievement

  const items = await findAll('announcements', (a) => {
    const matchType = type ? a.type === type : true;
    return a.isPublic && matchType;
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json({ success: true, count: items.length, announcements: items });
});

router.post('/', async (req, res) => {
  const { title, content, type = 'announcement', postedBy, postedByName } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  if (!['announcement', 'achievement'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid announcement type.' });
  }

  const announcement = await insertOne('announcements', {
    title: title.trim(),
    content: content.trim(),
    type,
    postedBy: postedBy || 'admin',
    postedByName: postedByName || 'Capacity Connect Admin',
    isPublic: true,
  });

  return res.status(201).json({ success: true, message: 'Announcement published.', announcement });
});

router.delete('/:id', async (req, res) => {
  const deleted = await deleteById('announcements', req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Announcement not found.' });
  }

  return res.json({ success: true, message: 'Announcement deleted.' });
});

module.exports = router;
