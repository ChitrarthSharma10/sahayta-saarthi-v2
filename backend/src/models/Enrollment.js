const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const EnrollmentSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    status: { type: String, enum: ['Active', 'OptedOut'], default: 'Active' },
    enrolledAt: { type: Date, default: Date.now },
    optedOutAt: { type: Date },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
