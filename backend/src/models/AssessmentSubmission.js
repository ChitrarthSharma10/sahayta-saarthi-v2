const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const AssessmentSubmissionSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    assessmentId: { type: String, required: true },
    assessmentTitle: { type: String, default: '' },
    courseId: { type: String, required: true },
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    learningHours: { type: Number, default: 1 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model('AssessmentSubmission', AssessmentSubmissionSchema);
