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

module.exports = router;
