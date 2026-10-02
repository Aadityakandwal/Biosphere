import { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Configured service zones and pincode prefixes in India
const COVERED_ZONES = [
  { city: 'Bengaluru', prefixes: ['560', '561', '562'], note: 'Full coverage — Next-day visits available' },
  { city: 'Delhi NCR (Delhi, Gurgaon, Noida)', prefixes: ['110', '122', '201'], note: 'Full coverage — Standard slots' },
  { city: 'Mumbai & Navi Mumbai', prefixes: ['400', '410'], note: 'Full coverage — Mon–Sat slots' },
  { city: 'Hyderabad', prefixes: ['500', '501', '502'], note: 'Selected zones — 48h scheduling' },
  { city: 'Pune', prefixes: ['411', '412'], note: 'Selected zones — Mon–Sat slots' },
  { city: 'Chennai', prefixes: ['600', '601', '602'], note: 'Selected zones — Mon–Sat slots' },
];

export default function ServiceabilityChecker({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [matchedCity, setMatchedCity] = useState<string>('');
  const [matchedNote, setMatchedNote] = useState<string>('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim().replace(/\s+/g, '');
    if (cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      return;
    }

    setStatus('checking');
    setTimeout(() => {
      const match = COVERED_ZONES.find((zone) =>
        zone.prefixes.some((prefix) => cleanPin.startsWith(prefix))
      );

      if (match) {
        setMatchedCity(match.city);
        setMatchedNote(match.note);
        setStatus('available');
      } else {
        setStatus('unavailable');
      }
    }, 400);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: compact ? '24px' : '36px clamp(24px, 4vw, 40px)',
        borderRadius: '16px',
        border: '1px solid var(--line)',
        background: 'var(--paper)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <MapPin size={18} style={{ color: 'var(--green)' }} />
        <p className="eyebrow" style={{ margin: 0 }}>Service Availability</p>
      </div>

      <h3 style={{ fontSize: compact ? '18px' : '22px', marginBottom: '10px' }}>
        Check coverage in your area
      </h3>
      <p className="body-copy" style={{ fontSize: '13px', marginBottom: '24px' }}>
        Enter your 6-digit postal pincode to verify on-site gardener dispatch availability.
      </p>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '8px', maxWidth: '440px', marginBottom: '20px' }}>
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="Enter 6-digit PIN code"
          aria-label="Postal PIN code"
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--line)',
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
            fontSize: '14px',
            fontFamily: 'var(--mono)',
            color: 'var(--ink)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn"
          disabled={pincode.length !== 6 || status === 'checking'}
          style={{ padding: '10px 20px', fontSize: '12px', whiteSpace: 'nowrap' }}
        >
          {status === 'checking' ? 'Checking…' : 'Check Coverage'}
        </button>
      </form>

      {/* Available State */}
      {status === 'available' && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--green) 10%, transparent)',
            border: '1px solid var(--green)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <CheckCircle2 size={18} style={{ color: 'var(--green)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--green)', margin: '0 0 4px' }}>
              My Gardener is available in {matchedCity}!
            </p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>
              {matchedNote}. You can book single services, monthly stewardship, or schedule a ₹0 Free Garden Check.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/free-check" className="btn" style={{ padding: '6px 14px', fontSize: '11px' }}>
                Book Free Check (₹0) <ArrowRight size={12} />
              </Link>
              <Link to="/services" className="btn btn--outline" style={{ padding: '6px 14px', fontSize: '11px' }}>
                View Services
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Unavailable State with clean waitlist option */}
      {status === 'unavailable' && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '10px',
            background: 'rgba(200, 117, 88, 0.08)',
            border: '1px solid rgba(200, 117, 88, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <AlertCircle size={18} style={{ color: 'var(--terracotta)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--terracotta)', margin: '0 0 4px' }}>
                On-site visits not yet available in PIN {pincode}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                We are actively expanding our certified gardener network across India. Remote video consultations and nationwide Shop deliveries remain available for your location.
              </p>
            </div>
          </div>

          {!waitlistSubmitted ? (
            <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter email to get notified when we launch"
                aria-label="Email for launch notification"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn--outline" style={{ padding: '8px 14px', fontSize: '11px' }}>
                Notify Me
              </button>
            </form>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--green)', margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> You are on the expansion waitlist! We will notify you once coverage launches in {pincode}.
            </p>
          )}
        </div>
      )}

      {/* Currently served cities summary */}
      {status === 'idle' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginRight: '6px' }}>
            Active Metro Hubs:
          </span>
          {COVERED_ZONES.map((z) => (
            <span
              key={z.city}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--line-soft)',
                color: 'var(--muted)',
                border: '1px solid var(--line-soft)',
              }}
            >
              {z.city}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
