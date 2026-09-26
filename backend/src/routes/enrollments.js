const express = require('express');
const { findAll, findOne, insertOne, updateById } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/:userId', async (req, res) => {
  if (req.user.role !== 'Admin' && req.params.userId !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'You can only view your own enrollments.' });
  }
  const enrollments = await findAll(
    'enrollments',
    (enrollment) => enrollment.userId === req.params.userId && enrollment.status === 'Active'
  );
  return res.json({ success: true, count: enrollments.length, enrollments });
});

router.post('/', async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: 'userId and courseId are required.' });
  }
  if (req.user.role !== 'Admin' && userId !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'You can only manage your own enrollments.' });
  }

  const existing = await findOne('enrollments', (enrollment) =>
    enrollment.userId === userId && enrollment.courseId === courseId
  );
  if (existing?.status === 'Active') {
    return res.status(409).json({ success: false, message: 'You are already enrolled in this course.' });
  }

  if (existing) {
    const reactivated = await updateById('enrollments', existing._id, { status: 'Active', enrolledAt: new Date() });
    return res.status(200).json({ success: true, message: 'Course enrollment restored.', enrollment: reactivated });
  }

  const enrollment = await insertOne('enrollments', {
    userId,
    courseId,
    status: 'Active',
    enrolledAt: new Date(),
  });
  return res.status(201).json({ success: true, message: 'Course enrollment successful.', enrollment });
});

router.delete('/:userId/:courseId', async (req, res) => {
  if (req.user.role !== 'Admin' && req.params.userId !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'You can only manage your own enrollments.' });
  }
  const enrollment = await findOne('enrollments', (item) =>
    item.userId === req.params.userId && item.courseId === req.params.courseId && item.status === 'Active'
  );
  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Active enrollment not found.' });
  }

  const updated = await updateById('enrollments', enrollment._id, { status: 'OptedOut', optedOutAt: new Date() });
  return res.json({ success: true, message: 'You opted out of the course.', enrollment: updated });
});

module.exports = router;
