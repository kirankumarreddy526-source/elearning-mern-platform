import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course_id');

  return (
    <div className="container" style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <AlertTriangle size={32} color="#f59e0b" />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Checkout Cancelled</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Your Stripe payment session was not completed. No charges were made to your card or account.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {courseId ? (
            <Link to={`/courses/${courseId}`} className="btn btn-primary">
              <ArrowLeft size={16} /> Return to Course
            </Link>
          ) : (
            <Link to="/courses" className="btn btn-primary">
              Browse Catalog
            </Link>
          )}
          <Link to="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
