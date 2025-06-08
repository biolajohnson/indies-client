import React from 'react';

const buttonStyle = {
  border: 'none',
  borderRadius: '8px',
  padding: '12px 20px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  width: '100%',
  marginBottom: '1rem',
};

const ApplePayButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...buttonStyle,
      backgroundColor: '#000',
      fontFamily: 'Helvetica Neue, sans-serif',
    }}
  >
     Pay
  </button>
);

const GooglePayButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...buttonStyle,
      backgroundColor: '#5f6368',
      fontFamily: 'Roboto, sans-serif',
    }}
  >
    <img
      src="https://img.icons8.com/color/24/google-pay.png"
      alt="Google Pay"
      style={{ marginRight: '8px' }}
    />
    Google Pay
  </button>
);

export { ApplePayButton, GooglePayButton };
