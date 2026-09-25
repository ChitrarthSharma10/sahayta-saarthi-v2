/**
 * routes/courses.js
 * GET /api/courses      – List all courses (with trainer details embedded)
 * GET /api/courses/:id  – Single course detail
 * POST /api/courses     – Create a new course
 * DELETE /api/courses/:id – Delete a course and its linked materials
 */

const express = require('express');
const { findAll, findById, findOne, insertOne, deleteById, updateById } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

/* ─────────────────────────────────────────────
   Helper: enrich a course document with live
   trainer profile info
───────────────────────────────────────────── */
function enrichCourse(course) {
  const trainer = findOne('users', (u) => u._id === course.trainerId)
    || findOne('users', (u) => u.name === course.trainerName);

  return {
    ...course,
    requiredSkills: Array.isArray(course.requiredSkills) ? course.requiredSkills : [],
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
  const { category, level, trainerId, trainerName } = req.query;
  const requestedTrainerId = trainerId || (req.user.role === 'Trainer' ? req.user.userId : undefined);
  const requestedTrainerName = trainerName || (req.user.role === 'Trainer' ? req.user.name : undefined);

  const courses = findAll('courses', (c) => {
    const matchCat = category ? c.category === category : true;
    const matchLevel = level ? c.level === level : true;
    const matchTrainer = requestedTrainerId || requestedTrainerName
      ? ((requestedTrainerId && c.trainerId === requestedTrainerId)
        || (requestedTrainerName && c.trainerName === requestedTrainerName))
      : true;
    return matchCat && matchLevel && matchTrainer;
  });

  const enriched = courses.map(enrichCourse);

  return res.status(200).json({ success: true, count: enriched.length, courses: enriched });
});

/* ─────────────────────────────────────────────
   POST /api/courses
───────────────────────────────────────────── */
router.post('/', (req, res) => {
  const {
    title,
    description,
    subject,
    category,
    duration,
    level = 'Beginner',
    trainerId = null,
    trainerName = 'Unassigned',
    requiredSkills = [],
  } = req.body;

  if (!title?.trim() || !subject?.trim() || !category?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Title, subject, and category are required.',
    });
  }

  const normalizedSkills = Array.isArray(requiredSkills)
    ? requiredSkills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
    : [];

  const course = insertOne('courses', {
    title: title.trim(),
    description: description?.trim() || '',
    subject: subject.trim(),
    category: category.trim(),
    duration: duration?.trim() || 'N/A',
    level,
    trainerId,
    trainerName,
    requiredSkills: normalizedSkills,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    tags: normalizedSkills.map((skill) => skill.toLowerCase()),
    enrollmentCount: 0,
    maxEnrollment: 50,
    status: 'Active',
  });

  return res.status(201).json({
    success: true,
    message: 'Course created successfully.',
    course: enrichCourse(course),
  });
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

/* ─────────────────────────────────────────────
   PATCH /api/courses/:id/trainer
───────────────────────────────────────────── */
router.patch('/:id/trainer', (req, res) => {
  const course = findById('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const { trainerId = null, trainerName = 'Unassigned' } = req.body || {};
  if (!trainerId && !trainerName) {
    return res.status(400).json({
      success: false,
      message: 'A trainer id or trainer name is required.',
    });
  }

  const updatedCourse = updateById('courses', course._id, {
    trainerId,
    trainerName,
  });

  return res.status(200).json({
    success: true,
    message: `${trainerName} assigned as the lead trainer for this course.`,
    course: enrichCourse(updatedCourse),
  });
});

/* ─────────────────────────────────────────────
   DELETE /api/courses/:id
───────────────────────────────────────────── */
router.delete('/:id', (req, res) => {
  const course = findById('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const assessmentIds = findAll('assessments', (a) => a.courseId === course._id).map((a) => a._id);
  assessmentIds.forEach((assessmentId) => deleteById('assessments', assessmentId));

  const libraryIds = findAll('library', (item) => item.courseId === course._id).map((item) => item._id);
  libraryIds.forEach((libraryId) => deleteById('library', libraryId));

  deleteById('courses', course._id);

  return res.status(200).json({
    success: true,
    message: 'Course deleted successfully.',
    deletedCourseId: course._id,
  });
});

module.exports = router;
