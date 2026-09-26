/**
 * API Client for Capacity Connect backend
 * Connects to http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEMO_COURSES = [
  {
    _id: 'course-1',
    title: 'Effective Leadership & Team Management',
    description: 'A comprehensive course on building high-performing teams, resolving conflicts, and developing leadership presence in the workplace.',
    subject: 'Management',
    category: 'Soft Skills',
    duration: '16 hours',
    level: 'Intermediate',
    trainerId: 'demo-trainer',
    trainerName: 'Priya Nair',
    requiredSkills: ['Leadership', 'Team Building', 'Conflict Resolution', 'Communication'],
    thumbnail: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400',
    tags: ['leadership', 'management', 'team building'],
    enrollmentCount: 34,
    maxEnrollment: 50,
    status: 'Active',
  },
  {
    _id: 'course-2',
    title: 'Communication Skills for Professionals',
    description: 'Master verbal, non-verbal, and written communication techniques to succeed in a corporate environment.',
    subject: 'Soft Skills',
    category: 'Soft Skills',
    duration: '10 hours',
    level: 'Beginner',
    trainerId: 'demo-trainer',
    trainerName: 'Priya Nair',
    requiredSkills: ['Communication', 'Presentation', 'Coaching'],
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400',
    tags: ['communication', 'presentation', 'writing'],
    enrollmentCount: 48,
    maxEnrollment: 60,
    status: 'Active',
  },
  {
    _id: 'course-3',
    title: 'Cloud Computing Fundamentals (AWS & Azure)',
    description: 'Hands-on introduction to cloud infrastructure, IaaS, PaaS, SaaS models, and deployment on AWS and Azure.',
    subject: 'Cloud',
    category: 'Technology',
    duration: '24 hours',
    level: 'Beginner',
    trainerId: 'demo-trainer-2',
    trainerName: 'Rahul Desai',
    requiredSkills: ['Cloud Computing', 'AWS', 'Azure', 'DevOps'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    tags: ['cloud', 'aws', 'azure', 'infrastructure'],
    enrollmentCount: 62,
    maxEnrollment: 80,
    status: 'Active',
  },
  {
    _id: 'course-4',
    title: 'Agile & Scrum Practitioner',
    description: 'Develop agile delivery habits, sprint planning practices, and Scrum rituals that improve cross-functional execution.',
    subject: 'Agile',
    category: 'Technology',
    duration: '18 hours',
    level: 'Intermediate',
    trainerId: 'demo-trainer-2',
    trainerName: 'Rahul Desai',
    requiredSkills: ['Agile', 'Scrum', 'Sprint Planning', 'Stakeholder Communication'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    tags: ['agile', 'scrum', 'delivery'],
    enrollmentCount: 41,
    maxEnrollment: 55,
    status: 'Active',
  },
  {
    _id: 'course-5',
    title: 'HR Practices & Compliance Essentials',
    description: 'Understand the practical HR framework for employee life-cycle management, labor policies, and compliance workflows.',
    subject: 'HR Practices',
    category: 'Human Resources',
    duration: '14 hours',
    level: 'Beginner',
    trainerId: 'demo-trainer',
    trainerName: 'Priya Nair',
    requiredSkills: ['HR Practices', 'Policy Design', 'Employment Law'],
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    tags: ['hr', 'compliance', 'policy'],
    enrollmentCount: 36,
    maxEnrollment: 45,
    status: 'Active',
  },
];

const DEMO_LIBRARY = [
  {
    _id: 'library-1',
    courseId: 'course-1',
    courseTitle: 'Effective Leadership & Team Management',
    title: 'Leadership Playbook',
    type: 'pdf',
    url: 'https://example.com/leadership-playbook.pdf',
    description: 'Practical framework for leading distributed teams.',
    tags: ['leadership', 'teamwork'],
  },
  {
    _id: 'library-2',
    courseId: 'course-2',
    courseTitle: 'Communication Skills for Professionals',
    title: 'Executive Communication Guide',
    type: 'slides',
    url: 'https://example.com/executive-communication-guide.pdf',
    description: 'Presentation and feedback frameworks for managers.',
    tags: ['communication', 'presentation'],
  },
  {
    _id: 'library-3',
    courseId: 'course-3',
    courseTitle: 'Cloud Computing Fundamentals (AWS & Azure)',
    title: 'Cloud Architecture Overview',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=4dIZK8nL0Bg',
    description: 'Introductory walkthrough of cloud service models and deployment design.',
    tags: ['cloud', 'architecture'],
  },
];

const DEMO_ASSESSMENTS = [
  {
    _id: 'assessment-1',
    courseId: 'course-1',
    title: 'Leadership & Team Management Quiz',
    courseTitle: 'Effective Leadership & Team Management',
    questions: 5,
    passingScore: 60,
    deadline: '2026-10-05',
  },
  {
    _id: 'assessment-2',
    courseId: 'course-2',
    title: 'Communication Fundamentals Quiz',
    courseTitle: 'Communication Skills for Professionals',
    questions: 5,
    passingScore: 60,
    deadline: '2026-10-10',
  },
];

const DEMO_FEEDBACK = [
  {
    _id: 'feedback-1',
    userName: 'Ananya Sharma',
    userRole: 'Trainee',
    category: 'Course Experience',
    rating: 5,
    message: 'The leadership module was clear and practical. The facilitators gave actionable coaching tips.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'feedback-2',
    userName: 'Karan Verma',
    userRole: 'Trainee',
    category: 'Platform Feedback',
    rating: 4,
    message: 'The course library was easy to use, and the workshop content felt relevant to the work.',
    createdAt: new Date().toISOString(),
  },
];

const DEMO_ANNOUNCEMENTS = [
  {
    _id: 'announcement-1',
    title: 'Leadership cohort is live',
    message: 'This week’s cohort for leadership practice is now open for enrollment.',
    type: 'training',
    createdAt: new Date().toISOString(),
  },
];

const DEMO_USERS = [
  {
    _id: 'demo-admin',
    name: 'Arjun Mehta',
    email: 'admin@capacityconnect.in',
    role: 'Admin',
    status: 'Approved',
  },
  {
    _id: 'demo-trainer',
    name: 'Priya Nair',
    email: 'priya.nair@capacityconnect.in',
    role: 'Trainer',
    status: 'Approved',
  },
  {
    _id: 'demo-trainee',
    name: 'Jason Ranti',
    email: 'jason.ranti@coursue.com',
    role: 'Trainee',
    status: 'Approved',
  },
];

const DEMO_ENROLLMENTS = {
  'demo-trainee': [{ courseId: 'course-1' }, { courseId: 'course-2' }],
  'demo-trainer': [{ courseId: 'course-1' }, { courseId: 'course-5' }],
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('capacity_connect_user') || 'null');
  } catch {
    return null;
  }
};

const isDemoRoute = () => {
  const user = getStoredUser();
  const hasNoToken = !localStorage.getItem('capacity_connect_token');
  return !!user && hasNoToken && user._id?.startsWith('demo-');
};

const getDemoResponse = (endpoint, options = {}) => {
  const normalised = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(normalised, 'http://demo.local');
  const path = url.pathname;
  const query = Object.fromEntries(url.searchParams.entries());

  if (path === '/users') {
    return { users: DEMO_USERS };
  }

  if (path === '/courses') {
    let courses = [...DEMO_COURSES];
    const trainerId = query.trainerId;
    const trainerName = query.trainerName;
    if (trainerId || trainerName) {
      courses = courses.filter((course) =>
        (trainerId && course.trainerId === trainerId) ||
        (trainerName && course.trainerName === trainerName)
      );
    }
    return { courses };
  }

  if (path.startsWith('/courses/') && path.endsWith('/trainer')) {
    const courseId = path.split('/')[2];
    const payload = options.body ? JSON.parse(options.body) : {};
    const trainerName = payload.trainerName || payload.name || 'Priya Nair';
    const trainerId = payload.trainerId || payload.id || 'demo-trainer';
    const course = DEMO_COURSES.find((item) => item._id === courseId);
    if (course) {
      course.trainerId = trainerId;
      course.trainerName = trainerName;
    }
    return {
      success: true,
      message: `Assigned ${trainerName} as lead instructor!`,
      course,
    };
  }

  if (path.startsWith('/courses/')) {
    const courseId = path.split('/')[2];
    const course = DEMO_COURSES.find((item) => item._id === courseId);
    return { course };
  }

  if (path === '/library') {
    const courseId = query.courseId;
    const library = courseId
      ? DEMO_LIBRARY.filter((item) => item.courseId === courseId)
      : DEMO_LIBRARY;
    return { library };
  }

  if (path === '/assessments') {
    const courseId = query.courseId;
    const assessments = courseId
      ? DEMO_ASSESSMENTS.filter((item) => item.courseId === courseId)
      : DEMO_ASSESSMENTS;
    return { assessments };
  }

  if (path.startsWith('/assessments/course/')) {
    const courseId = path.split('/')[3];
    return { assessments: DEMO_ASSESSMENTS.filter((item) => item.courseId === courseId) };
  }

  if (path.startsWith('/enrollments/')) {
    const userId = path.split('/')[2];
    return { enrollments: DEMO_ENROLLMENTS[userId] || [] };
  }

  if (path === '/enrollments') {
    const payload = options.body ? JSON.parse(options.body) : {};
    const list = DEMO_ENROLLMENTS[payload.userId] || [];
    list.push({ courseId: payload.courseId });
    DEMO_ENROLLMENTS[payload.userId] = list;
    return { success: true, enrollment: { userId: payload.userId, courseId: payload.courseId } };
  }

  if (path.startsWith('/analytics/trainee/')) {
    const userId = path.split('/')[3];
    const chart = {
      title: 'Performance analytics',
      summary: 'Scores and learning hours',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      series: [
        { label: 'Assessment score', color: '#755BE8', values: [82, 86, 90, 94] },
        { label: 'Learning hours', color: '#C7BDF2', values: [20, 26, 32, 38] },
      ],
      max: 100,
    };
    return { chart, userId, success: true };
  }

  if (path.startsWith('/analytics/trainer/')) {
    const trainerId = path.split('/')[3];
    const chart = {
      title: 'Class performance',
      summary: 'Completion, scores, engagement',
      labels: ['Current'],
      series: [
        { label: 'Completion', color: '#755BE8', values: [92] },
        { label: 'Test score', color: '#A997EE', values: [88] },
        { label: 'Engagement', color: '#D8D0F7', values: [90] },
      ],
      max: 100,
    };
    return { chart, trainerId, success: true };
  }

  if (path === '/announcements') {
    return { announcements: DEMO_ANNOUNCEMENTS };
  }

  if (path === '/feedback') {
    return { feedback: DEMO_FEEDBACK };
  }

  if (path === '/ai/chat') {
    const payload = options.body ? JSON.parse(options.body) : {};
    const role = payload.userRole || 'Trainee';
    const courseId = payload.courseId;
    const course = courseId ? DEMO_COURSES.find((item) => item._id === courseId) : DEMO_COURSES[0];
    const libraryForCourse = DEMO_LIBRARY.filter((item) => !courseId || item.courseId === courseId);
    const lowerMessage = String(payload.message || '').toLowerCase();
    const resourceNames = libraryForCourse.length
      ? libraryForCourse.slice(0, 2).map((item) => item.title).join(', ')
      : 'course notes and slides';

    let reply = `I’m helping you with ${course?.title || 'your current course'} in ${role} mode. Use the core concepts, practical examples, and the provided materials like ${resourceNames} to deepen your understanding.`;

    if (role === 'Trainee') {
      if (lowerMessage.includes('summary')) {
        reply = `Here is a quick summary for ${course?.title || 'this course'}: ${course?.description || 'This module focuses on practical, work-ready skills and real-world application.'} Review ${resourceNames} to reinforce the main ideas and connect them to your daily work.`;
      } else if (lowerMessage.includes('quiz') || lowerMessage.includes('practice')) {
        reply = `Try this practice prompt: 1) define the main objective, 2) list three key takeaways, 3) explain one workplace scenario where the skill applies. This will help you test understanding of ${course?.title || 'your module'} without relying on memorisation alone.`;
      } else if (lowerMessage.includes('concept') || lowerMessage.includes('explain')) {
        reply = `A simple concept breakdown is to start with the purpose, then explain the main framework, then connect it to a real example. This makes the idea easier to remember and apply in ${course?.title || 'your course'}.`;
      }
    } else if (role === 'Trainer') {
      if (lowerMessage.includes('quiz') || lowerMessage.includes('mcq')) {
        reply = `For ${course?.title || 'this course'}, draft 5 concise MCQs with mixed recall and application questions. Cover the key concept, the correct framework, the practical scenario, and the likely result of a poor implementation.`;
      } else if (lowerMessage.includes('outline') || lowerMessage.includes('lesson')) {
        reply = `Create a lesson flow with: learning objective, 3 concept blocks, one worked example, a quick reflection task, and a short assessment. That structure works well for ${course?.title || 'your selected course'} and keeps the session practical.`;
      }
    } else if (lowerMessage.includes('stat') || lowerMessage.includes('summary') || lowerMessage.includes('platform')) {
      reply = 'Platform activity looks healthy overall: engagement is steady, completion is improving, and learning journeys are distributed across key roles. Focus on approval flow, course adoption, and learner completion to identify the next optimization opportunities.';
    }

    return {
      success: true,
      reply,
      role,
      course: course ? { _id: course._id, title: course.title, category: course.category } : null,
      suggestions: role === 'Trainer'
        ? ['Draft 5 MCQ questions', 'Create Lesson Outline', 'Summarize reading material']
        : role === 'Admin'
          ? ['Show platform stats', 'List pending approvals', 'Summarize user activity']
          : ['Summarize Chapter 1', 'Generate Quiz Practice', 'Explain key concepts'],
      fallbackMode: true,
    };
  }

  if (path.startsWith('/competency/match/')) {
    const courseId = path.split('/')[3];
    const course = DEMO_COURSES.find((item) => item._id === courseId) || DEMO_COURSES[0];
    return {
      success: true,
      courseId: course._id,
      matches: [{
        rank: 1,
        trainerId: 'demo-trainer',
        trainerName: 'Priya Nair',
        status: 'Approved',
        profile: {
          designation: 'Senior Learning Specialist',
          department: 'Human Resources',
          bio: 'L&D professional with 8 years of experience in leadership and soft-skills training.',
        },
        score: 96,
        skills: ['Leadership Development', 'Communication', 'Team Building', 'Conflict Resolution'],
        competencies: ['Soft Skills', 'Management', 'HR Practices'],
      }],
      course,
    };
  }

  return { success: true };
};

async function request(endpoint, options = {}) {
  if (isDemoRoute()) {
    return getDemoResponse(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('capacity_connect_token')
      ? { Authorization: `Bearer ${localStorage.getItem('capacity_connect_token')}` }
      : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const isDemoAuthFailure = !localStorage.getItem('capacity_connect_token') && isDemoRoute();
      if (isDemoAuthFailure) {
        return getDemoResponse(endpoint, options);
      }
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    const fallbackDemoRoute = !localStorage.getItem('capacity_connect_token') && isDemoRoute();
    if (fallbackDemoRoute) {
      return getDemoResponse(endpoint, options);
    }
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Users (Admin)
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`);
  },

  updateUserStatus: (userId, status) =>
    request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateTrainerProfile: (userId, profile) =>
    request(`/users/${userId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(profile),
    }),

  // Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/courses${query ? `?${query}` : ''}`);
  },

  getCourseById: (courseId) => request(`/courses/${courseId}`),

  createCourse: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  assignCourseTrainer: (courseId, trainer) =>
    request(`/courses/${courseId}/trainer`, {
      method: 'PATCH',
      body: JSON.stringify(trainer),
    }),

  deleteCourse: (courseId) =>
    request(`/courses/${courseId}`, {
      method: 'DELETE',
    }),

  // Assessments
  getAssessments: (courseId) => {
    const query = courseId ? `?courseId=${courseId}` : '';
    return request(`/assessments${query}`);
  },

  getCourseAssessments: (courseId) => request(`/assessments/course/${courseId}`),

  createAssessment: (assessmentData) =>
    request('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    }),

  submitAssessment: (assessmentId, userId, answers) =>
    request('/assessments/submit', {
      method: 'POST',
      body: JSON.stringify({ assessmentId, userId, answers }),
    }),

  // Library Resources
  getLibrary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/library${query ? `?${query}` : ''}`);
  },

  addLibraryResource: (resourceData) =>
    request('/library', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    }),

  // Competency Mapping
  getCompetencyMatches: (courseId) => request(`/competency/match/${courseId}`),

  // Announcements
  getAnnouncements: (type) => {
    const query = type ? `?type=${type}` : '';
    return request(`/announcements${query}`);
  },

  createAnnouncement: (announcement) =>
    request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    }),

  deleteAnnouncement: (announcementId) =>
    request(`/announcements/${announcementId}`, { method: 'DELETE' }),

  // Statistics
  getTraineeAnalytics: (userId) => request(`/analytics/trainee/${userId}`),
  getTrainerAnalytics: (trainerId) => request(`/analytics/trainer/${trainerId}`),

  // Feedback
  getFeedback: () => request('/feedback'),
  submitFeedback: (feedback) => request('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedback),
  }),

  // AI assistant
  sendAIChat: ({ userRole, courseId, message }) =>
    request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ userRole, courseId, message }),
    }),

  // Course enrollment
  getEnrollments: (userId) => request(`/enrollments/${userId}`),
  enrollInCourse: (userId, courseId) => request('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ userId, courseId }),
  }),
  optOutOfCourse: (userId, courseId) => request(`/enrollments/${userId}/${courseId}`, {
    method: 'DELETE',
  }),
};
