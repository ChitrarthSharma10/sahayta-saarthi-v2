const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    id: String,
    text: String,
    options: { type: [String], default: [] },
    correctAnswer: String,
  },
  { _id: false }
);

const AssessmentSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    courseId: { type: String, required: true },
    courseTitle: { type: String, default: '' },
    title: { type: String, required: true },
    passingScore: { type: Number, default: 60 },
    deadline: { type: Date, default: null },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);
