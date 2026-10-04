import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import {
  Sparkles,
  PlayCircle,
  FileText,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses?sort=popular');
        setCourses(res.data.courses.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 3rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: '#a5b4fc',
            fontWeight: 600
          }}>
            <Sparkles size={16} />
            MERN Stack E-Learning Experience
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Learn Faster. Teach Smarter. <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Powered by MERN, Stripe & Cloudinary.
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            An end-to-end learning platform with role-based authorization for students, tutors, and administrators. Stream high-definition videos, access PDF study guides, and track your progress to mastery.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Explore Course Catalog <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Become an Instructor
            </Link>
          </div>

          {/* Value Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
            color: '#cbd5e1',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> JWT Secure Auth
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> Cloudinary Video & PDF
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> Stripe Checkout Ready
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" /> 3-Role Architecture
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Tailored Experiences for Every Role
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Engineered with strict separation of concerns and role-based access control.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="card">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <PlayCircle size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Student Experience</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Browse curated courses, inspect lesson previews, enroll with 1-click or Stripe checkout, stream video lessons, download PDF resources, and track progress with interactive checkmarks.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <FileText size={24} color="#22d3ee" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tutor Studio</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Author rich curricula with video lectures and PDF resources uploaded seamlessly to Cloudinary. Monitor enrolled student statistics, course revenue, and curriculum updates.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} color="#fb7185" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Control Center</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Complete system oversight with platform metrics, user management (suspend, elevate roles to tutor or admin), course moderation, and Stripe transaction logs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>Featured Masterclasses</h2>
            <p style={{ color: 'var(--text-muted)' }}>Top-rated hands-on courses taught by industry veterans</p>
          </div>
          <Link to="/courses" className="btn btn-outline btn-sm">
            View All Courses
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading courses...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Call to action */}
      <section className="container">
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          textAlign: 'center',
          padding: '3.5rem 2rem'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Build Your Engineering Career?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Join thousands of active developers learning modern web stacks, cloud deployment, and system architecture.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
