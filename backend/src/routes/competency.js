/**
 * routes/competency.js
 * GET /api/competency/match/:courseId
 *
 * Competency mapping: given a courseId, find all approved Trainers whose
 * competencies or skills overlap with the course's subject / category.
 *
 * Matching logic:
 *   A trainer matches if any of their `competencies` or `skills` contains
 *   the course's `subject` or `category` (case-insensitive partial match).
 */

const express = require('express');
const { findById, findAll } = require('../db');

const router = express.Router();

/* ─────────────────────────────────────────────
   GET /api/competency/match/:courseId
───────────────────────────────────────────── */
router.get('/match/:courseId', (req, res) => {
  const { courseId } = req.params;

  // 1. Find the course
  const course = findById('courses', courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const searchTerms = [
    course.subject?.toLowerCase(),
    course.category?.toLowerCase(),
  ].filter(Boolean);

  // 2. Fetch all approved trainers
  const trainers = findAll('users', (u) => u.role === 'Trainer' && u.status === 'Approved');

  // 3. Score each trainer by number of matching fields
  const matched = trainers
    .map((trainer) => {
      const trainerTokens = [
        ...(trainer.competencies || []),
        ...(trainer.skills || []),
      ].map((t) => t.toLowerCase());

      const matchedTerms = searchTerms.filter((term) =>
        trainerTokens.some((token) => token.includes(term) || term.includes(token))
      );

      return {
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        designation: trainer.profile?.designation,
        department: trainer.profile?.department,
        bio: trainer.profile?.bio,
        experience: trainer.profile?.experience,
        skills: trainer.skills || [],
        competencies: trainer.competencies || [],
        qualifications: trainer.qualifications || [],
        matchedTerms,
        matchScore: matchedTerms.length,
      };
    })
    .filter((t) => t.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);   // best match first

  return res.status(200).json({
    success: true,
    courseId,
    courseTitle: course.title,
    subject: course.subject,
    category: course.category,
    matchedTrainers: matched,
    count: matched.length,
  });
});

module.exports = router;
