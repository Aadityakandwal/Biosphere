import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, CheckCircle2, ArrowRight, ShieldCheck, Gift, KeyRound } from 'lucide-react';

export default function WaitlistModal({
  isOpen,
  onClose,
  initialEmail = '',
  title = 'Join the VIP Member Waitlist',
  subtitle = 'We are rolling out private onboarding batches across Punjab. Reserve your priority slot today.',
}: {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  title?: string;
  subtitle?: string;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [gardenType, setGardenType] = useState('Balcony Garden');
  const [submitted, setSubmitted] = useState(false);
  const [vipCode, setVipCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const randomCode = `MG-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
    setVipCode(randomCode);
    setSubmitted(true);
  };

  const handleDemoAccess = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div
      className="search-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 12, 8, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--paper)',
          borderRadius: '20px',
          border: '1px solid var(--line)',
          boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header decoration */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--deep-green) 0%, var(--green) 100%)',
            padding: '28px 24px 24px',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.18)', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            <Sparkles size={12} style={{ color: '#e8c582' }} /> Private Access Alpha
          </div>
          <h3 className="serif" style={{ fontSize: '24px', lineHeight: 1.2, margin: '0 0 6px', color: '#ffffff' }}>
            {submitted ? 'You’re on the Priority List!' : title}
          </h3>
          <p style={{ fontSize: '13px', opacity: 0.85, margin: 0, lineHeight: 1.4 }}>
            {submitted ? 'Check your reservation pass details below.' : subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div>
              <div
                style={{
                  background: 'color-mix(in srgb, var(--green) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--green) 30%, transparent)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={32} style={{ color: 'var(--green)', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--mono)' }}>
                  VIP Priority Pass ID
                </p>
                <div className="mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--green)', letterSpacing: '0.05em' }}>
                  {vipCode}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink)', marginTop: '8px', margin: 0 }}>
                  We’ve reserved your spot. Early invitations include a <strong>₹500 plant tonic voucher</strong> upon official rollout.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleDemoAccess}
                  className="btn btn--lg w-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <KeyRound size={16} /> Explore Member Dashboard Preview <ArrowRight size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="btn btn--outline w-full"
                  style={{ fontSize: '12px', padding: '10px' }}
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '12px' }}>Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aaditya Kandwal"
                  className="form-input"
                  style={{ fontSize: '13.5px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '12px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input"
                  style={{ fontSize: '13.5px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '12px' }}>Garden Space Type</label>
                <select
                  value={gardenType}
                  onChange={(e) => setGardenType(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13.5px' }}
                >
                  <option value="Balcony Garden">Balcony Garden (Potted Collection)</option>
                  <option value="Terrace Garden">Terrace / Rooftop Garden</option>
                  <option value="Backyard / Courtyard">Ground Backyard / Courtyard</option>
                  <option value="Estate / Farmhouse">Estate / Farmhouse Grounds</option>
                </select>
              </div>

              {/* Perks badge */}
              <div style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: 'var(--line-soft)', border: '1px solid var(--line-soft)', alignItems: 'center' }}>
                <Gift size={18} style={{ color: 'var(--terracotta)', flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', color: 'var(--ink)' }}>
                  Includes <strong>₹500 Launch Gift</strong> &amp; free diagnostic plant scan on entry.
                </span>
              </div>

              <button type="submit" className="btn btn--lg w-full" style={{ marginTop: '4px' }}>
                Join Priority Waitlist <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Want an instant preview?</span>
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="text-link"
                  style={{ fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  Explore Demo Portal &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
