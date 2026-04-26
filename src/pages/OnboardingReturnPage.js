import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../services/api';

export default function OnboardingReturnPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState('checking'); // checking | complete | incomplete

  useEffect(() => {
    if (!token) {
      setStatus('incomplete');
      return;
    }
    fetch(`${BASE_URL}/api/stripe/onboard/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.onboarded ? 'complete' : 'incomplete');
        if (data.onboarded) {
          fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((r) => r.json())
            .then((filmmaker) => localStorage.setItem('filmmaker', JSON.stringify(filmmaker)));
        }
      })
      .catch(() => setStatus('incomplete'));
  }, [token]);

  if (status === 'checking') {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Verifying your Stripe account…</div>;
  }

  if (status === 'complete') {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</p>
        <h1 style={{ marginBottom: '0.5rem' }}>Stripe account connected!</h1>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          Your campaigns can now accept donations. Earnings will be transferred to your bank automatically.
        </p>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#222',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Onboarding incomplete</h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        It looks like your Stripe account setup wasn't finished. You can complete it from your dashboard.
      </p>
      <Link
        to="/dashboard"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#222',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '1rem',
        }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
