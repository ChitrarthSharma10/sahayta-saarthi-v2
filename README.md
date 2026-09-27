# Capacity Connect

Capacity Connect is a role-based Learning Management System (LMS) designed for administrators, trainers, and corporate trainees. It provides a centralized platform for organizational learning, combining approval-based onboarding, course management, learning resources, assessments, competency-aware trainer allocation, analytics, and feedback workflows.

The platform follows the complete training lifecycle:

**Register → Approve → Learn → Assess → Analyse → Improve**

---

## 🌐 Live Demo

**Frontend:** https://sahayta-saarthi-v2.vercel.app/

**Backend:** https://sahayta-saarthi-v2.onrender.com/

**Repository:** https://github.com/ChitrarthSharma10/sahayta-saarthi-v2

---

## ✨ Key Highlights

- Role-based platform for **Admin, Trainer, and Trainee**
- Approval-gated user onboarding
- Course creation and management
- Competency-aware trainer matching
- Interactive MCQ assessments with server-side scoring
- Centralized learning resource library
- Course enrollment and progress tracking
- Learning analytics and performance visualization
- Platform-wide announcements
- Feedback and rating workflows
- Responsive glassmorphic interface
- Interactive 3D WebGL visual elements
- MongoDB-backed persistent data storage

---

# 🏗️ Architecture & Tech Stack

## Frontend

- **React 19.2.8**
- **Vite 8.3.0**
- **Tailwind CSS 3.4.19**
- **Framer Motion 13.4.4**
- **Three.js 0.186.1**
- **@react-three/fiber 9.8.1**
- **@shadergradient/react 2.4.20**
- **Recharts 3.10.1**
- **Lucide React 1.47.0**
- **Zustand 5.0.15**
- **clsx**
- **tailwind-merge**

### Frontend capabilities

- Responsive role-based dashboards
- Interactive 3D WebGL visual elements
- Animated UI and micro-interactions
- Data visualization and performance charts
- Course browsing and enrollment
- Assessment interface
- Learning progress tracking
- Notifications and toast feedback
- Trainer and trainee profile management

---

## Backend

- **Node.js 18+**
- **Express.js 4.18.2**
- **MongoDB Atlas**
- **Mongoose 8.5.0**
- **bcryptjs 2.4.3**
- **dotenv 16.4.5**
- **CORS 2.8.5**
- **UUID 9.0.0**
- **Nodemon 3.0.2** for development

### Backend capabilities

- REST API architecture
- MongoDB-backed persistent storage
- User authentication and onboarding
- Role-based platform workflows
- Course management
- Enrollment management
- Assessment creation and submission
- Learning resource management
- Competency-based trainer matching
- Announcements
- Feedback collection
- Analytics
- Database seeding for initial setup
- Health monitoring endpoint

---

# 🔐 Authentication & Security

Capacity Connect uses an approval-based authentication workflow.

The backend implements:

- Password hashing using `bcryptjs`
- HMAC-SHA256 signed bearer tokens
- 8-hour token expiration
- Account status validation
- Role information in authenticated session context
- Server-side assessment scoring
- Password removal from API responses

### Token Flow

```text
Login
  ↓
Credential Verification
  ↓
Password Validation
  ↓
Account Status Check
  ↓
HMAC-SHA256 Signed Token
  ↓
Authenticated Platform Access
```

### Registration Flow

New Trainer and Trainee accounts are created with a `Pending` status.

```text
Register
   ↓
Account Created
   ↓
Pending
   ↓
Admin Review
   ↓
Approve / Reject
   ↓
Approved User → Login
```

Trainer registration additionally requires at least one qualification or certification entry.

---

# 👥 Role-Based Platform

## 👨‍💼 Admin

Administrators manage the overall learning ecosystem.

### Admin capabilities

- Platform overview and statistics
- User management
- Pending user approvals
- Trainer qualification review
- Course creation and management
- Course deletion
- Trainer allocation
- Competency-based trainer matching
- Platform announcements
- Feedback review
- Platform analytics

### Competency-Aware Trainer Matching

Courses specify required skills and competencies.

The platform compares course requirements against the skills and competencies of approved trainers and generates compatibility information to support trainer allocation.

The current implementation uses **rule-based skill and competency overlap**, rather than machine-learning prediction.

---

## 👨‍🏫 Trainer

Trainers manage learning content, courses, resources, and assessments.

### Trainer capabilities

- View assigned courses
- Manage trainer profile
- Add skills and competencies
- Manage qualifications and certifications
- Create MCQ assessments
- Define passing scores
- Add learning resources
- Manage course materials
- Review learner feedback
- Monitor course performance

### Assessment Builder

Trainers can create multi-question MCQ assessments containing:

- Questions
- Multiple answer choices
- Correct answers
- Passing score
- Course association

Correct answers are handled server-side when assessments are evaluated.

---

## 👨‍🎓 Trainee

Trainees use the platform for learning, assessments, and progress tracking.

### Trainee capabilities

- Browse available courses
- Enroll in courses
- View enrolled courses
- Access learning resources
- Attempt assessments
- Receive assessment scores
- Track learning progress
- View performance analytics
- Track learning activity
- Track learning streaks
- Submit feedback

### Learning Experience

The trainee experience provides:

- Course progress indicators
- Upcoming assessments
- Learning schedules
- Performance charts
- Course resources
- Assessment access
- Learning activity tracking
- Feedback submission

---

# 📚 Learning & Assessment Workflow

Capacity Connect brings the complete organizational learning process into a centralized workflow.

```text
Register
   ↓
Admin Approval
   ↓
Course Discovery
   ↓
Course Enrollment
   ↓
Learning Resources
   ↓
Assessment
   ↓
Server-Side Scoring
   ↓
Performance Analysis
   ↓
Feedback & Improvement
```

### Course Management

Courses can contain:

- Course information
- Category
- Difficulty level
- Duration
- Required skills
- Assigned trainer
- Learning resources
- Assessments

### Resource Library

Trainers can add learning resources such as:

- Slides
- Videos
- PDFs
- External learning links

Resources can be associated with specific courses for easier access by trainees.

---

# 📊 Analytics & Performance

The platform provides learning and performance visibility through dashboards and data visualization.

### Trainee analytics

- Course progress
- Assessment scores
- Performance trends
- Learning activity
- Study trends
- Learning streaks

### Admin and trainer visibility

- Platform-level statistics
- Course-related performance
- Assessment performance
- User statistics
- Feedback information
- Learning activity insights

Charts and visualizations are implemented using **Recharts**.

---

# 📢 Announcements & Feedback

## Announcements

Administrators can publish platform announcements for users.

Announcements can be used to communicate:

- Platform updates
- Learning opportunities
- Course availability
- Important notices

Users can access announcements through the platform notification interface.

## Feedback

The platform provides feedback workflows where users can submit ratings and comments.

Feedback can be reviewed by administrators and used to understand learner experience and training effectiveness.

---

# 🧠 Competency-Aware Trainer Allocation

One of the core differentiating features of Capacity Connect is competency-aware trainer allocation.

### Workflow

```text
Course
  ↓
Required Skills & Competencies
  ↓
Approved Trainer Profiles
  ↓
Skill / Competency Overlap
  ↓
Compatibility Information
  ↓
Trainer Allocation
```

The system evaluates the relationship between:

- Course-required skills
- Trainer skills
- Trainer competencies
- Approved trainer status

The current implementation is **rule-based** and does not use machine-learning prediction.

---

# 🏗️ Project Structure

```text
sahayta-saarthi-v2/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── db.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── Announcement.js
│   │   │   ├── Assessment.js
│   │   │   ├── AssessmentSubmission.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   ├── Feedback.js
│   │   │   ├── LibraryItem.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── analytics.js
│   │   │   ├── announcements.js
│   │   │   ├── assessments.js
│   │   │   ├── auth.js
│   │   │   ├── competency.js
│   │   │   ├── courses.js
│   │   │   ├── enrollments.js
│   │   │   ├── feedback.js
│   │   │   ├── library.js
│   │   │   └── users.js
│   │   │
│   │   └── seed/
│   │       └── seedData.js
│   │
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── trainee/
│   │   │   ├── trainer/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── utils.js
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── TraineeDashboard.jsx
│   │   │   └── TrainerDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── activityTracker.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- **Node.js 18 or later**
- **npm 9 or later**
- **MongoDB Atlas account** or a compatible MongoDB instance
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ChitrarthSharma10/sahayta-saarthi-v2.git
cd sahayta-saarthi-v2
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# ⚙️ Environment Configuration

## Backend

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/capacity_connect?retryWrites=true&w=majority
AUTH_SECRET=your-secure-secret
```

### Environment variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Secret used for signing authentication tokens |

---

## Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

For the deployed frontend, configure `VITE_API_URL` to point to the deployed backend API.

---

# ▶️ Running Locally

## Start the Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

---

## Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the displayed Vite URL in your browser.

---

# 🌱 Database Seeding

The backend contains an initial database seeding system.

When the database is empty, the application can populate it with demonstration data including:

- Admin account
- Trainer accounts
- Trainee accounts
- Courses
- Enrollments
- Assessments
- Learning resources
- Announcements

Passwords for seeded accounts are stored using bcrypt hashing.

---

# 🔑 Demo Credentials

The following accounts are included in the seeded demonstration data.

| Role | Email | Password | Status |
|---|---|---|---|
| **Admin** | `admin@capacityconnect.in` | `admin@123` | Approved |
| **Trainer** | `priya.nair@capacityconnect.in` | `trainer@123` | Approved |
| **Trainer** | `rahul.desai@capacityconnect.in` | `trainer@123` | Approved |
| **Trainee** | `ananya.sharma@example.com` | `trainee@123` | Approved |
| **Trainee** | `karan.verma@example.com` | `trainee@123` | Approved |
| **Trainee** | `sneha.pillai@example.com` | `trainee@123` | Pending |
| **Trainee** | `mohit.joshi@example.com` | `trainee@123` | Pending |
| **Trainee** | `divya.rao@example.com` | `trainee@123` | Pending |

> These are development/demo credentials generated by the database seeding system. They should not be used as production credentials.

---

# 🔌 REST API

The backend exposes RESTful endpoints under:

```text
/api
```

## Authentication

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | `POST` | Authenticate a user |
| `/api/auth/register` | `POST` | Register a Trainer or Trainee |

## Users

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | `GET` | Retrieve users with optional filters |
| `/api/users/:id/status` | `PATCH` | Update user approval status |
| `/api/users/:id/profile` | `PATCH` | Update trainer profile information |

## Courses

| Endpoint | Method | Description |
|---|---|---|
| `/api/courses` | `GET` | Retrieve courses |
| `/api/courses` | `POST` | Create a course |
| `/api/courses/:id` | `GET` | Retrieve a specific course |
| `/api/courses/:id` | `PATCH` | Update course trainer assignment |
| `/api/courses/:id` | `DELETE` | Delete a course |

## Assessments

| Endpoint | Method | Description |
|---|---|---|
| `/api/assessments` | `GET` | Retrieve assessments |
| `/api/assessments` | `POST` | Create an assessment |
| `/api/assessments/course/:courseId` | `GET` | Retrieve assessments for a course |
| `/api/assessments/submit` | `POST` | Submit an assessment and calculate the score |

## Other Services

| Endpoint | Purpose |
|---|---|
| `/api/enrollments` | Course enrollment management |
| `/api/library` | Learning resource management |
| `/api/competency` | Trainer competency matching |
| `/api/announcements` | Platform announcements |
| `/api/analytics` | Learning and platform analytics |
| `/api/feedback` | Feedback and ratings |
| `/api/health` | Backend health check |

---

# 🗄️ Database

Capacity Connect uses **MongoDB** for persistent storage with **Mongoose** as the ODM layer.

The backend organizes platform data into collections/models for:

- Users
- Courses
- Enrollments
- Assessments
- Assessment submissions
- Learning resources
- Announcements
- Feedback

---

# ☁️ Deployment

The project is deployed using a separate frontend and backend architecture.

### Frontend

**Vercel**

https://sahayta-saarthi-v2.vercel.app/

### Backend

**Render:** https://sahayta-saarthi-v2.onrender.com/

The frontend communicates with the deployed backend through the configured `VITE_API_URL` environment variable.

---

# 🩺 Backend Health Check

The backend provides a health endpoint:

```text
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "Capacity Connect API"
}
```

---

# 🔄 MongoDB Connection

The backend includes a periodic MongoDB heartbeat.

A database ping is performed every five minutes while the MongoDB connection is active.

This helps maintain an active database connection in the deployed environment.

---

# 🏆 Problem Statement Alignment

Capacity Connect was developed for **Smart India Hackathon 2026**.

### Problem Statement

**Problem Statement ID:** 26075

**Problem Statement Title:**

> **CAPACITY CONNECT: A Digital Capacity Building and Learning Management Portal to support organizational training, competency development, and knowledge sharing through a centralized web-based platform.**

### Core problem areas addressed

- Scattered learning resources
- Difficulty tracking skill development
- Inefficient trainer-trainee coordination
- Limited visibility into training performance
- Unidentified competency gaps
- Approval and onboarding management

### Proposed workflow

```text
User Registration
       ↓
Administrative Approval
       ↓
Course Discovery
       ↓
Trainer Allocation
       ↓
Learning Resources
       ↓
Assessment
       ↓
Performance Analysis
       ↓
Feedback
       ↓
Continuous Improvement
```

---

# 💡 Key Differentiator

## Competency-Aware Trainer Matching

Instead of treating trainer allocation as a simple manual assignment, Capacity Connect associates courses with required skills and competencies.

The system compares those requirements against approved trainer profiles to generate compatibility information.

```text
Course Requirements
        +
Trainer Skills
        +
Trainer Competencies
        ↓
Rule-Based Compatibility
        ↓
Trainer Allocation
```

This provides a structured approach to connecting organizational learning requirements with available trainer expertise.

---

# 🔮 Future Scope

The current implementation focuses on the core organizational learning workflow.

Potential future improvements include:

- AI-powered learning assistance
- AI-based learning recommendations
- Machine-learning-based competency analysis
- More advanced trainer recommendation models
- Personalized learning paths
- Automated competency-gap identification
- Advanced organizational reporting
- Deeper integration with enterprise HR and learning systems
- Expanded notification and communication workflows

> AI-powered assistance and machine-learning-based competency analysis are future improvements and are **not presented as currently implemented features**.

---

# 📈 Scalability & Extensibility

The project follows a modular frontend-backend architecture.

### Frontend

React-based components and role-specific pages allow additional learning workflows and dashboard features to be added independently.

### Backend

Express routes are separated by domain, including:

- Authentication
- Users
- Courses
- Assessments
- Enrollments
- Library
- Competency
- Analytics
- Announcements
- Feedback

### Database

MongoDB provides a flexible data model that can be extended as additional organizational learning entities and relationships are introduced.

---

# 🛠️ Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

# 📋 Project Status

**Project:** Capacity Connect

**Hackathon:** Smart India Hackathon 2026

**Problem Statement ID:** 26075

**Category:** Software

**Theme:** Smart Education

**Team:** Sahayata Saarthi

The current version implements the core role-based learning management workflow including onboarding, approvals, course management, trainer competency matching, learning resources, assessments, analytics, announcements, and feedback.

---

# 👨‍💻 Team

**Team Name:** Sahayata Saarthi

**Project:** Capacity Connect

Developed for **Smart India Hackathon 2026**.

---

## 📄 License

No separate open-source license is currently specified for this project.
