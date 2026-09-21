/**
 * API Client for Capacity Connect backend
 * Connects to http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
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

  // Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/courses${query ? `?${query}` : ''}`);
  },

  getCourseById: (courseId) => request(`/courses/${courseId}`),

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
};
