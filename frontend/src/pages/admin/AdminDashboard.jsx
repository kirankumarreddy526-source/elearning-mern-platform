import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  ShieldAlert,
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  UserX,
  Trash2,
  TrendingUp,
  Receipt
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'courses' or 'payments'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/courses')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setCourses(coursesRes.data.courses);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/admin/users/${userId}`, { status: newStatus });
      setUsers(users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to remove this course from the platform?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove course');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading platform administration telemetry...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          padding: '0.6rem',
          borderRadius: '10px'
        }}>
          <ShieldAlert size={28} color="#fb7185" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Admin Oversight Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            System health, RBAC controls, user authorization, and course oversight.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Users</span>
              <Users size={20} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {stats.totalStudents} Students • {stats.totalTutors} Tutors
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Published Courses</span>
              <BookOpen size={20} color="#22d3ee" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.totalCourses}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Across 7 categories
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrollments</span>
              <TrendingUp size={20} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats.totalEnrollments}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Free & Paid classes
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Platform Revenue</span>
              <DollarSign size={20} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem' }}>${stats.totalRevenue.toFixed(2)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Processed via Stripe
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Users size={16} /> User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <BookOpen size={16} /> Course Moderation ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Receipt size={16} /> Stripe Transactions
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role (RBAC)</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <option value="student">student</option>
                      <option value="tutor">tutor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStatusToggle(u._id, u.status || 'active')}
                        className={`btn ${u.status === 'suspended' ? 'btn-success' : 'btn-secondary'} btn-sm`}
                        title="Toggle Status"
                      >
                        {u.status === 'suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete User"
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

      {/* Tab 2: Course Moderation */}
      {activeTab === 'courses' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Enrolled</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        style={{ width: '45px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 600 }}>{c.title}</span>
                    </div>
                  </td>
                  <td>{c.tutor?.name || 'Unknown'}</td>
                  <td><span className="badge badge-primary">{c.category}</span></td>
                  <td>{c.price === 0 ? 'FREE' : `$${c.price.toFixed(2)}`}</td>
                  <td>{c.enrolledCount || 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteCourse(c._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Transactions */}
      {activeTab === 'payments' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentPayments && stats.recentPayments.length > 0 ? (
                stats.recentPayments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.student?.name || 'alex@example.com'}</td>
                    <td>{p.course?.title || 'Course'}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>${p.amount.toFixed(2)}</td>
                    <td><span className="badge badge-primary">Stripe</span></td>
                    <td><span className="badge badge-success">{p.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
