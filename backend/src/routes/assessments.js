/**
 * routes/assessments.js
 * GET  /api/assessments/course/:courseId  – Fetch assessment(s) for a course
 * POST /api/assessments/submit            – Submit answers, get score back
 *
 * NOTE: correct answers are stripped from GET responses so clients cannot
 * cheat by reading the API response.  They are only used server-side when
 * evaluating a submission.
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { findAll, findById, insertOne } = require('../db');

const router = express.Router();

/* ─────────────────────────────────────────────
   GET /api/assessments
   Returns all assessments.
   Correct answers are NOT included in the response.
───────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { courseId } = req.query;
  const assessments = findAll('assessments', (a) => (courseId ? a.courseId === courseId : true));

  const safeAssessments = assessments.map((a) => ({
    ...a,
    questions: a.questions ? a.questions.map(({ correctAnswer: _ca, ...q }) => q) : [],
  }));

  return res.status(200).json({ success: true, count: safeAssessments.length, assessments: safeAssessments });
});

/* ─────────────────────────────────────────────
   POST /api/assessments
   Create a new assessment/questionnaire (Trainer action)
   Body: { courseId, courseTitle, title, passingScore, questions, deadline }
───────────────────────────────────────────── */
router.post('/', (req, res) => {
  const { courseId, courseTitle, title, passingScore = 60, questions = [], deadline } = req.body;

  if (!courseId || !title || !questions.length) {
    return res.status(400).json({
      success: false,
      message: 'courseId, title, and at least one question are required.',
    });
  }

  const newAssessment = insertOne('assessments', {
    _id: uuidv4(),
    courseId,
    courseTitle: courseTitle || '',
    title,
    passingScore: Number(passingScore) || 60,
    deadline: deadline || null,
    questions: questions.map((q, idx) => ({
      id: q.id || `q${idx + 1}`,
      text: q.text,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
    })),
    createdAt: new Date(),
  });

  return res.status(201).json({
    success: true,
    message: 'Assessment created successfully.',
    assessment: newAssessment,
  });
});

/* ─────────────────────────────────────────────
   GET /api/assessments/course/:courseId
   Returns assessment(s) for the given course.
   Correct answers are NOT included in the response.
───────────────────────────────────────────── */
router.get('/course/:courseId', (req, res) => {
  const { courseId } = req.params;

  const assessments = findAll('assessments', (a) => a.courseId === courseId);

  if (!assessments.length) {
    return res.status(404).json({ success: false, message: 'No assessments found for this course.' });
  }

  // Strip correct answers
  const safeAssessments = assessments.map((a) => ({
    ...a,
    questions: a.questions ? a.questions.map(({ correctAnswer: _ca, ...q }) => q) : [],
  }));

  return res.status(200).json({ success: true, count: safeAssessments.length, assessments: safeAssessments });
});

/* ─────────────────────────────────────────────
   POST /api/assessments/submit
   Body:
     {
       assessmentId: string,
       userId: string,
       answers: { q1: "answer text", q2: "...", ... }
     }
   Returns: { score, passed, total, correct, feedback[] }
───────────────────────────────────────────── */
router.post('/submit', (req, res) => {
  const { assessmentId, userId, answers } = req.body;

  if (!assessmentId || !userId || !answers) {
    return res.status(400).json({
      success: false,
      message: 'assessmentId, userId, and answers are required.',
    });
  }

  const assessment = findById('assessments', assessmentId);
  if (!assessment) {
    return res.status(404).json({ success: false, message: 'Assessment not found.' });
  }

  // Grade each question
  let correctCount = 0;
  const feedback = assessment.questions.map((q) => {
    const submitted = answers[q.id];
    const isCorrect = submitted === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      questionText: q.text,
      submitted: submitted || null,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });

  const total = assessment.questions.length;
  const scorePercent = Math.round((correctCount / total) * 100);
  const passed = scorePercent >= assessment.passingScore;

  return res.status(200).json({
    success: true,
    result: {
      assessmentId,
      assessmentTitle: assessment.title,
      userId,
      total,
      correct: correctCount,
      score: scorePercent,
      passingScore: assessment.passingScore,
      passed,
      grade: passed ? 'Pass' : 'Fail',
      feedback,
    },
  });
});

module.exports = router;
