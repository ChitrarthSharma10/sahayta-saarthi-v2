const express = require('express');
const { findAll } = require('../db');

const router = express.Router();

const getWeekLabels = () => {
  const labels = [];
  for (let offset = 3; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset * 7);
    labels.push(`Week ${4 - offset}`);
  }
  return labels;
};

const getWeekIndex = (date) => {
  const ageInDays = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  return Math.max(0, Math.min(3, 3 - Math.floor(Math.max(0, ageInDays) / 7)));
};

router.get('/trainee/:userId', (req, res) => {
  const submissions = findAll(
    'assessmentSubmissions',
    (submission) => submission.userId === req.params.userId
  );
  const scores = [[], [], [], []];
  const hours = [0, 0, 0, 0];

  submissions.forEach((submission) => {
    const week = getWeekIndex(submission.submittedAt || submission.createdAt);
    scores[week].push(submission.score);
    hours[week] += Number(submission.learningHours) || 0;
  });

  return res.json({
    success: true,
    chart: {
      title: 'Performance analytics',
      summary: 'Scores and learning hours',
      labels: getWeekLabels(),
      series: [
        {
          label: 'Assessment score',
          color: '#755BE8',
          values: scores.map((week) => week.length
            ? Math.round(week.reduce((sum, score) => sum + score, 0) / week.length)
            : 0),
        },
        { label: 'Learning hours', color: '#C7BDF2', values: hours.map((value) => Math.min(100, value * 10)) },
      ],
      max: 100,
    },
  });
});

router.get('/trainer/:trainerId', (req, res) => {
  const courses = findAll('courses', (course) => course.trainerId === req.params.trainerId);
  const courseIds = new Set(courses.map((course) => course._id));
  const submissions = findAll('assessmentSubmissions', (submission) => courseIds.has(submission.courseId));
  const courseMetrics = courses.map((course) => {
    const courseSubmissions = submissions.filter((submission) => submission.courseId === course._id);
    return {
      completion: course.maxEnrollment
        ? Math.round((course.enrollmentCount / course.maxEnrollment) * 100)
        : 0,
      testScore: courseSubmissions.length
        ? Math.round(courseSubmissions.reduce((sum, submission) => sum + submission.score, 0) / courseSubmissions.length)
        : 0,
      engagement: Math.min(100, course.enrollmentCount * 2),
    };
  });

  return res.json({
    success: true,
    chart: {
      title: 'Class performance',
      summary: 'Completion, scores, engagement',
      labels: courses.map((course) => course.title.split(' ').slice(0, 2).join(' ')),
      series: [
        { label: 'Completion', color: '#755BE8', values: courseMetrics.map((metric) => metric.completion) },
        { label: 'Test score', color: '#A997EE', values: courseMetrics.map((metric) => metric.testScore) },
        { label: 'Engagement', color: '#D8D0F7', values: courseMetrics.map((metric) => metric.engagement) },
      ],
      max: 100,
    },
  });
});

module.exports = router;