import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import MaintenanceModal from '../components/MaintenanceModal';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    api.getCampaigns({ status: 'active' })
      .then(setCampaigns)
      .catch((err) => setError(err.message));
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {error && <MaintenanceModal onRetry={load} />}
      <h1>Indie Film Campaigns</h1>
      {campaigns.length === 0 && <p>Loading campaigns...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {campaigns.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            {c.thumbnail_url && (
              <img src={c.thumbnail_url} alt={c.title} style={{ width: '100%', borderRadius: '4px' }} />
            )}
            <h2 style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
              <Link to={`/content/${c.id}`}>{c.title}</Link>
            </h2>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>{c.short_description}</p>
            <p style={{ fontSize: '0.85rem' }}>
              by <Link to={`/artist/${c.filmmaker_id}`}>{c.filmmaker_name}</Link>
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ background: '#eee', borderRadius: '4px', height: '8px' }}>
                <div
                  style={{
                    background: '#4caf50',
                    width: `${Math.min(c.percent_funded, 100)}%`,
                    height: '100%',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                ${c.current_amount.toLocaleString()} raised of ${c.goal_amount.toLocaleString()} ({c.percent_funded}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
