import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { authService } from '@/services';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.signIn(email.trim(), password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not initialize Google Sign-in.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <img src="https://images.pexels.com/photos/11692284/pexels-photo-11692284.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Lush garden pathway" />
        <div className="auth-visual-content">
          <img src="/logo.jpg" alt="My Gardener" style={{ width: '140px', marginBottom: '20px', mixBlendMode: 'screen' }} />
          <p className="serif" style={{ fontSize: '32px', lineHeight: 1.2, maxWidth: '360px' }}>Your garden, looked after with care.</p>
        </div>
      </div>
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleLogin}>
          <p className="eyebrow" style={{ marginBottom: '16px' }}>Welcome back</p>
          <h2>Sign in</h2>
          <p className="body-copy">Sign in to access your garden dashboard, bookings and orders.</p>
          {error && <p style={{ fontSize: '13px', color: 'var(--terracotta)', marginBottom: '20px', lineHeight: 1.5 }}>{error}</p>}

          {/* Google Sign-in button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="oauth-btn"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '6px',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              fontFamily: 'var(--sans)',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            {googleLoading ? 'Connecting Google…' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              margin: '0 0 20px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--line-soft)' }} />
            <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--mono)' }}>
              or email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line-soft)' }} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          </div>
          <button type="submit" className="btn btn--lg w-full" disabled={loading || googleLoading}>
            {loading ? 'Signing in…' : 'Sign in with Email'} <ArrowRight size={16} />
          </button>
          
          <p className="auth-login-ack">
            By continuing, you acknowledge our{' '}
            <Link to="/terms" className="auth-consent-link">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="auth-consent-link">
              Privacy Policy
            </Link>
            .
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '22px' }}>
            <Link to="/forgot-password" className="text-link">Forgot password?</Link>
            <Link to="/signup" className="text-link">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
