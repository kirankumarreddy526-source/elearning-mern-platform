import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  const isFree = course.price === 0;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Course Thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0b1329' }}>
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
          alt={course.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(99, 102, 241, 0.85)', color: '#fff' }}>
            {course.category}
          </span>
          <span className="badge badge-secondary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.75)', color: '#cbd5e1' }}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, minHeight: '2.8rem' }}>
          {course.title}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6rem'
        }}>
          {course.subtitle || course.description}
        </p>

        {/* Tutor info */}
        {course.tutor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
            <img
              src={course.tutor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={course.tutor.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>{course.tutor.name}</span>
          </div>
        )}

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '0.75rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Star size={15} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#fff', fontWeight: 600 }}>{course.averageRating || 4.8}</span>
            <span>({course.reviewsCount || 0})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={15} />
            <span>{course.enrolledCount || 0} enrolled</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.25rem'
        }}>
          <div>
            {isFree ? (
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>
                FREE
              </span>
            ) : (
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                ${course.price.toFixed(2)}
              </span>
            )}
          </div>
          <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
