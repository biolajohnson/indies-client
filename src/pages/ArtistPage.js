import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

const ArtistPage = () => {
  const { id } = useParams();
  const [filmmaker, setFilmmaker] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getFilmmaker(id)
      .then(setFilmmaker)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!filmmaker) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {filmmaker.avatar_url && (
          <img
            src={filmmaker.avatar_url}
            alt={filmmaker.name}
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <h1 style={{ margin: 0 }}>{filmmaker.name}</h1>
          {filmmaker.nationality && <p style={{ color: '#777', margin: '0.25rem 0' }}>{filmmaker.nationality}</p>}
          {filmmaker.website && (
            <a href={filmmaker.website} target="_blank" rel="noreferrer">{filmmaker.website}</a>
          )}
          <p style={{ marginTop: '0.75rem' }}>{filmmaker.bio}</p>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Campaigns</h2>
      {filmmaker.campaigns.length === 0 && <p>No campaigns yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filmmaker.campaigns.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ margin: 0 }}>
              <Link to={`/content/${c.id}`}>{c.title}</Link>
            </h3>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>{c.short_description}</p>
            <p style={{ fontSize: '0.85rem' }}>
              ${c.current_amount.toLocaleString()} / ${c.goal_amount.toLocaleString()} — {c.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;
