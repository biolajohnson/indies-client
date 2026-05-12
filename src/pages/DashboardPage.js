import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../services/api';

function StripeConnectPanel({ filmmaker, token, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/stripe/onboard`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start onboarding');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/stripe/onboard/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check status');
      if (data.onboarded) onStatusChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  if (filmmaker.stripe_onboarded) {
    return (
      <div style={{ background: '#f0faf0', border: '1px solid #c3e6c3', borderRadius: '8px', padding: '1rem' }}>
        <p style={{ margin: 0, fontWeight: 500 }}>Stripe account connected</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#555' }}>
          Donations from your campaigns will be transferred to your account automatically.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fffbea', border: '1px solid #f0d060', borderRadius: '8px', padding: '1rem' }}>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 500 }}>Connect your Stripe account</p>
      <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555' }}>
        Required before your campaigns can accept donations. Stripe will deposit your earnings directly to your bank.
      </p>
      {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            padding: '0.6rem 1.2rem',
            background: loading ? '#aaa' : '#635bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Redirecting…' : 'Connect with Stripe'}
        </button>
        <button
          onClick={handleCheckStatus}
          disabled={checking}
          style={{
            padding: '0.6rem 1.2rem',
            background: 'transparent',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '0.9rem',
            cursor: checking ? 'not-allowed' : 'pointer',
          }}
        >
          {checking ? 'Checking…' : 'I already completed onboarding'}
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { filmmaker: initialFilmmaker, token, logout } = useAuth();
  const [filmmaker, setFilmmaker] = useState(initialFilmmaker);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/filmmakers/${filmmaker.id}`)
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
        setLoadingCampaigns(false);
      })
      .catch(() => setLoadingCampaigns(false));
  }, [filmmaker.id]);

  const refreshFilmmaker = () => {
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setFilmmaker(data);
        localStorage.setItem('filmmaker', JSON.stringify(data));
      });
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + c.current_amount, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#777' }}>Welcome back, {filmmaker.name}</p>
        </div>
        <button
          onClick={logout}
          style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Log out
        </button>
      </div>

      <StripeConnectPanel filmmaker={filmmaker} token={token} onStatusChange={refreshFilmmaker} />

      <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>
        <div style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{campaigns.length}</p>
          <p style={{ color: '#777', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Campaigns</p>
        </div>
        <div style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>${totalRaised.toLocaleString()}</p>
          <p style={{ color: '#777', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Total raised</p>
        </div>
        <div style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
            {campaigns.filter((c) => c.status === 'active').length}
          </p>
          <p style={{ color: '#777', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Active</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Your Campaigns</h2>
      {loadingCampaigns && <p style={{ color: '#777' }}>Loading…</p>}
      {!loadingCampaigns && campaigns.length === 0 && (
        <p style={{ color: '#777' }}>You don't have any campaigns yet.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {campaigns.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>
                  <Link to={`/content/${c.id}`}>{c.title}</Link>
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#777' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: c.status === 'active' ? '#e8f5e9' : c.status === 'funded' ? '#e3f2fd' : '#f5f5f5',
                      color: c.status === 'active' ? '#2e7d32' : c.status === 'funded' ? '#1565c0' : '#555',
                    }}
                  >
                    {c.status}
                  </span>
                  {c.deadline && (
                    <span style={{ marginLeft: '0.75rem' }}>
                      Deadline: {new Date(c.deadline).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 500 }}>${c.current_amount.toLocaleString()}</p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: '#777' }}>
                  of ${c.goal_amount.toLocaleString()} ({c.percent_funded}%)
                </p>
              </div>
            </div>
            <div style={{ background: '#eee', borderRadius: '4px', height: '6px', marginTop: '0.75rem' }}>
              <div
                style={{
                  background: '#4caf50',
                  width: `${Math.min(c.percent_funded, 100)}%`,
                  height: '100%',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
