import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isTutor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Edu<span style={{ color: 'var(--primary)' }}>Sphere</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/courses"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.925rem',
              fontWeight: 500,
              color: isActive('/courses') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <BookOpen size={18} />
            Explore Courses
          </Link>

          {isAuthenticated && isStudent && (
            <Link
              to="/student/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.925rem',
                fontWeight: 500,
                color: isActive('/student/dashboard') ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              <LayoutDashboard size={18} />
              My Learning
            </Link>
          )}

          {isAuthenticated && isTutor && (
            <>
              <Link
                to="/tutor/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/tutor/dashboard') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <LayoutDashboard size={18} />
                Tutor Studio
              </Link>
              <Link
                to="/tutor/create-course"
                className="btn btn-outline btn-sm"
              >
                <PlusCircle size={16} />
                New Course
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.925rem',
                fontWeight: 500,
                color: isActive('/admin/dashboard') ? 'var(--accent)' : 'var(--text-muted)'
              }}
            >
              <ShieldAlert size={18} color="var(--accent)" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* User Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                  <span className={`badge ${user.role === 'admin' ? 'badge-warning' : user.role === 'tutor' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', width: 'fit-content' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
