# Capacity Connect

Capacity Connect is a role-based learning management portal for administrators, trainers, and trainees. It combines a modern dark glassmorphism UI with a mock backend API to demonstrate course management, user lifecycle workflows, assessments, analytics, and learning resources in one application.

## Overview

This project includes:

- A React + Vite frontend for the learning portal experience
- An Express.js backend with seeded mock data
- Role-based access for Admin, Trainer, and Trainee users
- Course catalog and enrollment workflows
- Assessments and learner progress tracking
- Resource library and trainer uploads
- Announcements and feedback panels
- A dark, polished dashboard design inspired by modern SaaS interfaces

## Features

### Admin Portal
- Dashboard overview with platform metrics
- User management and approval flows
- Course oversight and content monitoring
- Announcement publishing and communication tools
- Feedback review and operational insights

### Trainer Portal
- Course management and training dashboard
- Learner enrollment and progress visibility
- Resource uploads for learning materials
- Assessment creation and evaluation support
- Competency matching and course recommendations

### Trainee Portal
- Personalized dashboard and learning journey
- Course discovery and enrollment actions
- Progress and activity tracking
- Assessment participation and score feedback
- Learning streaks and engagement metrics
- Library access to training resources

### Shared Platform Features
- Secure-looking auth flow with login and registration experience
- Role-based rendering for different user types
- Responsive dashboard layouts
- Dark mode styling with glassmorphism panels and gradient background effects
- Mock API backend with seeded users and learning data
- Data persistence in browser localStorage for demo sessions

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- CORS
- UUID-based mock data seeding

## Project Structure

```text
sahayta-saarthi-v2/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── db.js
│   │   ├── server.js
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
├── .gitignore
└── README.md
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js 18 or later
- npm 9 or later

## Installation

### 1) Clone the repository

```bash
git clone <repository-url>
cd sahayta-saarthi-v2
```

### 2) Install backend dependencies

```bash
cd backend
npm install
```

### 3) Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Project

You need to start both the backend and frontend services.

### Start the backend

From the project root:

```bash
cd backend
npm run dev
```

The Express API runs on:

- http://localhost:5000

### Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

The Vite app runs on:

- http://localhost:5173

## Accessing the App

After both services are running:

- Open the frontend in your browser at http://localhost:5173
- The frontend is configured to communicate with the backend at http://localhost:5000/api

## Demo Credentials

The app includes seeded mock users for quick testing.

### Admin
- Email: admin@capacityconnect.in
- Password: admin@123

### Trainer
- Email: priya.nair@capacityconnect.in
- Password: trainer@123

### Trainee
- Email: ananya.sharma@example.com
- Password: trainee@123

You can also use the demo role switcher in the UI for quick portal access testing.

## Backend API Notes

The backend exposes a mock REST API for core LMS workflows, including:

- Auth login and registration
- User listing and approval updates
- Course retrieval and creation
- Assessments and submission handling
- Library uploads
- Competency matching
- Announcements and feedback endpoints
- Enrollment actions

The backend also includes a health-check route:

```bash
GET http://localhost:5000/api/health
```

## Frontend Build

To create a production build for the frontend:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
cd frontend
npm run preview
```

## Environment Variables

### Frontend
The frontend uses:

```bash
VITE_API_URL
```

If set, it overrides the default backend API base URL. If not set, it defaults to:

```bash
http://localhost:5000/api
```

### Backend
The backend can use:

```bash
PORT
```

If not set, it defaults to port 5000.

## Notes

- This project uses mock in-memory data, not a production database.
- The app is meant for demonstration and prototyping workflows.
- For a production deployment, the backend should be upgraded to use a real database and secure password hashing.

## License

This project is for educational/demo use unless otherwise stated in a separate project license.
