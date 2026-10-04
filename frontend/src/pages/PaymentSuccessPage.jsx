import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { CheckCircle2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const courseId = searchParams.get('course_id');

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!courseId) {
        setErrorMessage('Missing course identifier in checkout redirect.');
        setVerifying(false);
        return;
      }

      try {
        await api.post('/payments/verify', {
          sessionId,
          courseId
        });

        setSuccess(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Payment verification error', err);
        // If already enrolled, treat as success
        if (err.response?.data?.message?.includes('Already enrolled')) {
          setSuccess(true);
        } else {
          setErrorMessage(err.response?.data?.message || 'Payment confirmation error.');
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, courseId]);

  return (
    <div className="container" style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        {verifying ? (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Confirming Stripe Settlement...
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Verifying payment transaction and provisioning your course access.
            </p>
          </div>
        ) : success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Enrollment Confirmed!</h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your Stripe payment was processed successfully. You now have full lifetime access to the video lectures and PDF resources.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to={`/student/learn/${courseId}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                Go to Classroom <ArrowRight size={18} />
              </Link>
              <Link to="/student/dashboard" className="btn btn-secondary">
                My Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={40} color="#f43f5e" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Verification Issue</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{errorMessage}</p>
            <Link to="/courses" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Back to Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
