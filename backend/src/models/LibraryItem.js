const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const LibraryItemSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['slides', 'video', 'pdf', 'doc', 'link', 'other'], required: true },
    url: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, default: '' },
    uploadedBy: { type: String, required: true },
    uploaderName: { type: String, default: '' },
    tags: { type: [String], default: [] },
    fileSize: { type: String },
    duration: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

// db.js collection key is 'library' but the model name is LibraryItem —
// this keeps the Mongo collection literally named "library" so it matches
// what the original mock store called it.
module.exports = mongoose.model('LibraryItem', LibraryItemSchema, 'library');
