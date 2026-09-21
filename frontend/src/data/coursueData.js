/**
 * Coursue Dashboard Data Store
 * Structured data matching the reference screenshot exactly.
 */

export const COURSUE_FRIENDS = [
  {
    id: 'f1',
    name: 'Bagas Mahpie',
    relation: 'Friend',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'f2',
    name: 'Sir Dandy',
    relation: 'Old Friend',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'f3',
    name: 'Jhon Tosan',
    relation: 'Friend',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80',
  },
];

export const COURSE_PROGRESS_METRICS = [
  {
    id: 'cp1',
    title: 'UI/UX Design',
    watched: '2/8 watched',
    iconType: 'design',
    badgeColor: 'lavender',
  },
  {
    id: 'cp2',
    title: 'Branding',
    watched: '3/8 watched',
    iconType: 'branding',
    badgeColor: 'pink',
  },
  {
    id: 'cp3',
    title: 'Front End',
    watched: '6/12 watched',
    iconType: 'frontend',
    badgeColor: 'cyan',
  },
];

export const CONTINUE_WATCHING_COURSES = [
  {
    id: 'cw1',
    category: 'FRONT END',
    categoryType: 'cyan',
    title: "Beginner's Guide to Becoming a Professional Front-End Developer",
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    progressPercent: 55,
    mentor: {
      name: 'Leonardo Samsul',
      role: 'Mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    isFavorite: true,
  },
  {
    id: 'cw2',
    category: 'UI/UX DESIGN',
    categoryType: 'lavender',
    title: 'Optimizing User Experience with the Best UI/UX Design',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    progressPercent: 40,
    mentor: {
      name: 'Bayu Salto',
      role: 'Mentor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    isFavorite: false,
  },
  {
    id: 'cw3',
    category: 'BRANDING',
    categoryType: 'pink',
    title: 'Reviving and Refreshing Your Company Image',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    progressPercent: 25,
    mentor: {
      name: 'Padhang Satrio',
      role: 'Mentor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    isFavorite: false,
  },
  {
    id: 'cw4',
    category: 'FRONT END',
    categoryType: 'cyan',
    title: 'Modern React & Component Architecture in Production',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    progressPercent: 70,
    mentor: {
      name: 'Zakir Horizontal',
      role: 'Mentor',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    },
    isFavorite: true,
  },
];

export const YOUR_LESSONS = [
  {
    id: 'yl1',
    mentorName: 'Padhang Satrio',
    date: '2/16/2004',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    type: 'UI/UX DESIGN',
    typeColor: 'lavender',
    description: 'Understand Of UI/UX Design',
  },
  {
    id: 'yl2',
    mentorName: 'Leonardo Samsul',
    date: '3/10/2004',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    type: 'FRONT END',
    typeColor: 'cyan',
    description: 'Responsive Layouts with CSS Grid & Flexbox',
  },
  {
    id: 'yl3',
    mentorName: 'Bayu Salto',
    date: '3/22/2004',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    type: 'BRANDING',
    typeColor: 'pink',
    description: 'Color Psychology in Product Marketing',
  },
];

export const MENTORS_LIST = [
  {
    id: 'm1',
    name: 'Padhang Satrio',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    isFollowing: false,
  },
  {
    id: 'm2',
    name: 'Zakir Horizontal',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    isFollowing: true,
  },
  {
    id: 'm3',
    name: 'Leonardo Samsul',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    isFollowing: false,
  },
];
