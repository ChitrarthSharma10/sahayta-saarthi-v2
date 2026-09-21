/**
 * routes/auth.js
 * POST /api/auth/login   – Authenticate any user role
 * POST /api/auth/register – Register new Trainee / Trainer as Pending
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { findOne, insertOne } = require('../db');

const router = express.Router();

/* ─────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
   Returns: { user } (password field stripped)
───────────────────────────────────────────── */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  if (user.status === 'Pending') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending admin approval. Please try again later.',
    });
  }

  if (user.status === 'Rejected') {
    return res.status(403).json({
      success: false,
      message: 'Account access disabled. Please contact an administrator.',
    });
  }

  // Strip password before sending
  const { password: _pw, ...safeUser } = user;

  return res.status(200).json({ success: true, message: 'Login successful.', user: safeUser });
});

/* ─────────────────────────────────────────────
   POST /api/auth/register
   Body: { name, email, password, role, profile? }
   role must be "Trainee" or "Trainer"
   New users are created with status "Pending"
───────────────────────────────────────────── */
router.post('/register', (req, res) => {
  const { name, email, password, role, profile = {} } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'name, email, password, and role are required.' });
  }

  if (!['Trainee', 'Trainer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role must be "Trainee" or "Trainer".' });
  }

  const existing = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = insertOne('users', {
    _id: uuidv4(),
    name,
    email,
    password,           // Hash with bcrypt in production
    role,
    status: 'Pending',
    profile: {
      phone: profile.phone || '',
      designation: profile.designation || '',
      department: profile.department || '',
      ...(role === 'Trainee' && { enrolledCourses: [] }),
      ...(role === 'Trainer' && { bio: profile.bio || '', experience: profile.experience || 0 }),
    },
    ...(role === 'Trainer' && { skills: [], competencies: [] }),
  });

  const { password: _pw, ...safeUser } = newUser;

  return res.status(201).json({
    success: true,
    message: 'Registration successful. Your account is pending admin approval.',
    user: safeUser,
  });
});

module.exports = router;
