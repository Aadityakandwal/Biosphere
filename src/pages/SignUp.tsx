import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { authService } from '@/services';
import WaitlistModal from '@/components/WaitlistModal';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setConsentError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    setLoading(true);
    setError('');
    setConsentError('');
    try {
      await authService.signUp(email.trim(), password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account. Use Instant Guest Pass below to explore immediately.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-up is in staging preview. Use Instant Guest Pass below.');
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="auth-layout">
        <div className="auth-visual">
          <img src="https://images.pexels.com/photos/24032556/pexels-photo-24032556.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Lush garden with stone pathway" />
          <div className="auth-visual-content">
            <img src="/logo.jpg" alt="My Gardener" style={{ width: '140px', marginBottom: '20px', mixBlendMode: 'screen' }} />
            <p className="serif" style={{ fontSize: '32px', lineHeight: 1.2, maxWidth: '360px' }}>Begin your garden story.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <form className="auth-form" onSubmit={handleSignUp}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p className="eyebrow" style={{ margin: 0 }}>Get started</p>
              <button
                type="button"
                onClick={() => setShowWaitlist(true)}
                className="mono"
                style={{
                  background: 'color-mix(in srgb, var(--green) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--green) 30%, transparent)',
                  color: 'var(--green)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} /> Join VIP Waitlist
              </button>
            </div>
            <h2>Create account</h2>
            <p className="body-copy">Start with a free account to book services, analyze plants and track your garden.</p>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'color-mix(in srgb, var(--terracotta) 10%, transparent)', border: '1px solid var(--terracotta)', marginBottom: '16px' }}>
                <p style={{ fontSize: '12.5px', color: 'var(--terracotta)', margin: '0 0 6px', lineHeight: 1.4 }}>{error}</p>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="text-link"
                  style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 600 }}
                >
                  &rarr; Click here to explore with Instant Demo Guest Pass
                </button>
              </div>
            )}

            {/* Google Sign-in button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              {googleLoading ? 'Connecting Google…' : 'Sign up with Google'}
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
              <label className="form-label" htmlFor="su-email">Email</label>
              <input type="email" id="su-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="su-password">Password</label>
              <input type="password" id="su-password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" required />
            </div>
            <button type="submit" className="btn btn--lg w-full" disabled={loading || googleLoading}>
              {loading ? 'Creating account…' : 'Create account with Email'} <ArrowRight size={16} />
            </button>

            {/* Instant Demo Guest Pass Button */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="btn btn--outline w-full"
              style={{
                marginTop: '12px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderColor: 'var(--line)',
              }}
            >
              <KeyRound size={14} /> Instant Preview with Demo Guest Pass
            </button>
            
            <div className="auth-consent-group">
              <label className="auth-consent-label" htmlFor="su-agree">
                <input
                  type="checkbox"
                  id="su-agree"
                  className="auth-consent-checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setConsentError('');
                  }}
                  aria-invalid={!!consentError}
                  aria-describedby={consentError ? 'su-consent-err' : undefined}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="auth-consent-link" target="_blank" rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="auth-consent-link" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {consentError && (
                <p id="su-consent-err" className="auth-consent-error" role="alert">
                  {consentError}
                </p>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/login" className="text-link">Already have an account? Sign in</Link>
            </div>
          </form>
        </div>
      </div>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        initialEmail={email}
      />
    </>
  );
}
