import React from 'react';
import { GraduationCap, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      background: '#090d16',
      padding: '3rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex'
              }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Edu<span style={{ color: 'var(--primary)' }}>Sphere</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Production MERN E-Learning platform empowering students and tutors worldwide with video streaming, PDF materials, and secure Stripe payments.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Platform Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>Role-Based Access (Student, Tutor, Admin)</li>
              <li>Cloudinary Video & PDF Streaming</li>
              <li>Stripe Checkout Integration</li>
              <li>Granular Learning Progress Tracking</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Architecture</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>MongoDB Atlas / Mongoose ODM</li>
              <li>Express.js & Node.js REST API</li>
              <li>React 18 + Vite Frontend</li>
              <li>Render & Vercel Production Ready</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} EduSphere E-Learning. Developed using the MERN stack.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for online educators.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
