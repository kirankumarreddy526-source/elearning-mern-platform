const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Enrollment = require('./models/Enrollment');
const Payment = require('./models/Payment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elearning_platform');
    console.log('[Seeder] Connected to MongoDB...');

    // Clear previous data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});
    await Payment.deleteMany({});
    console.log('[Seeder] Cleared previous database records...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Eleanor Admin',
      email: 'admin@elearning.com',
      password: 'password123',
      role: 'admin',
      bio: 'Lead platform administrator and curriculum director.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });

    const tutorUser = await User.create({
      name: 'Dr. Marcus Vance',
      email: 'tutor@elearning.com',
      password: 'password123',
      role: 'tutor',
      bio: 'Senior Full Stack Software Architect with 12+ years building web applications at scale.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    });

    const studentUser = await User.create({
      name: 'Alex Student',
      email: 'student@elearning.com',
      password: 'password123',
      role: 'student',
      bio: 'Aspiring full-stack engineer passionate about JavaScript, React, and cloud systems.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    });

    console.log('[Seeder] Created default users (Admin, Tutor, Student)');

    // 2. Create Courses
    const course1 = await Course.create({
      title: 'Full-Stack MERN Architecture: Zero to Production',
      subtitle: 'Master Node.js, Express, MongoDB, React, JWT auth, Stripe payments and Cloudinary uploads.',
      description: 'An exhaustive masterclass covering real-world architecture. Build production-grade backends with role-based access control, secure payment pipelines with Stripe, file storage via Cloudinary, and high-performance React frontends.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 49.99,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      tutor: tutorUser._id,
      averageRating: 4.9,
      reviewsCount: 128,
      isPublished: true
    });

    const course2 = await Course.create({
      title: 'React 18 & Modern State Management Essentials',
      subtitle: 'Complete guide to React Hooks, Context API, Tailwind CSS, and resilient component design.',
      description: 'Learn modern React from scratch. We cover declarative UI principles, state lifecycles, custom hooks, and best practices for building responsive single-page applications.',
      category: 'Web Development',
      level: 'Beginner',
      price: 0, // Free course
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      tutor: tutorUser._id,
      averageRating: 4.8,
      reviewsCount: 340,
      isPublished: true
    });

    const course3 = await Course.create({
      title: 'Practical Cloud & DevOps with Docker and Kubernetes',
      subtitle: 'Deploy, scale, and monitor microservices using Docker, Render, Vercel and CI/CD pipelines.',
      description: 'Learn continuous deployment and container orchestration. Package your MERN apps in Docker containers, configure environment secrets safely, and deploy to modern cloud providers.',
      category: 'Cloud & DevOps',
      level: 'Advanced',
      price: 69.99,
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      tutor: tutorUser._id,
      averageRating: 4.9,
      reviewsCount: 84,
      isPublished: true
    });

    // 3. Create Lessons for Course 1
    const lesson1_1 = await Lesson.create({
      course: course1._id,
      title: '1. Introduction to MERN System Architecture',
      description: 'High-level design of REST APIs, MongoDB data layer, and React client interactions.',
      duration: '15 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 1,
      isFreePreview: true
    });

    const lesson1_2 = await Lesson.create({
      course: course1._id,
      title: '2. JWT Authentication & Role-Based Authorization',
      description: 'Implementing secure bearer tokens, bcrypt password hashing, and role check middleware.',
      duration: '25 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 2,
      isFreePreview: false
    });

    const lesson1_3 = await Lesson.create({
      course: course1._id,
      title: '3. Cloudinary Integration for Media & PDF Materials',
      description: 'Stream upload processing using Multer and Cloudinary v2 SDK.',
      duration: '20 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 3,
      isFreePreview: false
    });

    const lesson1_4 = await Lesson.create({
      course: course1._id,
      title: '4. Stripe Checkout & Webhook Settlement',
      description: 'End-to-end payment flow, idempotency keys, and webhook event verification.',
      duration: '30 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 4,
      isFreePreview: false
    });

    course1.lessons = [lesson1_1._id, lesson1_2._id, lesson1_3._id, lesson1_4._id];
    await course1.save();

    // Lessons for Course 2
    const lesson2_1 = await Lesson.create({
      course: course2._id,
      title: '1. React 18 Core Concepts & Project Bootstrapping',
      description: 'Vite setup, JSX transformation, and state fundamentals.',
      duration: '12 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 1,
      isFreePreview: true
    });

    const lesson2_2 = await Lesson.create({
      course: course2._id,
      title: '2. Hooks Deep Dive: useState, useEffect, and Custom Hooks',
      description: 'Managing component state without memory leaks.',
      duration: '18 min',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 2,
      isFreePreview: true
    });

    course2.lessons = [lesson2_1._id, lesson2_2._id];
    await course2.save();

    // 4. Enroll Student in Course 1 and Course 2
    const paymentRecord = await Payment.create({
      student: studentUser._id,
      course: course1._id,
      stripeSessionId: 'seed_stripe_session_001',
      amount: course1.price,
      currency: 'usd',
      status: 'completed'
    });

    await Enrollment.create({
      student: studentUser._id,
      course: course1._id,
      completedLessons: [lesson1_1._id], // Lesson 1 completed (25% progress)
      progressPercentage: 25,
      payment: paymentRecord._id,
      lastAccessedLesson: lesson1_2._id
    });
    course1.enrolledCount = 1;
    await course1.save();

    await Enrollment.create({
      student: studentUser._id,
      course: course2._id,
      completedLessons: [lesson2_1._id, lesson2_2._id], // 100% completed!
      progressPercentage: 100,
      isCompleted: true,
      completedAt: new Date()
    });
    course2.enrolledCount = 1;
    await course2.save();

    console.log('✅ Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Admin:   admin@elearning.com   / password123');
    console.log('Tutor:   tutor@elearning.com   / password123');
    console.log('Student: student@elearning.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
