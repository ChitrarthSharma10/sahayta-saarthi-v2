/**
 * routes/courses.js
 * GET /api/courses      – List all courses (with trainer details embedded)
 * GET /api/courses/:id  – Single course detail
 */

const express = require('express');
const { findAll, findById, findOne } = require('../db');

const router = express.Router();

/* ─────────────────────────────────────────────
   Helper: enrich a course document with live
   trainer profile info
───────────────────────────────────────────── */
function enrichCourse(course) {
  const trainer = findOne('users', (u) => u._id === course.trainerId);
  return {
    ...course,
    trainer: trainer
      ? {
          _id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          designation: trainer.profile?.designation,
          bio: trainer.profile?.bio,
          skills: trainer.skills || [],
          competencies: trainer.competencies || [],
        }
      : null,
  };
}

/* ─────────────────────────────────────────────
   GET /api/courses
   Query params:
     ?category=   (optional)
     ?level=      (optional)
     ?trainerId=  (optional)
───────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { category, level, trainerId } = req.query;

  const courses = findAll('courses', (c) => {
    const matchCat      = category   ? c.category  === category   : true;
    const matchLevel    = level      ? c.level      === level      : true;
    const matchTrainer  = trainerId  ? c.trainerId  === trainerId  : true;
    return matchCat && matchLevel && matchTrainer;
  });

  const enriched = courses.map(enrichCourse);

  return res.status(200).json({ success: true, count: enriched.length, courses: enriched });
});

/* ─────────────────────────────────────────────
   GET /api/courses/:id
───────────────────────────────────────────── */
router.get('/:id', (req, res) => {
  const course = findById('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  return res.status(200).json({ success: true, course: enrichCourse(course) });
});

module.exports = router;
