# Capacity Connect – Backend API

Express.js REST API server for the Capacity Connect LMS platform.

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

## Project Structure

```
backend/
├── src/
│   ├── app.js               # Express app factory (middleware + routes)
│   ├── server.js            # Entry point – binds port, graceful shutdown
│   ├── db.js                # In-memory data store + CRUD helpers + seed data
│   └── routes/
│       ├── auth.js          # POST /api/auth/login, /register
│       ├── users.js         # GET /api/users, PATCH /api/users/:id/status
│       ├── courses.js       # GET /api/courses, /api/courses/:id
│       ├── assessments.js   # GET /api/assessments/course/:id, POST /submit
│       ├── library.js       # GET/POST /api/library
│       ├── competency.js    # GET /api/competency/match/:courseId
│       └── announcements.js # GET /api/announcements
└── package.json
```

---

## Seeded Data

| Type     | Count | Details |
|----------|-------|---------|
| Admin    | 1     | `admin@capacityconnect.in` / `admin@123` |
| Trainer  | 2     | `priya.nair@…` / `rahul.desai@…` — both Approved |
| Trainee  | 5     | 2 Approved, 3 Pending |
| Courses  | 5     | Across Soft Skills, Cloud, Agile, HR |
| Assessments | 2  | Cloud Fundamentals, Agile Practitioner (5 Qs each) |
| Library  | 3     | Slides (Google Slides), Video (YouTube), PDF |
| Announcements | 3 | Launch, Achievement, New Courses |

---

## REST API Reference

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Login (Admin / Trainer / Trainee) |
| `POST` | `/api/auth/register` | Register new Trainee or Trainer (status → Pending) |

#### Login Request
```json
{ "email": "admin@capacityconnect.in", "password": "admin@123" }
```

#### Register Request
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "pass@123",
  "role": "Trainee",
  "profile": { "phone": "+91-9999999999", "designation": "Analyst", "department": "Ops" }
}
```

---

### Users (Admin)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | List all users. Optional: `?status=Pending&role=Trainer` |
| `PATCH` | `/api/users/:id/status` | Approve or reject a user |

#### Approve User
```json
{ "status": "Approved" }
```

---

### Courses

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/courses` | All courses (with trainer details). Optional: `?category=Technology&level=Beginner` |
| `GET` | `/api/courses/:id` | Single course with full trainer profile |

---

### Assessments

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/assessments/course/:courseId` | Fetch quiz for a course (correct answers hidden) |
| `POST` | `/api/assessments/submit` | Submit answers, get score + per-question feedback |

#### Submit Answers
```json
{
  "assessmentId": "<uuid>",
  "userId": "<uuid>",
  "answers": {
    "q1": "Amazon EC2",
    "q2": "Automatically scaling resources up or down based on demand",
    "q3": "S3",
    "q4": "The cloud provider",
    "q5": "Azure Virtual Machines"
  }
}
```

---

### Library (Trainer Resources)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/library` | All resources. Optional: `?type=video&courseId=<uuid>` |
| `POST` | `/api/library` | Add a new resource |

#### Add Resource
```json
{
  "title": "New Slides",
  "description": "Week 2 deck",
  "type": "slides",
  "url": "https://docs.google.com/presentation/...",
  "courseId": "<uuid>",
  "courseTitle": "Course Name",
  "uploadedBy": "<trainer-uuid>",
  "uploaderName": "Trainer Name",
  "tags": ["slides", "week2"]
}
```

---

### Competency Matching

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/competency/match/:courseId` | Returns approved trainers matching the course's subject/category, sorted by match score |

---

### Announcements

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/announcements` | Public announcements. Optional: `?type=achievement` |

---

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Server liveness check |

---

## Migrating to MongoDB

The `db.js` helpers (`findAll`, `findById`, `findOne`, `insertOne`, `updateById`, `deleteById`) mirror the Mongoose API. To migrate:

1. Install `mongoose`.
2. Replace each helper in `db.js` with the equivalent Mongoose model call.
3. Move the seed data into a `mongoose/seeds.js` file.
4. All route files remain unchanged.
