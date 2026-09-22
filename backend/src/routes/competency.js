/**
 * routes/competency.js
 * GET /api/competency/match/:courseId
 *
 * Competency mapping: match approved Trainers to a course based on the course's
 * requiredSkills first, then falling back to subject/category overlap.
 */

const express = require('express');
const { findById, findAll } = require('../db');

const router = express.Router();

/* ─────────────────────────────────────────────
   GET /api/competency/match/:courseId
───────────────────────────────────────────── */
router.get('/match/:courseId', (req, res) => {
  const { courseId } = req.params;

  const course = findById('courses', courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const requiredSkillTerms = (course.requiredSkills || [])
    .map((skill) => String(skill).trim().toLowerCase())
    .filter(Boolean);

  const fallbackTerms = [
    course.subject?.toLowerCase(),
    course.category?.toLowerCase(),
  ].filter(Boolean);

  const searchTerms = Array.from(new Set([...requiredSkillTerms, ...fallbackTerms]));

  const trainers = findAll('users', (u) => u.role === 'Trainer' && u.status === 'Approved');

  const matched = trainers
    .map((trainer) => {
      const trainerTokens = [
        ...(trainer.competencies || []),
        ...(trainer.skills || []),
      ].map((t) => String(t).trim().toLowerCase());

      const matchedTerms = searchTerms.filter((term) =>
        trainerTokens.some((token) => token.includes(term) || term.includes(token))
      );

      const requiredSkillMatches = requiredSkillTerms.filter((term) =>
        trainerTokens.some((token) => token.includes(term) || term.includes(token))
      );

      const matchScore = requiredSkillMatches.length + matchedTerms.length;

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
        requiredSkillMatches,
        matchScore,
      };
    })
    .filter((t) => t.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  return res.status(200).json({
    success: true,
    courseId,
    courseTitle: course.title,
    subject: course.subject,
    category: course.category,
    requiredSkills: course.requiredSkills || [],
    matchedTrainers: matched,
    count: matched.length,
  });
});

module.exports = router;
