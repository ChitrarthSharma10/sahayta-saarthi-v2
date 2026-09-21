/**
 * db.js — In-Memory Data Store for Capacity Connect
 *
 * All collections are plain JS arrays/objects so each document has the same
 * shape you would use in a Mongoose schema.  Migrating to MongoDB later is
 * straightforward: replace the helper functions below with Mongoose model
 * calls and keep every route file unchanged.
 *
 * Collections:
 *   users        – Admin, Trainer, Trainee documents
 *   courses      – Course catalogue
 *   assessments  – MCQ assessments linked to courses
 *   library      – Trainer-uploaded resources
 *   announcements – Public announcements / achievements
 */

const { v4: uuidv4 } = require('uuid');

/* ─────────────────────────────────────────────
   COLLECTION STORES
───────────────────────────────────────────── */
const db = {
  users: [],
  courses: [],
  assessments: [],
  library: [],
  announcements: [],
};

/* ─────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────── */

// ── Users ──────────────────────────────────────
const adminId      = uuidv4();
const trainer1Id   = uuidv4();
const trainer2Id   = uuidv4();
const trainee1Id   = uuidv4();
const trainee2Id   = uuidv4();
const trainee3Id   = uuidv4();
const trainee4Id   = uuidv4();
const trainee5Id   = uuidv4();

db.users = [
  // ── Admin
  {
    _id: adminId,
    name: 'Arjun Mehta',
    email: 'admin@capacityconnect.in',
    password: 'admin@123',          // In production, store bcrypt hashes
    role: 'Admin',
    status: 'Approved',
    profile: {
      phone: '+91-9876500001',
      designation: 'Platform Administrator',
      department: 'IT',
    },
    createdAt: new Date('2025-01-01T08:00:00Z'),
  },

  // ── Trainers
  {
    _id: trainer1Id,
    name: 'Priya Nair',
    email: 'priya.nair@capacityconnect.in',
    password: 'trainer@123',
    role: 'Trainer',
    status: 'Approved',
    profile: {
      phone: '+91-9876500002',
      designation: 'Senior Learning Specialist',
      department: 'Human Resources',
      bio: 'L&D professional with 8 years of experience in leadership and soft-skills training.',
      experience: 8,
    },
    skills: ['Leadership Development', 'Communication', 'Team Building', 'Conflict Resolution'],
    competencies: ['Soft Skills', 'Management', 'HR Practices'],
    createdAt: new Date('2025-01-05T09:00:00Z'),
  },
  {
    _id: trainer2Id,
    name: 'Rahul Desai',
    email: 'rahul.desai@capacityconnect.in',
    password: 'trainer@123',
    role: 'Trainer',
    status: 'Approved',
    profile: {
      phone: '+91-9876500003',
      designation: 'Technical Training Lead',
      department: 'Engineering',
      bio: 'Full-stack engineer turned trainer with expertise in cloud, DevOps and Agile methodologies.',
      experience: 6,
    },
    skills: ['Cloud Computing', 'DevOps', 'Agile / Scrum', 'Python', 'System Design'],
    competencies: ['Technology', 'Cloud', 'Agile', 'Software Engineering'],
    createdAt: new Date('2025-01-06T09:30:00Z'),
  },

  // ── Trainees (2 Approved, 3 Pending)
  {
    _id: trainee1Id,
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    password: 'trainee@123',
    role: 'Trainee',
    status: 'Approved',
    profile: {
      phone: '+91-9876500010',
      designation: 'HR Executive',
      department: 'Human Resources',
      enrolledCourses: [],
    },
    createdAt: new Date('2025-02-01T10:00:00Z'),
  },
  {
    _id: trainee2Id,
    name: 'Karan Verma',
    email: 'karan.verma@example.com',
    password: 'trainee@123',
    role: 'Trainee',
    status: 'Approved',
    profile: {
      phone: '+91-9876500011',
      designation: 'Junior Developer',
      department: 'Engineering',
      enrolledCourses: [],
    },
    createdAt: new Date('2025-02-03T11:00:00Z'),
  },
  {
    _id: trainee3Id,
    name: 'Sneha Pillai',
    email: 'sneha.pillai@example.com',
    password: 'trainee@123',
    role: 'Trainee',
    status: 'Pending',
    profile: {
      phone: '+91-9876500012',
      designation: 'Business Analyst',
      department: 'Operations',
      enrolledCourses: [],
    },
    createdAt: new Date('2025-03-10T09:15:00Z'),
  },
  {
    _id: trainee4Id,
    name: 'Mohit Joshi',
    email: 'mohit.joshi@example.com',
    password: 'trainee@123',
    role: 'Trainee',
    status: 'Pending',
    profile: {
      phone: '+91-9876500013',
      designation: 'Sales Executive',
      department: 'Sales',
      enrolledCourses: [],
    },
    createdAt: new Date('2025-03-12T14:30:00Z'),
  },
  {
    _id: trainee5Id,
    name: 'Divya Rao',
    email: 'divya.rao@example.com',
    password: 'trainee@123',
    role: 'Trainee',
    status: 'Pending',
    profile: {
      phone: '+91-9876500014',
      designation: 'Marketing Coordinator',
      department: 'Marketing',
      enrolledCourses: [],
    },
    createdAt: new Date('2025-03-15T08:45:00Z'),
  },
];

// ── Courses ─────────────────────────────────────
const course1Id = uuidv4();
const course2Id = uuidv4();
const course3Id = uuidv4();
const course4Id = uuidv4();
const course5Id = uuidv4();

db.courses = [
  {
    _id: course1Id,
    title: 'Effective Leadership & Team Management',
    description:
      'A comprehensive course on building high-performing teams, resolving conflicts, and developing leadership presence in the workplace.',
    subject: 'Management',
    category: 'Soft Skills',
    duration: '16 hours',
    level: 'Intermediate',
    trainerId: trainer1Id,
    trainerName: 'Priya Nair',
    thumbnail: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400',
    tags: ['leadership', 'management', 'team building'],
    enrollmentCount: 34,
    maxEnrollment: 50,
    status: 'Active',
    createdAt: new Date('2025-02-10T10:00:00Z'),
  },
  {
    _id: course2Id,
    title: 'Communication Skills for Professionals',
    description:
      'Master verbal, non-verbal, and written communication techniques to succeed in a corporate environment.',
    subject: 'Soft Skills',
    category: 'Soft Skills',
    duration: '10 hours',
    level: 'Beginner',
    trainerId: trainer1Id,
    trainerName: 'Priya Nair',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400',
    tags: ['communication', 'presentation', 'writing'],
    enrollmentCount: 48,
    maxEnrollment: 60,
    status: 'Active',
    createdAt: new Date('2025-02-15T10:00:00Z'),
  },
  {
    _id: course3Id,
    title: 'Cloud Computing Fundamentals (AWS & Azure)',
    description:
      'Hands-on introduction to cloud infrastructure, IaaS, PaaS, SaaS models, and deployment on AWS and Azure.',
    subject: 'Cloud',
    category: 'Technology',
    duration: '24 hours',
    level: 'Beginner',
    trainerId: trainer2Id,
    trainerName: 'Rahul Desai',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    tags: ['cloud', 'aws', 'azure', 'infrastructure'],
    enrollmentCount: 62,
    maxEnrollment: 80,
    status: 'Active',
    createdAt: new Date('2025-03-01T10:00:00Z'),
  },
  {
    _id: course4Id,
    title: 'Agile & Scrum Practitioner',
    description:
      'Understand Agile values, Scrum ceremonies, sprint planning, and how to deliver value iteratively in modern software teams.',
    subject: 'Agile',
    category: 'Technology',
    duration: '12 hours',
    level: 'Intermediate',
    trainerId: trainer2Id,
    trainerName: 'Rahul Desai',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    tags: ['agile', 'scrum', 'project management'],
    enrollmentCount: 27,
    maxEnrollment: 40,
    status: 'Active',
    createdAt: new Date('2025-03-10T10:00:00Z'),
  },
  {
    _id: course5Id,
    title: 'HR Practices & Compliance Essentials',
    description:
      'Covers HR policies, statutory compliance, employee lifecycle management, and best practices for people managers.',
    subject: 'HR Practices',
    category: 'Human Resources',
    duration: '8 hours',
    level: 'Beginner',
    trainerId: trainer1Id,
    trainerName: 'Priya Nair',
    thumbnail: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400',
    tags: ['hr', 'compliance', 'people management'],
    enrollmentCount: 19,
    maxEnrollment: 35,
    status: 'Active',
    createdAt: new Date('2025-03-20T10:00:00Z'),
  },
];

// ── Assessments ──────────────────────────────────
db.assessments = [
  {
    _id: uuidv4(),
    courseId: course3Id,
    courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)',
    title: 'Cloud Fundamentals – Chapter Quiz',
    passingScore: 60,
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is an example of Infrastructure as a Service (IaaS)?',
        options: [
          'Google Drive',
          'Amazon EC2',
          'Salesforce CRM',
          'Microsoft Office 365',
        ],
        correctAnswer: 'Amazon EC2',
      },
      {
        id: 'q2',
        text: 'What does "elasticity" mean in cloud computing?',
        options: [
          'The ability to stretch physical servers',
          'Automatically scaling resources up or down based on demand',
          'A type of virtual machine',
          'A cloud storage format',
        ],
        correctAnswer: 'Automatically scaling resources up or down based on demand',
      },
      {
        id: 'q3',
        text: 'Which AWS service is used for object storage?',
        options: ['EC2', 'RDS', 'S3', 'Lambda'],
        correctAnswer: 'S3',
      },
      {
        id: 'q4',
        text: 'In the shared responsibility model, who is responsible for securing the cloud infrastructure?',
        options: [
          'The customer',
          'The cloud provider',
          'Both equally',
          'A third-party auditor',
        ],
        correctAnswer: 'The cloud provider',
      },
      {
        id: 'q5',
        text: 'Which Azure service is equivalent to AWS EC2?',
        options: [
          'Azure Blob Storage',
          'Azure Virtual Machines',
          'Azure Functions',
          'Azure SQL Database',
        ],
        correctAnswer: 'Azure Virtual Machines',
      },
    ],
    createdAt: new Date('2025-03-05T10:00:00Z'),
  },
  {
    _id: uuidv4(),
    courseId: course4Id,
    courseTitle: 'Agile & Scrum Practitioner',
    title: 'Agile Fundamentals Quiz',
    passingScore: 60,
    questions: [
      {
        id: 'q1',
        text: 'What is the primary goal of a Sprint Review?',
        options: [
          'To plan the next sprint backlog',
          'To inspect the increment and gather stakeholder feedback',
          'To retrospect on team processes',
          'To update project documentation',
        ],
        correctAnswer: 'To inspect the increment and gather stakeholder feedback',
      },
      {
        id: 'q2',
        text: 'Which of the following is NOT one of the four Agile Manifesto values?',
        options: [
          'Individuals and interactions over processes and tools',
          'Comprehensive documentation over working software',
          'Customer collaboration over contract negotiation',
          'Responding to change over following a plan',
        ],
        correctAnswer: 'Comprehensive documentation over working software',
      },
      {
        id: 'q3',
        text: 'How long is a typical Scrum Sprint?',
        options: ['1 week', '2 to 4 weeks', '2 months', 'The entire project duration'],
        correctAnswer: '2 to 4 weeks',
      },
      {
        id: 'q4',
        text: 'Who is responsible for managing the Product Backlog?',
        options: ['Scrum Master', 'Development Team', 'Product Owner', 'Stakeholders'],
        correctAnswer: 'Product Owner',
      },
      {
        id: 'q5',
        text: 'What is "velocity" in Scrum?',
        options: [
          'How fast developers can type code',
          'The number of story points completed per sprint on average',
          'A metric for server response time',
          'The speed of the daily standup',
        ],
        correctAnswer: 'The number of story points completed per sprint on average',
      },
    ],
    createdAt: new Date('2025-03-12T10:00:00Z'),
  },
];

// ── Trainer Library ──────────────────────────────
db.library = [
  {
    _id: uuidv4(),
    title: 'Leadership Essentials – Slide Deck',
    description:
      'Comprehensive presentation slides covering leadership styles, team dynamics, and motivational frameworks.',
    type: 'slides',
    url: 'https://docs.google.com/presentation/d/example-leadership-slides',
    courseId: course1Id,
    courseTitle: 'Effective Leadership & Team Management',
    uploadedBy: trainer1Id,
    uploaderName: 'Priya Nair',
    tags: ['leadership', 'slides', 'presentation'],
    fileSize: '4.2 MB',
    createdAt: new Date('2025-02-12T10:00:00Z'),
  },
  {
    _id: uuidv4(),
    title: 'Cloud Computing Bootcamp – Session Recording',
    description:
      'Full recorded session of the live cloud computing bootcamp covering AWS core services and hands-on demos.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=example-cloud-bootcamp',
    courseId: course3Id,
    courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)',
    uploadedBy: trainer2Id,
    uploaderName: 'Rahul Desai',
    tags: ['cloud', 'video', 'aws', 'recorded session'],
    duration: '1h 45m',
    createdAt: new Date('2025-03-03T10:00:00Z'),
  },
  {
    _id: uuidv4(),
    title: 'HR Compliance Quick Reference Guide',
    description:
      'A concise PDF guide summarising key statutory HR compliance requirements, deadlines, and checklists for Indian organisations.',
    type: 'pdf',
    url: 'https://storage.example.com/library/hr-compliance-guide.pdf',
    courseId: course5Id,
    courseTitle: 'HR Practices & Compliance Essentials',
    uploadedBy: trainer1Id,
    uploaderName: 'Priya Nair',
    tags: ['hr', 'compliance', 'pdf', 'reference'],
    fileSize: '1.8 MB',
    createdAt: new Date('2025-03-22T10:00:00Z'),
  },
];

// ── Announcements ────────────────────────────────
db.announcements = [
  {
    _id: uuidv4(),
    title: '🎉 Platform Launch – Welcome to Capacity Connect!',
    content:
      'We are thrilled to announce the official launch of Capacity Connect, our new internal learning management platform. Explore courses, assessments, and resources designed to accelerate your professional growth.',
    type: 'announcement',
    postedBy: adminId,
    postedByName: 'Arjun Mehta',
    isPublic: true,
    createdAt: new Date('2025-01-15T09:00:00Z'),
  },
  {
    _id: uuidv4(),
    title: '🏆 Achievement: 100 Learners Enrolled This Month!',
    content:
      'Capacity Connect has crossed a major milestone — over 100 employees have enrolled in learning programmes in our first month! A big thank you to our trainers and all active learners.',
    type: 'achievement',
    postedBy: adminId,
    postedByName: 'Arjun Mehta',
    isPublic: true,
    createdAt: new Date('2025-02-28T10:00:00Z'),
  },
  {
    _id: uuidv4(),
    title: '📢 New Courses Available – March Batch',
    content:
      'Three new courses have been added for the March batch: Agile & Scrum Practitioner, HR Practices & Compliance Essentials, and Cloud Computing Fundamentals. Enrol now — seats are limited!',
    type: 'announcement',
    postedBy: trainer1Id,
    postedByName: 'Priya Nair',
    isPublic: true,
    createdAt: new Date('2025-03-01T08:00:00Z'),
  },
];

/* ─────────────────────────────────────────────
   GENERIC CRUD HELPERS
   These mirror the Mongoose API surface so routes
   can be migrated with minimal changes.
───────────────────────────────────────────── */

/**
 * Find all documents in a collection, with optional filter predicate.
 * @param {string} collection – key in db object
 * @param {function} [predicate] – optional filter fn
 */
function findAll(collection, predicate) {
  const docs = db[collection];
  return predicate ? docs.filter(predicate) : [...docs];
}

/**
 * Find a single document by its _id field.
 */
function findById(collection, id) {
  return db[collection].find((doc) => doc._id === id) || null;
}

/**
 * Find a single document matching an arbitrary predicate.
 */
function findOne(collection, predicate) {
  return db[collection].find(predicate) || null;
}

/**
 * Insert a new document.  Adds a UUID _id and createdAt if not present.
 */
function insertOne(collection, data) {
  const doc = {
    _id: data._id || uuidv4(),
    ...data,
    createdAt: data.createdAt || new Date(),
  };
  db[collection].push(doc);
  return doc;
}

/**
 * Update fields of a document identified by _id.
 * Returns the updated document, or null if not found.
 */
function updateById(collection, id, updates) {
  const idx = db[collection].findIndex((doc) => doc._id === id);
  if (idx === -1) return null;
  db[collection][idx] = { ...db[collection][idx], ...updates, updatedAt: new Date() };
  return db[collection][idx];
}

/**
 * Delete a document by _id. Returns true if deleted, false otherwise.
 */
function deleteById(collection, id) {
  const idx = db[collection].findIndex((doc) => doc._id === id);
  if (idx === -1) return false;
  db[collection].splice(idx, 1);
  return true;
}

module.exports = {
  db,
  findAll,
  findById,
  findOne,
  insertOne,
  updateById,
  deleteById,
};
