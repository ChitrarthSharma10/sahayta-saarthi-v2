const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { findAll, insertOne } = require('../db');

const router = express.Router();

router.get('/', (_req, res) => {
  const feedback = findAll('feedback').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json({ success: true, count: feedback.length, feedback });
});

router.post('/', (req, res) => {
  const { userId, userName, userRole, rating, category = 'general', message } = req.body;

  if (!userId || !userName || !['Trainee', 'Trainer'].includes(userRole) || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'userId, userName, userRole, and message are required. Feedback is limited to trainees and trainers.',
    });
  }

  const item = insertOne('feedback', {
    _id: uuidv4(),
    userId,
    userName,
    userRole,
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    category,
    message: message.trim(),
    status: 'New',
  });

  return res.status(201).json({ success: true, message: 'Feedback submitted.', feedback: item });
});

module.exports = router;