/**
 * routes/library.js
 * GET  /api/library  – List trainer library resources (filter by type/courseId)
 * POST /api/library  – Add a new resource (Trainer action)
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { findAll, insertOne } = require('../db');

const router = express.Router();

const VALID_TYPES = ['slides', 'video', 'pdf', 'doc', 'link', 'other'];

/* ─────────────────────────────────────────────
   GET /api/library
   Query params:
     ?type=slides|video|pdf|...   (optional)
     ?courseId=                   (optional)
     ?uploadedBy=                 (optional, trainer userId)
───────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { type, courseId, uploadedBy } = req.query;

  const items = findAll('library', (item) => {
    const matchType     = type       ? item.type       === type       : true;
    const matchCourse   = courseId   ? item.courseId   === courseId   : true;
    const matchUploader = uploadedBy ? item.uploadedBy === uploadedBy : true;
    return matchType && matchCourse && matchUploader;
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json({ success: true, count: items.length, library: items });
});

/* ─────────────────────────────────────────────
   POST /api/library
   Body:
     {
       title: string,
       description: string,
       type: "slides"|"video"|"pdf"|"doc"|"link"|"other",
       url: string,
       courseId: string,
       courseTitle: string,
       uploadedBy: string,      (trainer userId)
       uploaderName: string,
       tags: string[],          (optional)
       fileSize: string,        (optional, e.g. "2.4 MB")
       duration: string         (optional, for videos)
     }
───────────────────────────────────────────── */
router.post('/', (req, res) => {
  const {
    title, description, type, url,
    courseId, courseTitle,
    uploadedBy, uploaderName,
    tags = [], fileSize, duration,
  } = req.body;

  // Required field validation
  const missing = ['title', 'type', 'url', 'courseId', 'uploadedBy'].filter((f) => !req.body[f]);
  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(', ')}.`,
    });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}.`,
    });
  }

  const newItem = insertOne('library', {
    _id: uuidv4(),
    title,
    description: description || '',
    type,
    url,
    courseId,
    courseTitle: courseTitle || '',
    uploadedBy,
    uploaderName: uploaderName || '',
    tags: Array.isArray(tags) ? tags : [],
    ...(fileSize && { fileSize }),
    ...(duration && { duration }),
  });

  return res.status(201).json({ success: true, message: 'Resource added to library.', item: newItem });
});

module.exports = router;
