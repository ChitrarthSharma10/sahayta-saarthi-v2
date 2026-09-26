const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const AnnouncementSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['announcement', 'achievement'], default: 'announcement' },
    postedBy: { type: String, default: 'admin' },
    postedByName: { type: String, default: 'Capacity Connect Admin' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
