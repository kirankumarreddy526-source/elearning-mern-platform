import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PlayCircle,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Users,
  Shield,
  CreditCard,
  Lock,
  ArrowRight,
  Eye
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);

        // Check if student is already enrolled
        if (isAuthenticated) {
          try {
            const enrollRes = await api.get('/student/enrollments');
            const found = enrollRes.data.enrollments.some(
              (en) => en.course && en.course._id === id
            );
            setIsEnrolled(found);
          } catch (err) {
            // If error fetching enrollments (e.g. if user is tutor/admin), ignore
          }
        }
      } catch (err) {
        console.error('Failed to load course details', err);
        setErrorMsg('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndStatus();
  }, [id, isAuthenticated]);

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setErrorMsg('');

    try {
      if (course.price === 0) {
        // Free enrollment
        await api.post(`/student/courses/${id}/enroll-free`);
        navigate(`/student/learn/${id}`);
      } else {
        // Stripe Checkout
        const res = await api.post('/payments/create-checkout-session', {
          courseId: id
        });

        if (res.data.checkoutUrl) {
          window.location.href = res.data.checkoutUrl;
        } else {
          setErrorMsg('Failed to initialize payment gateway.');
        }
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setErrorMsg(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading course syllabus and details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem' }}>
      {/* Course Banner */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '3.5rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem', alignItems: 'start' }}>
            {/* Left Column: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{course.category}</span>
                <span className="badge badge-secondary">{course.level}</span>
                {course.price === 0 && <span className="badge badge-success">Free Tier</span>}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25 }}>
                {course.title}
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {course.subtitle || course.description.slice(0, 160)}
              </p>

              {/* Course Meta Info */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <strong style={{ color: '#fff' }}>{course.averageRating || 4.8}</strong>
                  <span>({course.reviewsCount || 0} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} />
                  <span>{course.enrolledCount || 0} students enrolled</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlayCircle size={16} />
                  <span>{course.lessons?.length || 0} curriculum lessons</span>
                </div>
              </div>

              {/* Instructor snippet */}
              {course.tutor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img
                    src={course.tutor.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={course.tutor.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created by</div>
                    <div style={{ fontWeight: 600 }}>{course.tutor.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Checkout Card */}
            <div className="card" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '100%', height: '190px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {course.price === 0 ? (
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>FREE</span>
                ) : (
                  <>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>${course.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>One-time payment</span>
                  </>
                )}
              </div>

              {errorMsg && (
                <div style={{ padding: '0.65rem', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {errorMsg}
                </div>
              )}

              {isEnrolled ? (
                <Link
                  to={`/student/learn/${course._id}`}
                  className="btn btn-success"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  Continue Learning <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  {enrolling
                    ? 'Processing...'
                    : course.price === 0
                    ? 'Enroll Now for Free'
                    : 'Enroll with Stripe'}
                </button>
              )}

              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="#10b981" /> Full lifetime access
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="#10b981" /> Cloudinary high-speed streaming
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="#10b981" /> Downloadable PDF notes & materials
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="#10b981" /> Certificate of completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Body: Description & Syllabus */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem' }}>
          {/* Main Syllabus & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Course Overview</h2>
              <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
                {course.description}
              </div>
            </div>

            {/* Curriculum list */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Curriculum & Lessons</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {course.lessons?.length || 0} Lessons
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                    <div
                      key={lesson._id || idx}
                      className="card"
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#a5b4fc'
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lesson.title}</div>
                          {lesson.description && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {lesson.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <Clock size={14} />
                          <span>{lesson.duration || '10 min'}</span>
                        </div>

                        {lesson.isFreePreview ? (
                          <button
                            onClick={() => setPreviewLesson(lesson)}
                            className="btn btn-outline btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Eye size={14} /> Preview
                          </button>
                        ) : (
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                            <Lock size={14} /> Locked
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No lessons added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Bio */}
          {course.tutor && (
            <div className="card" style={{ height: 'fit-content', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>About the Instructor</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={course.tutor.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                  alt={course.tutor.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{course.tutor.name}</h4>
                  <span className="badge badge-primary">Instructor</span>
                </div>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {course.tutor.bio || 'Dedicated software instructor with deep expertise in web architecture, engineering leadership, and hands-on system delivery.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Free Lesson Preview Modal */}
      {previewLesson && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '750px', width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Free Preview: {previewLesson.title}
              </h3>
              <button
                onClick={() => setPreviewLesson(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>

            {previewLesson.videoUrl ? (
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <video
                  src={previewLesson.videoUrl}
                  controls
                  autoPlay
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Video preview not available for this lesson.</p>
            )}

            {previewLesson.pdfUrl && (
              <a
                href={previewLesson.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ width: 'fit-content' }}
              >
                <FileText size={16} /> View Accompanying PDF Document
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
