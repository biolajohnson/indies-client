import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, BASE_URL } from '../services/api';
import VideoPlayer from '../components/MediaPlayer/VideoPlayer';
import PaymentPanel from '../components/Payments/PaymentPanel';
import { useAuth } from '../context/AuthContext';

const ContentPage = () => {
  const { id } = useParams();
  const { filmmaker, token } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const pollRef = useRef(null);

  const isOwner = filmmaker && campaign && filmmaker.id === campaign.filmmaker_id;

  const startPolling = (campaignId) => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/video/status`);
        const data = await res.json();
        if (data.status !== 'processing') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setCampaign((prev) => ({
            ...prev,
            video_url: data.video_url,
            video_status: data.status,
          }));
        }
      } catch (_) {}
    }, 3000);
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (campaign?.video_status === 'processing') startPolling(campaign.id);
  }, [campaign?.video_status]);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch(`${BASE_URL}/api/campaigns/${id}/video`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setCampaign((prev) => ({ ...prev, video_url: null, video_status: data.status }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

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

        {campaign.video_status === 'processing' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: '16/9', background: '#f5f5f5', borderRadius: '8px', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <span style={{ color: '#888' }}>Transcoding video — this takes a minute…</span>
          </div>
        ) : campaign.video_status === 'flagged' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: '16/9', background: '#fff3f3', borderRadius: '8px', flexDirection: 'column', gap: '0.75rem', border: '1px solid #f5c6c6' }}>
            <span style={{ fontSize: '1.5rem' }}>🚫</span>
            <span style={{ color: '#c0392b' }}>This video was flagged for review and is not yet public.</span>
          </div>
        ) : campaign.video_url ? (
          <VideoPlayer src={campaign.video_url} />
        ) : isOwner ? (
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', aspectRatio: '16/9', border: '2px dashed #ccc', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', background: '#fafafa', gap: '0.75rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span style={{ fontSize: '1rem', color: '#888' }}>{uploading ? 'Uploading…' : 'Upload video'}</span>
            {uploadError && <span style={{ fontSize: '0.8rem', color: 'red' }}>{uploadError}</span>}
            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} disabled={uploading} />
          </label>
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
