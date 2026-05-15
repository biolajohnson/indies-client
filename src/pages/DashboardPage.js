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

function CreateCampaignForm({ token, onCreated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    short_description: '',
    description: '',
    goal_amount: '',
    genre: '',
    deadline: '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/campaigns/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          goal_amount: parseFloat(form.goal_amount),
          deadline: form.deadline || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create campaign');
      setOpen(false);
      setForm({ title: '', short_description: '', description: '', goal_amount: '', genre: '', deadline: '' });
      onCreated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '0.6rem 1.2rem', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1rem' }}
      >
        + New Campaign
      </button>
    );
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1.25rem' }}>New Campaign</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Title *</label>
            <input required style={inputStyle} value={form.title} onChange={set('title')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Short description</label>
            <input style={inputStyle} value={form.short_description} onChange={set('short_description')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Full description *</label>
            <textarea required rows={4} style={inputStyle} value={form.description} onChange={set('description')} />
          </div>
          <div>
            <label style={labelStyle}>Goal amount ($) *</label>
            <input required type="number" min="1" style={inputStyle} value={form.goal_amount} onChange={set('goal_amount')} />
          </div>
          <div>
            <label style={labelStyle}>Genre</label>
            <input style={inputStyle} value={form.genre} onChange={set('genre')} placeholder="e.g. drama, sci-fi" />
          </div>
          <div>
            <label style={labelStyle}>Deadline</label>
            <input type="date" style={inputStyle} value={form.deadline} onChange={set('deadline')} />
          </div>
        </div>
        {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.6rem 1.2rem', background: saving ? '#aaa' : '#222', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Creating…' : 'Create Campaign'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid #888', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', color: '#333' }}
          >
            Cancel
          </button>
        </div>
      </form>
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
      <CreateCampaignForm token={token} onCreated={(c) => setCampaigns((prev) => [c, ...prev])} />
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
