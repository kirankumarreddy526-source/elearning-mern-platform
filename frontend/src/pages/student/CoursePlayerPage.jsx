import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';

const CoursePlayerPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchLearningRoom = async () => {
      try {
        const res = await api.get(`/student/courses/${courseId}/learn`);
        const { course: courseData, enrollment: enrollmentData } = res.data;

        setCourse(courseData);
        setEnrollment(enrollmentData);

        const completedSet = new Set(
          (enrollmentData.completedLessons || []).map((id) =>
            typeof id === 'object' ? id._id.toString() : id.toString()
          )
        );
        setCompletedLessonIds(completedSet);

        // Select initial lesson: either first uncompleted or first lesson
        if (courseData.lessons && courseData.lessons.length > 0) {
          const firstUncompleted = courseData.lessons.find(
            (l) => !completedSet.has(l._id.toString())
          );
          setActiveLesson(firstUncompleted || courseData.lessons[0]);
        }
      } catch (err) {
        console.error('Failed to load course player', err);
        setErrorMsg(err.response?.data?.message || 'Failed to load course content. Ensure enrollment.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningRoom();
  }, [courseId]);

  const toggleLessonCompletion = async (lessonId) => {
    if (!lessonId) return;
    setUpdating(true);

    try {
      const res = await api.post(`/student/courses/${courseId}/lessons/${lessonId}/progress`);
      const { progressPercentage, isCompleted, completedLessons } = res.data;

      const newSet = new Set(completedLessons.map((id) => id.toString()));
      setCompletedLessonIds(newSet);
      setEnrollment((prev) => ({
        ...prev,
        progressPercentage,
        isCompleted,
        completedLessons
      }));

      // Trigger celebration confetti if just achieved 100% completion!
      if (isCompleted && (!enrollment || !enrollment.isCompleted)) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to toggle completion status', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Entering classroom & streaming session...</p>
      </div>
    );
  }

  if (errorMsg || !course) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{errorMsg}</p>
        <Link to={`/courses/${courseId}`} className="btn btn-primary">
          View Course Page
        </Link>
      </div>
    );
  }

  const isCurrentCompleted = activeLesson && completedLessonIds.has(activeLesson._id.toString());
  const progressPercent = enrollment?.progressPercentage || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 72px)', background: '#0a0f1d' }}>
      {/* Top Classroom Bar */}
      <div style={{
        background: '#111827',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/student/dashboard" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
            <ArrowLeft size={16} /> My Courses
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{course.title}</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Lesson: {activeLesson?.title || 'Overview'}
            </span>
          </div>
        </div>

        {/* Progress Tracker Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <span>Course Progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-track" style={{ height: '6px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent === 100 ? 'var(--success)' : undefined
                }}
              />
            </div>
          </div>

          {progressPercent === 100 && (
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Award size={14} /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Main Learning Classroom Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 360px',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Column: Player & Lesson Materials */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Video Player */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson._id}
                src={activeLesson.videoUrl}
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                gap: '0.75rem'
              }}>
                <PlayCircle size={48} />
                <span>No video link attached to this lesson</span>
              </div>
            )}
          </div>

          {/* Lesson Action Bar */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{activeLesson?.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> {activeLesson?.duration || '10 min'}
                </span>
                <span>•</span>
                <span>Cloudinary Enhanced Stream</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* PDF Materials Button */}
              {activeLesson?.pdfUrl && (
                <a
                  href={activeLesson.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileText size={16} color="#38bdf8" />
                  <span>Download PDF Notes</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {/* Completion Toggle */}
              {activeLesson && (
                <button
                  onClick={() => toggleLessonCompletion(activeLesson._id)}
                  disabled={updating}
                  className={`btn ${isCurrentCompleted ? 'btn-success' : 'btn-primary'} btn-sm`}
                  style={{ padding: '0.6rem 1rem' }}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle2 size={16} /> Completed!
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Mark as Finished
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Lesson Description & Resources */}
          {activeLesson?.description && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lesson Notes & Highlights</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {activeLesson.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Syllabus & Lesson Playlist */}
        <div style={{
          background: '#0d1322',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Course Curriculum</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {completedLessonIds.size} of {course.lessons?.length || 0} completed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {course.lessons && course.lessons.map((lesson, idx) => {
              const isSelected = activeLesson?._id === lesson._id;
              const isDone = completedLessonIds.has(lesson._id.toString());

              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {isDone ? (
                      <CheckCircle2 size={18} color="#10b981" />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" />
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#fff' : '#cbd5e1'
                    }}>
                      {idx + 1}. {lesson.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{lesson.duration || '10 min'}</span>
                      {lesson.pdfUrl && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#38bdf8' }}>
                          • <FileText size={12} /> PDF
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
