/**
 * seed/seedData.js
 *
 * Same demo data that used to live inline in db.js, now used to populate
 * MongoDB on first run only (see db.js -> seedIfEmpty). Passwords are
 * hashed with bcrypt before being written to the database.
 */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seed({ User, Course, Enrollment, Assessment, LibraryItem, Announcement }) {
  const hash = (plain) => bcrypt.hash(plain, 10);

  // ── Users ──────────────────────────────────────
  const adminId = uuidv4();
  const trainer1Id = uuidv4();
  const trainer2Id = uuidv4();
  const trainee1Id = uuidv4();
  const trainee2Id = uuidv4();
  const trainee3Id = uuidv4();
  const trainee4Id = uuidv4();
  const trainee5Id = uuidv4();
  const demoTraineeId = 'user-jason';

  await User.insertMany([
    {
      _id: adminId,
      name: 'Arjun Mehta',
      email: 'admin@capacityconnect.in',
      password: await hash('admin@123'),
      role: 'Admin',
      status: 'Approved',
      profile: { phone: '+91-9876500001', designation: 'Platform Administrator', department: 'IT' },
      createdAt: new Date('2025-01-01T08:00:00Z'),
    },
    {
      _id: trainer1Id,
      name: 'Priya Nair',
      email: 'priya.nair@capacityconnect.in',
      password: await hash('trainer@123'),
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
      password: await hash('trainer@123'),
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
    {
      _id: trainee1Id,
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Approved',
      profile: { phone: '+91-9876500010', designation: 'HR Executive', department: 'Human Resources', enrolledCourses: [] },
      createdAt: new Date('2025-02-01T10:00:00Z'),
    },
    {
      _id: trainee2Id,
      name: 'Karan Verma',
      email: 'karan.verma@example.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Approved',
      profile: { phone: '+91-9876500011', designation: 'Junior Developer', department: 'Engineering', enrolledCourses: [] },
      createdAt: new Date('2025-02-03T11:00:00Z'),
    },
    {
      _id: trainee3Id,
      name: 'Sneha Pillai',
      email: 'sneha.pillai@example.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Pending',
      profile: { phone: '+91-9876500012', designation: 'Business Analyst', department: 'Operations', enrolledCourses: [] },
      createdAt: new Date('2025-03-10T09:15:00Z'),
    },
    {
      _id: trainee4Id,
      name: 'Mohit Joshi',
      email: 'mohit.joshi@example.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Pending',
      profile: { phone: '+91-9876500013', designation: 'Sales Executive', department: 'Sales', enrolledCourses: [] },
      createdAt: new Date('2025-03-12T14:30:00Z'),
    },
    {
      _id: trainee5Id,
      name: 'Divya Rao',
      email: 'divya.rao@example.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Pending',
      profile: { phone: '+91-9876500014', designation: 'Marketing Coordinator', department: 'Marketing', enrolledCourses: [] },
      createdAt: new Date('2025-03-15T08:45:00Z'),
    },
    {
      _id: demoTraineeId,
      name: 'Jason Ranti',
      email: 'jason.ranti@coursue.com',
      password: await hash('trainee@123'),
      role: 'Trainee',
      status: 'Approved',
      profile: { designation: 'Product Designer', department: 'Design', enrolledCourses: [] },
      createdAt: new Date('2025-03-16T09:00:00Z'),
    },
  ]);

  // ── Courses ─────────────────────────────────────
  const course1Id = uuidv4();
  const course2Id = uuidv4();
  const course3Id = uuidv4();
  const course4Id = uuidv4();
  const course5Id = uuidv4();

  await Course.insertMany([
    {
      _id: course1Id,
      title: 'Effective Leadership & Team Management',
      description: 'A comprehensive course on building high-performing teams, resolving conflicts, and developing leadership presence in the workplace.',
      subject: 'Management',
      category: 'Soft Skills',
      duration: '16 hours',
      level: 'Intermediate',
      trainerId: trainer1Id,
      trainerName: 'Priya Nair',
      requiredSkills: ['Leadership', 'Team Building', 'Conflict Resolution', 'Communication'],
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
      description: 'Master verbal, non-verbal, and written communication techniques to succeed in a corporate environment.',
      subject: 'Soft Skills',
      category: 'Soft Skills',
      duration: '10 hours',
      level: 'Beginner',
      trainerId: trainer1Id,
      trainerName: 'Priya Nair',
      requiredSkills: ['Communication', 'Presentation', 'Coaching'],
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
      description: 'Hands-on introduction to cloud infrastructure, IaaS, PaaS, SaaS models, and deployment on AWS and Azure.',
      subject: 'Cloud',
      category: 'Technology',
      duration: '24 hours',
      level: 'Beginner',
      trainerId: trainer2Id,
      trainerName: 'Rahul Desai',
      requiredSkills: ['Cloud Computing', 'AWS', 'Azure', 'DevOps'],
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
      description: 'Understand Agile values, Scrum ceremonies, sprint planning, and how to deliver value iteratively in modern software teams.',
      subject: 'Agile',
      category: 'Technology',
      duration: '12 hours',
      level: 'Intermediate',
      trainerId: trainer2Id,
      trainerName: 'Rahul Desai',
      requiredSkills: ['Agile', 'Scrum', 'Project Management', 'Product Ownership'],
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
      description: 'Covers HR policies, statutory compliance, employee lifecycle management, and best practices for people managers.',
      subject: 'HR Practices',
      category: 'Human Resources',
      duration: '8 hours',
      level: 'Beginner',
      trainerId: trainer1Id,
      trainerName: 'Priya Nair',
      requiredSkills: ['HR Practices', 'Compliance', 'Leadership', 'Coaching'],
      thumbnail: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400',
      tags: ['hr', 'compliance', 'people management'],
      enrollmentCount: 19,
      maxEnrollment: 35,
      status: 'Active',
      createdAt: new Date('2025-03-20T10:00:00Z'),
    },
  ]);

  // ── Enrollments ───────────────────────────────
  await Enrollment.insertMany([
    { _id: uuidv4(), userId: demoTraineeId, courseId: course1Id, status: 'Active', enrolledAt: new Date('2025-03-18T10:00:00Z') },
    { _id: uuidv4(), userId: demoTraineeId, courseId: course3Id, status: 'Active', enrolledAt: new Date('2025-03-19T10:00:00Z') },
  ]);

  // ── Assessments ───────────────────────────────
  await Assessment.insertMany([
    {
      _id: uuidv4(),
      courseId: course3Id,
      courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)',
      title: 'Cloud Fundamentals – Chapter Quiz',
      passingScore: 60,
      questions: [
        { id: 'q1', text: 'Which of the following is an example of Infrastructure as a Service (IaaS)?', options: ['Google Drive', 'Amazon EC2', 'Salesforce CRM', 'Microsoft Office 365'], correctAnswer: 'Amazon EC2' },
        { id: 'q2', text: 'What does "elasticity" mean in cloud computing?', options: ['The ability to stretch physical servers', 'Automatically scaling resources up or down based on demand', 'A type of virtual machine', 'A cloud storage format'], correctAnswer: 'Automatically scaling resources up or down based on demand' },
        { id: 'q3', text: 'Which AWS service is used for object storage?', options: ['EC2', 'RDS', 'S3', 'Lambda'], correctAnswer: 'S3' },
        { id: 'q4', text: 'In the shared responsibility model, who is responsible for securing the cloud infrastructure?', options: ['The customer', 'The cloud provider', 'Both equally', 'A third-party auditor'], correctAnswer: 'The cloud provider' },
        { id: 'q5', text: 'Which Azure service is equivalent to AWS EC2?', options: ['Azure Blob Storage', 'Azure Virtual Machines', 'Azure Functions', 'Azure SQL Database'], correctAnswer: 'Azure Virtual Machines' },
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
        { id: 'q1', text: 'What is the primary goal of a Sprint Review?', options: ['To plan the next sprint backlog', 'To inspect the increment and gather stakeholder feedback', 'To retrospect on team processes', 'To update project documentation'], correctAnswer: 'To inspect the increment and gather stakeholder feedback' },
        { id: 'q2', text: 'Which of the following is NOT one of the four Agile Manifesto values?', options: ['Individuals and interactions over processes and tools', 'Comprehensive documentation over working software', 'Customer collaboration over contract negotiation', 'Responding to change over following a plan'], correctAnswer: 'Comprehensive documentation over working software' },
        { id: 'q3', text: 'How long is a typical Scrum Sprint?', options: ['1 week', '2 to 4 weeks', '2 months', 'The entire project duration'], correctAnswer: '2 to 4 weeks' },
        { id: 'q4', text: 'Who is responsible for managing the Product Backlog?', options: ['Scrum Master', 'Development Team', 'Product Owner', 'Stakeholders'], correctAnswer: 'Product Owner' },
        { id: 'q5', text: 'What is "velocity" in Scrum?', options: ['How fast developers can type code', 'The number of story points completed per sprint on average', 'A metric for server response time', 'The speed of the daily standup'], correctAnswer: 'The number of story points completed per sprint on average' },
      ],
      createdAt: new Date('2025-03-12T10:00:00Z'),
    },
  ]);

  // ── Library ───────────────────────────────────
  await LibraryItem.insertMany([
    { _id: uuidv4(), title: 'Leadership Essentials – Slide Deck', description: 'Comprehensive presentation slides covering leadership styles, team dynamics, and motivational frameworks.', type: 'slides', url: 'https://docs.google.com/presentation/d/example-leadership-slides', courseId: course1Id, courseTitle: 'Effective Leadership & Team Management', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['leadership', 'slides', 'presentation'], fileSize: '4.2 MB', createdAt: new Date('2025-02-12T10:00:00Z') },
    { _id: uuidv4(), title: 'Leadership Essentials – Lecture', description: 'YouTube lecture on leadership styles, team dynamics, and building trust.', type: 'video', url: 'https://www.youtube.com/watch?v=5GZ2WkQ8n4A', courseId: course1Id, courseTitle: 'Effective Leadership & Team Management', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['leadership', 'lecture', 'youtube'], duration: '24m', createdAt: new Date('2025-02-13T10:00:00Z') },
    { _id: uuidv4(), title: 'Leadership Workshop Notes', description: 'PDF notes covering leadership frameworks and team management practices.', type: 'pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', courseId: course1Id, courseTitle: 'Effective Leadership & Team Management', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['leadership', 'notes', 'pdf'], fileSize: '1.2 MB', createdAt: new Date('2025-02-14T10:00:00Z') },
    { _id: uuidv4(), title: 'Professional Communication – Lecture', description: 'YouTube lecture on clear communication, listening, and workplace presentations.', type: 'video', url: 'https://www.youtube.com/watch?v=HAnw168huqA', courseId: course2Id, courseTitle: 'Communication Skills for Professionals', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['communication', 'lecture', 'youtube'], duration: '31m', createdAt: new Date('2025-02-16T10:00:00Z') },
    { _id: uuidv4(), title: 'Communication Skills Notes', description: 'PDF notes with practical communication checklists and presentation guidance.', type: 'pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', courseId: course2Id, courseTitle: 'Communication Skills for Professionals', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['communication', 'notes', 'pdf'], fileSize: '980 KB', createdAt: new Date('2025-02-17T10:00:00Z') },
    { _id: uuidv4(), title: 'Cloud Computing Bootcamp – Session Recording', description: 'Full recorded session of the live cloud computing bootcamp covering AWS core services and hands-on demos.', type: 'video', url: 'https://www.youtube.com/watch?v=M988_fsOSWo', courseId: course3Id, courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)', uploadedBy: trainer2Id, uploaderName: 'Rahul Desai', tags: ['cloud', 'video', 'aws', 'recorded session'], duration: '1h 45m', createdAt: new Date('2025-03-03T10:00:00Z') },
    { _id: uuidv4(), title: 'Cloud Fundamentals Notes', description: 'PDF notes on IaaS, PaaS, SaaS, AWS core services, and Azure equivalents.', type: 'pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', courseId: course3Id, courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)', uploadedBy: trainer2Id, uploaderName: 'Rahul Desai', tags: ['cloud', 'aws', 'azure', 'notes', 'pdf'], fileSize: '2.4 MB', createdAt: new Date('2025-03-04T10:00:00Z') },
    { _id: uuidv4(), title: 'Agile and Scrum – Lecture', description: 'YouTube lecture covering Scrum roles, ceremonies, and sprint planning.', type: 'video', url: 'https://www.youtube.com/watch?v=502ILHjX9EE', courseId: course4Id, courseTitle: 'Agile & Scrum Practitioner', uploadedBy: trainer2Id, uploaderName: 'Rahul Desai', tags: ['agile', 'scrum', 'lecture', 'youtube'], duration: '28m', createdAt: new Date('2025-03-11T10:00:00Z') },
    { _id: uuidv4(), title: 'Agile Practitioner Notes', description: 'PDF notes for sprint planning, reviews, retrospectives, and team velocity.', type: 'pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', courseId: course4Id, courseTitle: 'Agile & Scrum Practitioner', uploadedBy: trainer2Id, uploaderName: 'Rahul Desai', tags: ['agile', 'scrum', 'notes', 'pdf'], fileSize: '1.5 MB', createdAt: new Date('2025-03-12T10:00:00Z') },
    { _id: uuidv4(), title: 'HR Compliance Quick Reference Guide', description: 'A concise PDF guide summarising key statutory HR compliance requirements, deadlines, and checklists for Indian organisations.', type: 'pdf', url: 'https://storage.example.com/library/hr-compliance-guide.pdf', courseId: course5Id, courseTitle: 'HR Practices & Compliance Essentials', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['hr', 'compliance', 'pdf', 'reference'], fileSize: '1.8 MB', createdAt: new Date('2025-03-22T10:00:00Z') },
    { _id: uuidv4(), title: 'HR Practices – Lecture', description: 'YouTube lecture on employee lifecycle, HR policies, and compliance essentials.', type: 'video', url: 'https://www.youtube.com/watch?v=6fQHLK1cIBY', courseId: course5Id, courseTitle: 'HR Practices & Compliance Essentials', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['hr', 'compliance', 'lecture', 'youtube'], duration: '26m', createdAt: new Date('2025-03-23T10:00:00Z') },
    { _id: uuidv4(), title: 'HR Compliance Notes', description: 'PDF notes with compliance checklists and employee lifecycle reference material.', type: 'pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', courseId: course5Id, courseTitle: 'HR Practices & Compliance Essentials', uploadedBy: trainer1Id, uploaderName: 'Priya Nair', tags: ['hr', 'compliance', 'notes', 'pdf'], fileSize: '1.8 MB', createdAt: new Date('2025-03-24T10:00:00Z') },
  ]);

  // ── Announcements ─────────────────────────────
  await Announcement.insertMany([
    { _id: uuidv4(), title: '🎉 Platform Launch – Welcome to Capacity Connect!', content: 'We are thrilled to announce the official launch of Capacity Connect, our new internal learning management platform. Explore courses, assessments, and resources designed to accelerate your professional growth.', type: 'announcement', postedBy: adminId, postedByName: 'Arjun Mehta', isPublic: true, createdAt: new Date('2025-01-15T09:00:00Z') },
    { _id: uuidv4(), title: '🏆 Achievement: 100 Learners Enrolled This Month!', content: 'Capacity Connect has crossed a major milestone — over 100 employees have enrolled in learning programmes in our first month! A big thank you to our trainers and all active learners.', type: 'achievement', postedBy: adminId, postedByName: 'Arjun Mehta', isPublic: true, createdAt: new Date('2025-02-28T10:00:00Z') },
    { _id: uuidv4(), title: '📢 New Courses Available – March Batch', content: 'Three new courses have been added for the March batch: Agile & Scrum Practitioner, HR Practices & Compliance Essentials, and Cloud Computing Fundamentals. Enrol now — seats are limited!', type: 'announcement', postedBy: trainer1Id, postedByName: 'Priya Nair', isPublic: true, createdAt: new Date('2025-03-01T08:00:00Z') },
  ]);
}

module.exports = { seed };
