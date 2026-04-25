import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BASE_URL } from '../../services/api';

// Lazy-load the Stripe instance once we have the publishable key
let stripePromise = null;
async function getStripe() {
  if (!stripePromise) {
    const res = await fetch(`${BASE_URL}/api/config`);
    const { stripe_publishable_key } = await res.json();
    stripePromise = loadStripe(stripe_publishable_key);
  }
  return stripePromise;
}

// Inner form rendered inside <Elements>
function CheckoutForm({ amount, campaignId, donorInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    setErrorMsg('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <p style={{ fontSize: '1.2rem' }}>Thank you for your donation!</p>
        <p style={{ color: '#777' }}>${amount} will go to this campaign.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMsg && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.85rem' }}>{errorMsg}</p>}
      <button
        type="submit"
        disabled={!stripe || status === 'processing'}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          background: status === 'processing' ? '#aaa' : '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: status === 'processing' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'processing' ? 'Processing…' : `Donate $${amount}`}
      </button>
    </form>
  );
}

// Outer panel — collects amount + donor info, then creates the PaymentIntent
export default function PaymentPanel({ campaignId }) {
  const [amount, setAmount] = useState('25');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    getStripe().then(setStripe).catch(() => setLoadError('Could not load payment provider.'));
  }, []);

  const handleBegin = async (e) => {
    e.preventDefault();
    setLoadError('');
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount < 1) {
      setLoadError('Amount must be at least $1.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          amount: parsedAmount,
          donor_name: donorName,
          donor_email: donorEmail,
          message,
          is_anonymous: isAnonymous,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment.');
      setClientSecret(data.client_secret);
    } catch (err) {
      setLoadError(err.message);
    }
  };

  if (clientSecret && stripe) {
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Complete your donation</h3>
        <Elements stripe={stripe} options={{ clientSecret }}>
          <CheckoutForm
            amount={parseFloat(amount).toFixed(2)}
            campaignId={campaignId}
            donorInfo={{ donorName, donorEmail, message, isAnonymous }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Back this campaign</h3>
      <form onSubmit={handleBegin}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount ($)</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {['10', '25', '50', '100'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: amount === preset ? '#222' : '#f0f0f0',
                  color: amount === preset ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ${preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email *</label>
          <input
            type="email"
            required
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Name (optional)</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="anon"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anon" style={{ fontSize: '0.85rem' }}>Donate anonymously</label>
        </div>

        {loadError && <p style={{ color: 'red', fontSize: '0.85rem' }}>{loadError}</p>}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Continue to payment
        </button>
      </form>
    </div>
  );
}
