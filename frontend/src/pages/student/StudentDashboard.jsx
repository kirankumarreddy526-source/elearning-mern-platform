import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/student/enrollments');
        setEnrollments(res.data.enrollments);
      } catch (err) {
        console.error('Failed to load enrollments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const completedCount = enrollments.filter((e) => e.isCompleted).length;
  const inProgressCount = enrollments.length - completedCount;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) /
            enrollments.length
        )
      : 0;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track your course progress, video lectures, and PDF study materials.
          </p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          <BookOpen size={18} /> Browse More Courses
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={26} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{enrollments.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={26} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed Courses</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{completedCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={26} color="#22d3ee" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Progress</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{avgProgress}%</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          My Enrolled Courses
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
        ) : enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Enrolled Courses Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Find a course that fits your learning journey and start streaming immediately!
            </p>
            <Link to="/courses" className="btn btn-primary">
              Discover Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {enrollments.map((en) => {
              const c = en.course;
              if (!c) return null;

              return (
                <div key={en._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                      alt={c.title}
                      style={{ width: '110px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
                      <span className="badge badge-primary" style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                        {c.category}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
                        {c.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Instructor: {c.tutor?.name || 'EduSphere Tutor'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Learning Progress</span>
                      <span style={{ fontWeight: 700, color: en.isCompleted ? 'var(--success)' : '#fff' }}>
                        {en.progressPercentage}% {en.isCompleted && '🎉 Completed'}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${en.progressPercentage}%`,
                          background: en.isCompleted ? 'var(--success)' : undefined
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <Link
                      to={`/student/learn/${c._id}`}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.55rem 1rem' }}
                    >
                      {en.isCompleted ? 'Review Course' : 'Continue Learning'} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
