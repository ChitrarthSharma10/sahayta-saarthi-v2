/**
 * db.js — MongoDB-backed data layer for Capacity Connect
 *
 * Keeps the exact same exported helpers the routes already call
 * (findAll, findById, findOne, insertOne, updateById, deleteById), so
 * routes barely change — they just need `await` in front of these calls
 * now, since they talk to a real database instead of an in-memory array.
 *
 * findAll/findOne still accept a plain JS predicate function (not a Mongo
 * query object) to match every existing call site exactly — the collection
 * is loaded and filtered in memory. Fine at this app's scale, and it means
 * zero query-logic rewrites in the route files.
 */

const mongoose = require('mongoose');

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Assessment = require('./models/Assessment');
const AssessmentSubmission = require('./models/AssessmentSubmission');
const LibraryItem = require('./models/LibraryItem');
const Announcement = require('./models/Announcement');
const Feedback = require('./models/Feedback');

const collections = {
  users: User,
  courses: Course,
  enrollments: Enrollment,
  assessments: Assessment,
  assessmentSubmissions: AssessmentSubmission,
  library: LibraryItem,
  announcements: Announcement,
  feedback: Feedback,
};

function modelFor(collection) {
  const Model = collections[collection];
  if (!Model) throw new Error(`db.js: unknown collection "${collection}"`);
  return Model;
}

async function findAll(collection, predicate) {
  const docs = await modelFor(collection).find({}).lean();
  return predicate ? docs.filter(predicate) : docs;
}

async function findById(collection, id) {
  if (!id) return null;
  return modelFor(collection).findById(id).lean();
}

async function findOne(collection, predicate) {
  const docs = await modelFor(collection).find({}).lean();
  return docs.find(predicate) || null;
}

async function insertOne(collection, data) {
  const Model = modelFor(collection);
  const doc = new Model(data);
  await doc.save();
  return doc.toObject();
}

async function updateById(collection, id, updates) {
  const Model = modelFor(collection);
  return Model.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
}

async function deleteById(collection, id) {
  const Model = modelFor(collection);
  const result = await Model.findByIdAndDelete(id);
  return !!result;
}

/* ─────────────────────────────────────────────
   CONNECTION + FIRST-RUN SEEDING
───────────────────────────────────────────── */
async function seedIfEmpty() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  const { seed } = require('./seed/seedData');
  await seed({ User, Course, Enrollment, Assessment, LibraryItem, Announcement });
  console.log('[db] First run detected — seeded demo data.');
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env — see .env.example.');
  }
  await mongoose.connect(uri);
  await seedIfEmpty();
}

module.exports = {
  findAll,
  findById,
  findOne,
  insertOne,
  updateById,
  deleteById,
  connectDB,
};
