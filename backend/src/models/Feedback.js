const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, enum: ['Trainee', 'Trainer'], required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    category: { type: String, default: 'general' },
    message: { type: String, required: true },
    status: { type: String, default: 'New' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
