import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, BookPlus, Upload, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'Cloud & DevOps',
  'UI/UX Design',
  'Cybersecurity',
  'Business & Tech'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const CreateCoursePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('0');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80');
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'thumbnail');

    setUploadingThumb(true);
    try {
      const res = await api.post('/tutor/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setThumbnail(res.data.url);
    } catch (err) {
      alert('Thumbnail upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/tutor/courses', {
        title,
        subtitle,
        description,
        category,
        level,
        price: parseFloat(price) || 0,
        thumbnail
      });

      navigate('/tutor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/tutor/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Studio
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create New Masterclass</h1>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{
            padding: '0.75rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '6px',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack MERN Architecture: Zero to Production"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Short Subtitle</label>
            <input
              type="text"
              placeholder="e.g. Master Node, React, Cloudinary and Stripe payments with production standards"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-select"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Price ($ USD - 0 for Free)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Course Cover Thumbnail</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://... thumbnail image URL"
                className="form-input"
              />
              <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Upload size={16} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleThumbnailUpload}
                />
              </label>
            </div>
            {uploadingThumb && <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Uploading image to Cloudinary...</span>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Detailed Course Syllabus Description</label>
            <textarea
              required
              rows={6}
              placeholder="What students will learn, prerequisites, course goals, and project overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/tutor/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Creating Course...' : 'Create Course & Add Lessons'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
