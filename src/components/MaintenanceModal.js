import React from 'react';

const MaintenanceModal = ({ onRetry }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(246, 241, 233, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }}>
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '3rem 2.5rem',
      maxWidth: '420px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      border: '1px solid #e8e2d8',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 700, color: '#2f2f2f' }}>
        Back shortly
      </h2>
      <p style={{ margin: '0 0 2rem', color: '#777', fontSize: '0.95rem', lineHeight: 1.6 }}>
        We're doing some maintenance behind the scenes. Sit tight — we'll be back soon.
      </p>
      {onRetry && (
        <button onClick={onRetry} style={{ width: '100%' }}>
          Try again
        </button>
      )}
    </div>
  </div>
);

export default MaintenanceModal;
