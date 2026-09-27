# Capacity Connect

Capacity Connect is an enterprise-grade, role-based Learning Management System (LMS) designed for administrators, trainers, and corporate trainees. Built with a modern dark glassmorphic design system powered by 3D WebGL ShaderGradients and Framer Motion, it features a complete Express & MongoDB Atlas backend providing real-time user lifecycle approvals, course authoring, interactive MCQ assessments, content repositories, competency mapping, and analytics.

---

## Architecture & Tech Stack

### Frontend
- **Framework & Runtime:** [React 19](https://react.dev/) (`react` ^19.2.8, `react-dom` ^19.2.8) + [Vite 8](https://vitejs.dev/) (`vite` ^8.3.0)
- **Styling & Design System:** [Tailwind CSS](https://tailwindcss.com/) (^3.4.19), PostCSS, Autoprefixer
- **Visuals & 3D Graphics:**
  - [@shadergradient/react](https://www.shadergradient.co/) (^2.4.20) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) (^9.8.1) + [Three.js](https://threejs.org/) (^0.186.1)
  - Interactive 3D WebGL sphere and mesh gradients
- **Motion & Micro-interactions:**
  - [Framer Motion](https://www.framer.com/motion/) (^13.4.4) for physics-based 3D card tilt and hover effects
- **Charts & Data Visualization:** [Recharts](https://recharts.org/) (^3.10.1) for performance and study time trends
- **Icons:** [Lucide React](https://lucide.dev/) (^1.47.0)
- **State & Utilities:** [Zustand](https://zustand-demo.pmnd.rs/) (^5.0.15), `clsx` (^2.1.1), `tailwind-merge` (^3.7.0)

### Backend
- **Runtime & Web Framework:** [Node.js](https://nodejs.org/) (>= 18) + [Express.js](https://expressjs.com/) (^4.18.2)
- **Database & ODM:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/) (^8.5.0)
- **Security & Authentication:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (^2.4.3) with salt rounds password hashing
- **Reliability:** Automated **5-minute keep-alive heartbeat ping** to prevent MongoDB Atlas cluster idle disconnects
- **Seeding:** Automated first-run database population (`seedData.js`)
- **CORS & Environment:** `cors` (^2.8.5), `dotenv` (^16.4.5), `uuid` (^9.0.0)
- **Developer Tooling:** `nodemon` (^3.0.2)

---

## Available Features (Role-by-Role)

### 1. Authentication & Onboarding
- **Interactive 3D Sign-In Experience:** Interactive tilt card with dynamic edge glare and cursor-following depth physics powered by Framer Motion.
- **Dual Mode Auth:** Instant toggle between Sign In and Registration.
- **Role-Based Registration:**
  - **Trainees:** Name, email, password, designation, department.
  - **Trainers:** Professional credentials, skills tags, and external certificate verification URLs.
- **Admin Approval Gate:** New registrations default to `Pending` status and must be approved by an Admin before full platform access is granted.
- **Session Management:** Secure token and user profile persistence in browser storage with instant role synchronization.

### 2. Administrator Portal
- **Platform Overview:** High-level platform counters (Total Users, Pending Approvals, Approved Users, Active Courses), quick user approval shortcut table, system announcements snapshot, and platform health indicators.
- **User Approvals Management:**
  - Filter users by status (`All`, `Pending`, `Approved`, `Rejected`) and role (`Trainer`, `Trainee`).
  - Inspect trainer certification documents and qualifications prior to approval.
  - One-click instant **Approve** and **Reject** actions with immediate database status updates.
- **Course Management:**
  - Full course catalog oversight with category badges.
  - Course Creation Modal (title, description, category, level, duration, thumbnail URL, and required skill tags).
  - Course deletion with cascade cleanup.
- **Competency Mapping Engine:**
  - Algorithmic trainer matching: Analyzes course skill requirements against approved trainer skill sets and experience.
  - Compatibility percentage score breakdown.
  - Direct one-click trainer assignment to courses.
- **Announcements Broadcast:**
  - Publish platform-wide or targeted announcements (All, Trainers, Trainees) with priority levels (`info`, `warning`, `success`).
  - Live announcement dispatch through an active UI event bus.
  - Delete or revoke published notices.
- **Feedback Inbox:**
  - Review ratings (1 to 5 stars), category breakdown, and detailed reviews submitted by trainees and trainers.
  - Polling synchronization for real-time review monitoring.

### 3. Trainer Portal
- **Trainer Studio:**
  - Executive KPI summary: Student Engagement, Course Submissions, Avg Passing Rate (91.4%), and Published Resources.
  - Quick action buttons to open the Questionnaire Builder and Content Uploader.
- **Course Workspace:**
  - Overview of assigned corporate tracks.
  - Dedicated course drill-down viewing associated questionnaires and curriculum resources.
- **Questionnaire Builder Modal:**
  - Author custom multi-question MCQ assessments tied to any specific course.
  - Define custom questions, four distinct choices, correct answer designation, and passing threshold.
  - Live publishing directly to the assessment datastore.
- **Content Library Manager:**
  - Resource filtering by format (All, Slides, Videos, PDFs).
  - Modal uploader supporting Google Slides, YouTube, PDF documents, and external training links.
  - Delete resource items with instant collection synchronization.
- **Trainer Profile & Qualifications:**
  - Manage trainer bio, expertise areas, competencies, years of experience, and credentials.
- **Feedback Panel:**
  - Submit trainer-side evaluations and review learner feedback.

### 4. Trainee Portal
- **Learner Dashboard:**
  - Hero banner with quick enrollment trigger and streak celebration.
  - Progress summary cards detailing course completion and upcoming milestones.
  - **Continue Watching** carousel with smooth horizontal scrolling and favorite bookmarking.
  - Interactive syllabus lessons schedule table with lesson launch modals.
- **Course Catalog & Enrollment:**
  - **My Courses:** Enrolled tracks with progress indicators, due dates, and syllabus links.
  - **All Courses:** Searchable catalog across Soft Skills, Technology, Cloud, HR, and Management.
  - One-click **Enroll** and **Opt-out** with instant enrollment state management.
- **Course Detail View:** Comprehensive view including syllabus modules, trainer credentials, attached media files, and linked assessments.
- **Quizzes & Tests Runner:**
  - Interactive MCQ assessment modal with countdown timer and progress indicators.
  - Automated grading logic, passing score evaluation, and immediate per-question review feedback.
- **Resource Library:** Direct access to lecture slides, curated video materials, and downloadable documentation.
- **Analytics & Streaks:**
  - Performance line chart (powered by Recharts) showing weekly study trends and score distribution.
  - Learning streak tracker and calendar.
- **Trainee Settings & Preferences:** Profile view, notification settings, and study preferences.
- **Feedback Submission:** Trainee rating submission form (star rating + feedback category + comments).

### 5. Platform-Wide Features
- **Global Announcements Header:** Persistent top bar bell icon with an unread badge and dropdown menu of system announcements.
- **Global Toast Notification System:** Non-intrusive feedback toasts for all user actions (creations, deletions, status changes, enrollments).
- **Responsive Dark Mode UI:** Dark glassmorphic panels, glowing borders, and high-performance WebGL backdrops.

---

## Project Structure

```text
sahayta-saarthi-v2/
├── backend/
│   ├── src/
│   │   ├── app.js                       # Express app configuration & middleware pipeline
│   │   ├── server.js                    # HTTP listener, MongoDB connection & 5-min keep-alive ping
│   │   ├── db.js                        # Data access layer & Mongoose collection wrappers
│   │   ├── middleware/
│   │   │   └── auth.js                  # Authentication & request context middleware
│   │   ├── models/                      # Mongoose data schemas
│   │   │   ├── Announcement.js          # System announcements schema
│   │   │   ├── Assessment.js            # MCQ quiz & assessment schema
│   │   │   ├── AssessmentSubmission.js  # Trainee quiz submissions & scores
│   │   │   ├── Course.js                # Courses, curriculum & skill requirements
│   │   │   ├── Enrollment.js            # User course enrollment mapping
│   │   │   ├── Feedback.js              # Star ratings & user reviews
│   │   │   ├── LibraryItem.js           # Learning resources (slides, videos, PDFs)
│   │   │   └── User.js                  # User profiles, roles, approval statuses, & credentials
│   │   ├── routes/                      # REST API endpoints
│   │   │   ├── analytics.js             # Trainee & trainer aggregated statistics
│   │   │   ├── announcements.js         # Announcement publication & deletion
│   │   │   ├── assessments.js           # Quiz creation, retrieval & submission
│   │   │   ├── auth.js                  # User login, registration & profile retrieval
│   │   │   ├── competency.js            # Skill-matching & trainer recommendation
│   │   │   ├── courses.js               # Course catalog CRUD
│   │   │   ├── enrollments.js           # Course enrollment & opt-out
│   │   │   ├── feedback.js              # Feedback collection & admin inbox
│   │   │   ├── library.js               # Resource library uploads & queries
│   │   │   └── users.js                 # Admin user directory & approval status patch
│   │   └── seed/
│   │       └── seedData.js              # Automated database seeder for initial run
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/                          # Static assets and icons
│   ├── src/
│   │   ├── assets/                      # SVGs, artwork, logos & illustrations
│   │   ├── components/
│   │   │   ├── common/                  # Shared components (FeedbackPanel, Toast system)
│   │   │   ├── coursue/                 # Trainee dashboard widgets (HeroBanner, Carousel, Charts, Tables)
│   │   │   ├── layout/                  # Main navigation (Sidebar, TopBar with notifications)
│   │   │   ├── trainee/                 # AssessmentModal, StreaksCalendar, Settings
│   │   │   ├── trainer/                 # QuestionnaireBuilderModal, LibraryUploaderModal, Profile
│   │   │   └── ui/                      # 3D Tilt Card (sign-in-card-2.jsx)
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # User auth state, login, register, and storage sync
│   │   ├── data/
│   │   │   └── coursueData.js           # Static UI reference metadata & mock activity
│   │   ├── lib/
│   │   │   └── utils.js                 # Tailwind class utility (cn helper)
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx       # Admin approval, course, competency & announcement portal
│   │   │   ├── CoursueDashboard.jsx     # Trainee learning portal & course player
│   │   │   ├── LoginPage.jsx            # 3D tilt sign-in & role registration page
│   │   │   ├── TraineeDashboard.jsx     # Alternate trainee overview view
│   │   │   └── TrainerDashboard.jsx     # Trainer studio, quiz authoring & library portal
│   │   ├── services/
│   │   │   └── api.js                   # Client HTTP API connector with fallback data
│   │   ├── utils/
│   │   │   └── activityTracker.js       # User interaction & streak tracker
│   │   ├── App.jsx                      # Main app shell & role-based route gate
│   │   ├── index.css                    # Tailwind directives & glassmorphic styling
│   │   └── main.jsx                     # Vite React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **MongoDB**: A MongoDB Atlas connection string or local MongoDB instance

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sahayta-saarthi-v2
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

### Environment Configuration

#### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/capacity_connect?retryWrites=true&w=majority
```

> **Note on MongoDB Keep-Alive:** The backend includes a built-in 5-minute automated database ping (`mongoose.connection.db.admin().ping()`) in `src/server.js` to keep MongoDB Atlas free-tier clusters active and prevent connection timeouts.

#### Frontend Configuration (`frontend/.env`)
Create a `.env` file in the `frontend/` directory (optional if running on default port):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Running the Application

1. **Start the Backend API Server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend API will start on **http://localhost:5000** and automatically seed the database if it is empty.

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The Vite client will launch on **http://localhost:5173**.

3. **Open the Application:**
   Navigate to [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Seeded Demo Credentials

The database automatically seeds with demonstration accounts across all three user roles:

| Role | Email | Password | Status | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@capacityconnect.in` | `admin@123` | Approved | Full administrative oversight & approvals |
| **Trainer** | `priya.nair@capacityconnect.in` | `trainer@123` | Approved | Course authoring, quizzes, library uploads |
| **Trainer** | `rahul.desai@capacityconnect.in` | `trainer@123` | Approved | Technical track authoring & assessments |
| **Trainee** | `ananya.sharma@example.com` | `trainee@123` | Approved | Course enrollment, quizzes & analytics |
| **Trainee** | `vikram.patel@example.com` | `trainee@123` | Pending | Demonstrates approval queue workflow |

---

## REST API Summary

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns user session |
| `/api/auth/register` | `POST` | Public | Registers a trainee or trainer (defaults to `Pending`) |
| `/api/users` | `GET` | Admin | Lists platform users with optional status & role filters |
| `/api/users/:id/status` | `PATCH` | Admin | Approves or rejects user registration |
| `/api/courses` | `GET`, `POST` | Authenticated | Fetches course catalog or creates a new course |
| `/api/courses/:id` | `DELETE` | Admin | Deletes a course from the catalog |
| `/api/enrollments` | `POST` | Trainee | Enrolls trainee into a selected course |
| `/api/enrollments/:userId/:courseId` | `DELETE` | Trainee | Opts trainee out of an enrolled course |
| `/api/assessments` | `GET`, `POST` | Authenticated | Lists assessments or authors a new MCQ questionnaire |
| `/api/assessments/submit` | `POST` | Trainee | Submits quiz responses and computes score & results |
| `/api/library` | `GET`, `POST` | Authenticated | Lists resources or uploads a new slide/video/PDF |
| `/api/library/:id` | `DELETE` | Trainer/Admin| Removes a resource from the library |
| `/api/competency/match/:courseId` | `GET` | Admin | Computes best-match trainers for a given course |
| `/api/announcements` | `GET`, `POST` | Authenticated | Lists or publishes system-wide announcements |
| `/api/announcements/:id` | `DELETE` | Admin | Removes an announcement notice |
| `/api/feedback` | `GET`, `POST` | Authenticated | Submits feedback reviews or views feedback inbox |
| `/api/health` | `GET` | Public | Server health and uptime verification |

---

## Production Build

To compile the frontend for production:
```bash
cd frontend
npm run build
```

To preview the compiled bundle locally:
```bash
cd frontend
npm run preview
```

---

## License

This project is licensed under the MIT License.
