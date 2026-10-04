import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'Cloud & DevOps',
  'UI/UX Design',
  'Cybersecurity'
];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceType, setSelectedPriceType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedPriceType !== 'all') params.priceType = selectedPriceType;
      if (selectedLevel !== 'All') params.level = selectedLevel;
      if (sort) params.sort = sort;

      const res = await api.get('/courses', { params });
      setCourses(res.data.courses);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedPriceType, selectedLevel, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore Masterclasses
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover cutting-edge engineering and design courses created by expert tutors.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by course title, framework, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat ? '#fff' : '#cbd5e1',
                  border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters Dropdowns */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedPriceType}
              onChange={(e) => setSelectedPriceType(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="all">All Prices</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing <strong style={{ color: '#fff' }}>{courses.length}</strong> courses
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading course library...
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Try adjusting your search keywords or resetting your active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
