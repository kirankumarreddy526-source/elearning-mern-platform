import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  BookOpen,
  Users,
  DollarSign,
  Trash2,
  ExternalLink,
  Plus,
  Video,
  FileText,
  Upload
} from 'lucide-react';

const TutorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  // Lesson Modal State
  const [activeCourseForLesson, setActiveCourseForLesson] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15 min');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonPdfUrl, setLessonPdfUrl] = useState('');
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);

  const fetchTutorData = async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        api.get('/tutor/courses'),
        api.get('/tutor/stats')
      ]);
      setCourses(coursesRes.data.courses);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Failed to load tutor data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all its lessons?')) return;
    try {
      await api.delete(`/tutor/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  // Upload file helper to Cloudinary
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    setUploadingMedia(true);
    try {
      const res = await api.post('/tutor/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'video') {
        setLessonVideoUrl(res.data.url);
      } else if (type === 'pdf') {
        setLessonPdfUrl(res.data.url);
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();
    if (!activeCourseForLesson) return;

    setSavingLesson(true);
    try {
      await api.post(`/tutor/courses/${activeCourseForLesson._id}/lessons`, {
        title: lessonTitle,
        description: lessonDesc,
        duration: lessonDuration,
        videoUrl: lessonVideoUrl,
        pdfUrl: lessonPdfUrl,
        isFreePreview: lessonIsPreview
      });

      // Reset form
      setLessonTitle('');
      setLessonDesc('');
      setLessonVideoUrl('');
      setLessonPdfUrl('');
      setLessonIsPreview(false);
      setActiveCourseForLesson(null);

      // Refresh courses
      fetchTutorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSavingLesson(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Tutor Studio</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Publish curricula, stream lectures via Cloudinary, and manage your students.
          </p>
        </div>
        <Link to="/tutor/create-course" className="btn btn-primary">
          <PlusCircle size={18} /> Create New Course
        </Link>
      </div>

      {/* KPI Cards */}
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
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Courses Created</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalCourses}</div>
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
            <Users size={26} color="#22d3ee" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Students Enrolled</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalStudents}</div>
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
            <DollarSign size={26} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Revenue Generated (Stripe)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          My Published Courses
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your courses...</p>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Courses Created Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Publish your first masterclass and upload your course materials.
            </p>
            <Link to="/tutor/create-course" className="btn btn-primary">
              <PlusCircle size={18} /> Launch Course
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Lessons</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{c.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{c.category}</span>
                    </td>
                    <td>
                      {c.price === 0 ? (
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
                      ) : (
                        <span>${c.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td>{c.enrolledCount || 0}</td>
                    <td>{c.lessons?.length || 0} lessons</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setActiveCourseForLesson(c)}
                          className="btn btn-secondary btn-sm"
                          title="Add Lesson / Upload Materials"
                        >
                          <Plus size={14} /> Add Lesson
                        </button>
                        <Link
                          to={`/courses/${c._id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Course Page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(c._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {activeCourseForLesson && (
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
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Add Lesson to "{activeCourseForLesson.title}"
              </h3>
              <button
                onClick={() => setActiveCourseForLesson(null)}
                className="btn btn-secondary btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLessonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Lesson Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1. Masterclass Introduction"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 15 min"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Video Upload or URL */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Video Material (Upload to Cloudinary or Paste URL)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="https://... video URL"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    className="form-input"
                  />
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                  </label>
                </div>
                {uploadingMedia && <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Streaming to Cloudinary...</span>}
              </div>

              {/* PDF Upload or URL */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">PDF Notes / Slides (Upload to Cloudinary or Paste URL)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="https://... PDF document URL"
                    value={lessonPdfUrl}
                    onChange={(e) => setLessonPdfUrl(e.target.value)}
                    className="form-input"
                  />
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> Upload PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Lesson Description / Key Takeaways</label>
                <textarea
                  rows={3}
                  placeholder="Notes, code references, or summary for students..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="previewCheckbox"
                  checked={lessonIsPreview}
                  onChange={(e) => setLessonIsPreview(e.target.checked)}
                />
                <label htmlFor="previewCheckbox" style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                  Allow as Free Preview (Anyone can watch before enrolling)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveCourseForLesson(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="btn btn-primary"
                >
                  {savingLesson ? 'Saving Lesson...' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;
