const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    role: { type: String, enum: ['Admin', 'Trainer', 'Trainee'], required: true },
    status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Approved' },

    // Shape varies by role (phone/designation/department for everyone,
    // + bio/experience for Trainers, + enrolledCourses for Trainees) —
    // kept flexible on purpose, same as the original mock store.
    profile: { type: Schema.Types.Mixed, default: {} },

    // Trainer-only fields
    skills: { type: [String], default: [] },
    competencies: { type: [String], default: [] },
    qualifications: {
      type: [
        new Schema(
          {
            title: String,
            issuer: String,
            type: String,
            url: String,
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('User', UserSchema);
