/**
 * routes/users.js
 * GET   /api/users          – Admin: list all users, optional ?status= filter
 * PATCH /api/users/:id/status – Admin: approve or reject a user
 */

const express = require('express');
const { findAll, findById, updateById } = require('../db');

const router = express.Router();

const VALID_STATUSES = ['Approved', 'Pending', 'Rejected'];

/* ─────────────────────────────────────────────
   GET /api/users
   Query params:
     ?status=Pending|Approved|Rejected   (optional)
     ?role=Admin|Trainer|Trainee         (optional)
───────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { status, role } = req.query;

  const users = findAll('users', (u) => {
    const matchStatus = status ? u.status === status : true;
    const matchRole   = role   ? u.role   === role   : true;
    return matchStatus && matchRole;
  });

  // Strip passwords from response
  const safeUsers = users.map(({ password: _pw, ...u }) => u);

  return res.status(200).json({ success: true, count: safeUsers.length, users: safeUsers });
});

/* ─────────────────────────────────────────────
   PATCH /api/users/:id/status
   Body: { status: "Approved" | "Rejected" }
───────────────────────────────────────────── */
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'status field is required.' });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  const user = findById('users', id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const updated = updateById('users', id, { status });
  const { password: _pw, ...safeUser } = updated;

  return res.status(200).json({
    success: true,
    message: `User status updated to "${status}".`,
    user: safeUser,
  });
});

router.patch('/:id/profile', (req, res) => {
  const user = findById('users', req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.role !== 'Trainer') {
    return res.status(400).json({ success: false, message: 'Only trainer profiles can be updated here.' });
  }

  const {
    profile = {},
    skills = [],
    competencies = [],
    qualifications = [],
  } = req.body;

  const cleanList = (items) => Array.isArray(items)
    ? items.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const cleanQualifications = Array.isArray(qualifications)
    ? qualifications
      .filter((item) => item && item.title && item.url)
      .map((item) => ({
        title: String(item.title).trim(),
        issuer: String(item.issuer || '').trim(),
        type: String(item.type || 'Certificate').trim(),
        url: String(item.url).trim(),
      }))
    : [];

  const updated = updateById('users', req.params.id, {
    profile: {
      ...user.profile,
      designation: String(profile.designation || '').trim(),
      department: String(profile.department || '').trim(),
      bio: String(profile.bio || '').trim(),
      experience: Number(profile.experience) || 0,
    },
    skills: cleanList(skills),
    competencies: cleanList(competencies),
    qualifications: cleanQualifications,
  });

  const { password: _pw, ...safeUser } = updated;
  return res.json({ success: true, message: 'Trainer profile updated.', user: safeUser });
});

module.exports = router;
