# Capacity Connect – Backend API

Express.js REST API server for the Capacity Connect LMS platform, powered by MongoDB Atlas with Mongoose ODM and automated keep-alive connection management.

## Getting Started

```bash
cd backend
npm install
npm run dev        # development (nodemon auto-reload)
# or
npm start          # production
```

Server listens on **http://localhost:5000**.

---

## Environment Variables

Create a `backend/.env` file with:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/capacity_connect?retryWrites=true&w=majority
```

> **Automated Heartbeat:** The backend includes a 5-minute automated MongoDB keep-alive ping (`mongoose.connection.db.admin().ping()`) in `src/server.js` to keep Atlas clusters active.

---

## Project Structure

```
backend/
├── src/
│   ├── app.js               # Express app factory (middleware + routes)
│   ├── server.js            # Entry point – binds port, handles MongoDB connection & 5-min ping
│   ├── db.js                # MongoDB data access layer & Mongoose model helpers
│   ├── middleware/
│   │   └── auth.js          # Authentication & token verification middleware
│   ├── models/              # Mongoose schemas
│   │   ├── Announcement.js
│   │   ├── Assessment.js
│   │   ├── AssessmentSubmission.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Feedback.js
│   │   ├── LibraryItem.js
│   │   └── User.js
│   ├── routes/              # Express API routers
│   │   ├── analytics.js     # User performance & platform analytics
│   │   ├── announcements.js # Broadcasts
│   │   ├── assessments.js   # Quizzes and submissions
│   │   ├── auth.js          # Login and registration with bcryptjs
│   │   ├── competency.js    # Trainer-course skill matching
│   │   ├── courses.js       # Course management
│   │   ├── enrollments.js   # Course enrollment & opt-out
│   │   ├── feedback.js      # User ratings & feedback inbox
│   │   ├── library.js       # Resource uploads & catalog
│   │   └── users.js         # User directory & approval status patch
│   └── seed/
│       └── seedData.js      # First-run auto-seeding
└── package.json
```

---

## Seeded Data

| Type | Count | Details |
|:---|:---|:---|
| **Admin** | 1 | `admin@capacityconnect.in` / `admin@123` |
| **Trainer** | 2 | `priya.nair@…` / `rahul.desai@…` — both Approved |
| **Trainee** | 5 | 2 Approved, 3 Pending |
| **Courses** | 5 | Across Soft Skills, Cloud, Agile, HR, Management |
| **Assessments** | 2 | Cloud Fundamentals, Agile Practitioner (5 Qs each) |
| **Library** | 3 | Slides (Google Slides), Video (YouTube), PDF |
| **Announcements** | 3 | Platform Launch, Milestone, New Courses |

---

## REST API Reference

### Auth

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/api/auth/login` | Authenticate user & return profile session |
| `POST` | `/api/auth/register` | Register new Trainee or Trainer (status → Pending) |

---

### Users (Admin)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/users` | List all users with optional `?status=Pending&role=Trainer` |
| `PATCH` | `/api/users/:id/status` | Approve or reject user registration (`Approved` / `Rejected`) |

---

### Courses

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/courses` | List courses with trainer details |
| `POST` | `/api/courses` | Create a new course (Admin) |
| `DELETE` | `/api/courses/:id` | Delete course from catalog (Admin) |

---

### Enrollments

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/enrollments/:userId` | Get user's enrolled course IDs |
| `POST` | `/api/enrollments` | Enroll user in a course |
| `DELETE` | `/api/enrollments/:userId/:courseId` | Drop/opt-out of a course |

---

### Assessments

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/assessments` | Get all assessments |
| `GET` | `/api/assessments/course/:courseId` | Fetch assessment for a course |
| `POST` | `/api/assessments` | Create assessment with MCQ questions |
| `POST` | `/api/assessments/submit` | Submit answers, calculate score & per-question feedback |

---

### Library (Resources)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/library` | All resources with optional `?type=video&courseId=<id>` |
| `POST` | `/api/library` | Add new learning resource (slides, video, PDF) |
| `DELETE` | `/api/library/:id` | Remove a resource |

---

### Competency Mapping

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/competency/match/:courseId` | Calculate matching trainers based on skill overlap |

---

### Announcements & Feedback

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/announcements` | Retrieve active announcements |
| `POST` | `/api/announcements` | Publish a new announcement |
| `DELETE` | `/api/announcements/:id` | Remove an announcement |
| `GET` | `/api/feedback` | Retrieve submitted feedback entries |
| `POST` | `/api/feedback` | Submit feedback review with star rating |

---

### Health Check

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Server liveness check |
