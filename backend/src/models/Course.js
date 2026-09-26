const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, default: 'N/A' },
    level: { type: String, default: 'Beginner' },
    trainerId: { type: String, default: null },
    trainerName: { type: String, default: 'Unassigned' },
    requiredSkills: { type: [String], default: [] },
    thumbnail: { type: String, default: '' },
    tags: { type: [String], default: [] },
    enrollmentCount: { type: Number, default: 0 },
    maxEnrollment: { type: Number, default: 50 },
    status: { type: String, default: 'Active' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Course', CourseSchema);
