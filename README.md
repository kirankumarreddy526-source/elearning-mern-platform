# EduSphere | Full-Stack MERN E-Learning Platform

A production-ready Full-Stack E-Learning Web Application built with the **MERN Stack (MongoDB, Express.js, React 18, Node.js)** featuring JWT authentication, Role-Based Access Control (RBAC), Cloudinary media streaming (video & PDF study materials), and Stripe checkout payment processing.

---

## 🚀 Live Servers

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000](http://localhost:5000)
- **Database**: MongoDB connected locally on `127.0.0.1:27017` (`elearning_platform`)

---

## 🔑 Demo Login Accounts

Quick 1-click login buttons are available on the [Login Page](http://localhost:5173/login), or you can use these seeded credentials:

| Role | Email | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@elearning.com` | `password123` | Browse catalog, enroll in free/paid courses, stream videos, view PDFs, track completion |
| **👨‍🏫 Tutor** | `tutor@elearning.com` | `password123` | Tutor Studio, create courses, upload videos/PDFs to Cloudinary, track revenue & students |
| **🛡️ Admin** | `admin@elearning.com` | `password123` | Platform oversight, system KPI analytics, manage/suspend users, moderate courses |

---

## 🏗️ Architecture & Features

### 1. Three Roles & RBAC (Role-Based Access Control)
- **Student**:
  - Browse and filter course catalog by category, level, and price (Free vs Paid).
  - Preview free lessons before enrolling.
  - One-click enrollment for Free courses ($0).
  - Stripe Checkout session integration for Paid courses.
  - Interactive learning classroom: HTML5 video player, downloadable PDF study notes, toggle lesson progress with checkmarks, and a celebration confetti burst upon reaching 100% completion.
- **Tutor**:
  - Tutor Studio dashboard tracking active courses, enrolled students, and Stripe earnings.
  - Create and publish new courses with custom categories, levels, and pricing.
  - Upload videos and PDF notes directly to Cloudinary via Multer stream buffer.
  - Manage course curriculum: add, edit, or delete lessons.
- **Admin**:
  - System telemetry: total users, active students, tutors, courses, and total platform revenue.
  - User management table: change user roles (student/tutor/admin), toggle account suspension status, or delete accounts.
  - Course moderation table: inspect and remove courses.
  - Stripe transaction history log.

### 2. Media Streaming with Cloudinary
- Handles video lectures (`.mp4`, `.webm`, `.mov`) and course PDF notes.
- Graceful fallback for local development testing if custom API credentials are not yet entered.

### 3. Stripe Payment Gateway
- End-to-end checkout flow using Stripe Checkout Sessions.
- Webhook listener `/api/payments/webhook` for production reliability.
- Instant development fallback simulation for immediate testing.

---

## 📁 Project Structure

```
elearning-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB, Cloudinary, and Stripe SDK initializations
│   │   ├── controllers/     # Auth, Course, Student, Tutor, Admin, and Payment controllers
│   │   ├── middleware/      # JWT verification, Role authorization, Multer upload
│   │   ├── models/          # User, Course, Lesson, Enrollment, Payment (Mongoose)
│   │   ├── routes/          # RESTful express route definitions
│   │   ├── seed.js          # Database seeder script
│   │   └── server.js        # Express app entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, CourseCard, ProtectedRoute
│   │   ├── context/         # AuthContext (state, tokens, role helpers)
│   │   ├── pages/
│   │   │   ├── student/     # StudentDashboard, CoursePlayerPage
│   │   │   ├── tutor/       # TutorDashboard, CreateCoursePage
│   │   │   ├── admin/       # AdminDashboard
│   │   │   ├── HomePage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PaymentSuccessPage.jsx
│   │   │   └── PaymentCancelPage.jsx
│   │   ├── services/        # Axios API client with Bearer token interceptor
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
└── README.md
```

---

## 🛠️ Running the Application

### 1. Database Seeding (Already completed)
```bash
cd backend
npm run seed
```

### 2. Starting the Backend Server
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

### 3. Starting the Frontend Server
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
1. Push the code to GitHub.
2. In Vercel, import the repository and set the **Root Directory** to `frontend`.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add environment variable `VITE_API_URL` pointing to your Render backend URL.

### Backend Deployment (Render)
1. In Render, create a new **Web Service**.
2. Set the **Root Directory** to `backend`.
3. Set build command: `npm install`.
4. Set start command: `node src/server.js`.
5. Add environment variables in the Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `STRIPE_SECRET_KEY`: Your live/test Stripe Secret Key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Signing Secret
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLIENT_URL`: Your Vercel frontend domain URL
