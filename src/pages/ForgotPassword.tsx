import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { authService } from '@/services';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <img src="https://images.pexels.com/photos/16682136/pexels-photo-16682136.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Misty garden with topiary" />
        <div className="auth-visual-content">
          <img src="/logo.jpg" alt="My Gardener" style={{ width: '140px', marginBottom: '20px', mixBlendMode: 'screen' }} />
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form">
          {sent ? (
            <>
              <div style={{ width: '56px', height: '56px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Check size={24} style={{ color: 'var(--green)' }} />
              </div>
              <h2>Check your email</h2>
              <p className="body-copy" style={{ marginBottom: '32px' }}>We've sent a password reset link to {email}.</p>
              <Link to="/login" className="btn">Back to sign in <ArrowRight size={15} /></Link>
            </>
          ) : (
            <form onSubmit={handleReset}>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>Reset password</p>
              <h2>Forgot password</h2>
              <p className="body-copy">Enter your email and we'll send you a link to reset your password.</p>
              {error && <p style={{ fontSize: '13px', color: 'var(--terracotta)', marginBottom: '20px', lineHeight: 1.5 }}>{error}</p>}
              <div className="form-group">
                <label className="form-label" htmlFor="fp-email">Email</label>
                <input type="email" id="fp-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <button type="submit" className="btn btn--lg w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'} <ArrowRight size={16} />
              </button>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Link to="/login" className="text-link">Back to sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
