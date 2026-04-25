import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import VideoPlayer from '../components/MediaPlayer/VideoPlayer';
import PaymentPanel from '../components/Payments/PaymentPanel';

const ContentPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCampaign(id)
      .then(setCampaign)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div style={{ padding: '2rem' }}>Error: {error}</div>;
  if (!campaign) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', gap: '2rem' }}>
      <div style={{ flex: 2 }}>
        <h1>{campaign.title}</h1>
        <p style={{ color: '#777' }}>
          by{' '}
          <Link to={`/artist/${campaign.filmmaker_id}`}>{campaign.filmmaker_name}</Link>
          {campaign.genre && ` · ${campaign.genre}`}
        </p>

        {campaign.video_url ? (
          <video width="100%" controls style={{ borderRadius: '8px' }}>
            <source src={campaign.video_url} type="video/mp4" />
          </video>
        ) : (
          <VideoPlayer />
        )}

        <p style={{ marginTop: '1.5rem', lineHeight: 1.7 }}>{campaign.description}</p>

        {campaign.tags.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {campaign.tags.map((tag) => (
              <span
                key={tag}
                style={{ background: '#f0f0f0', borderRadius: '4px', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {campaign.updates.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Updates</h3>
            {campaign.updates.map((u) => (
              <div key={u.id} style={{ borderLeft: '3px solid #ddd', paddingLeft: '1rem', marginBottom: '1rem' }}>
                <strong>{u.title}</strong>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>{u.body}</p>
              </div>
            ))}
          </div>
        )}

        {campaign.donations && campaign.donations.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Recent Supporters</h3>
            {campaign.donations.slice(0, 10).map((d) => (
              <div
                key={d.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>
                    {d.is_anonymous ? 'Anonymous' : (d.donor_name || 'A supporter')}
                  </span>
                  {d.message && (
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: '0.2rem 0 0' }}>"{d.message}"</p>
                  )}
                </div>
                <span style={{ fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                  ${d.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
            ${campaign.current_amount.toLocaleString()}
          </p>
          <p style={{ color: '#777', margin: '0.25rem 0' }}>
            raised of ${campaign.goal_amount.toLocaleString()} goal
          </p>
          <div style={{ background: '#eee', borderRadius: '4px', height: '8px', margin: '0.75rem 0' }}>
            <div
              style={{
                background: '#4caf50',
                width: `${Math.min(campaign.percent_funded, 100)}%`,
                height: '100%',
                borderRadius: '4px',
              }}
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#555' }}>
            {campaign.donor_count} donor{campaign.donor_count !== 1 ? 's' : ''}
            {campaign.deadline && ` · Deadline: ${new Date(campaign.deadline).toLocaleDateString()}`}
          </p>
        </div>
        <PaymentPanel campaignId={campaign.id} />
      </div>
    </div>
  );
};

export default ContentPage;
