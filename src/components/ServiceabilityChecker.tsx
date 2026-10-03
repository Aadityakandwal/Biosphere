import { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

// Configured service zones and pincode prefixes in Amritsar and surrounding Punjab regions
const COVERED_ZONES = [
  {
    city: 'Amritsar Core & Civil Lines',
    prefixes: ['143001', '143002', '143003', '143004', '143005', '143006', '143008', '143009'],
    note: 'Full coverage — Next-day visits available (Ranjit Ave, Mall Rd, Cantt, Majitha Rd)',
  },
  {
    city: 'Amritsar Suburban & GT Road',
    prefixes: ['143101', '143104', '143105', '143107', '143108', '143501'],
    note: 'Full coverage — Mon–Sat slots (Verka, Chheharta, Vallah, Airport Rd)',
  },
  {
    city: 'Batala & Gurdaspur Corridor',
    prefixes: ['143505', '143506', '143511', '143521'],
    note: 'Selected zones — 24–48h scheduled slots',
  },
  {
    city: 'Tarn Taran & Beas Hubs',
    prefixes: ['143401', '143416', '143201', '143301'],
    note: 'Selected zones — 48h scheduling & setup visits',
  },
  {
    city: 'Jalandhar & Doaba Region',
    prefixes: ['144001', '144002', '144003', '144008', '144022'],
    note: 'Weekly scheduled runs & terrace garden setups',
  },
  {
    city: 'Ludhiana Metro Hub',
    prefixes: ['141001', '141002', '141008', '141012'],
    note: 'Scheduled terrace setups & estate maintenance',
  },
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
  const [waitlistInput, setWaitlistInput] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim().replace(/\s+/g, '');
    if (cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      return;
    }

    setStatus('checking');
    setTimeout(() => {
      // Check full pincode match or prefix match
      const match = COVERED_ZONES.find((zone) =>
        zone.prefixes.some((prefix) => cleanPin.startsWith(prefix) || prefix.startsWith(cleanPin))
      );

      // Also general 143xxx prefix is in Amritsar division
      if (match) {
        setMatchedCity(match.city);
        setMatchedNote(match.note);
        setStatus('available');
      } else if (cleanPin.startsWith('143')) {
        setMatchedCity('Amritsar District & Surrounding Region');
        setMatchedNote('Active territory — Mon–Sat on-site slots available');
        setStatus('available');
      } else {
        setStatus('unavailable');
      }
    }, 350);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistInput.trim()) {
      try {
        const existing = JSON.parse(localStorage.getItem('mg_expansion_waitlist') || '[]');
        existing.push({
          contact: waitlistInput.trim(),
          pincode,
          date: new Date().toISOString(),
        });
        localStorage.setItem('mg_expansion_waitlist', JSON.stringify(existing));
      } catch {
        // storage fallback
      }
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
        Enter your 6-digit postal PIN code to verify on-site gardener dispatch across Amritsar and Punjab.
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
          placeholder="Enter 6-digit PIN code (e.g. 143001)"
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
            padding: '18px 20px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--green) 10%, transparent)',
            border: '1px solid var(--green)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <CheckCircle2 size={20} style={{ color: 'var(--green)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)', margin: '0 0 4px' }}>
              My Gardener is active in {matchedCity}!
            </p>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 14px', lineHeight: '1.5' }}>
              {matchedNote}. You can book single services, monthly stewardship plans, or schedule a ₹0 Free Garden Check.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/free-check" className="btn" style={{ padding: '7px 16px', fontSize: '11.5px' }}>
                Book Free Check (₹0) <ArrowRight size={12} />
              </Link>
              <Link to="/services" className="btn btn--outline" style={{ padding: '7px 16px', fontSize: '11.5px' }}>
                View Services Catalogue
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Unavailable State with High-Converting Waitlist Lead Capture */}
      {status === 'unavailable' && (
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(200, 117, 88, 0.07)',
            border: '1px solid rgba(200, 117, 88, 0.28)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <AlertCircle size={20} style={{ color: 'var(--terracotta)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--terracotta)', margin: '0 0 4px' }}>
                On-site dispatch not yet active in PIN {pincode}
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0, lineHeight: '1.5' }}>
                We currently dispatch certified horticulturists across Amritsar and surrounding Punjab zones. Our team is expanding rapidly — join our priority expansion list and receive a <strong>₹200 discount voucher</strong> on your first service when we launch in your area.
              </p>
            </div>
          </div>

          {!waitlistSubmitted ? (
            <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={waitlistInput}
                onChange={(e) => setWaitlistInput(e.target.value)}
                placeholder="Enter email or mobile number"
                aria-label="Email or mobile number for priority launch notification"
                required
                style={{
                  flex: '1',
                  minWidth: '220px',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  fontSize: '12.5px',
                  color: 'var(--ink)',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn" style={{ padding: '9px 18px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                <Gift size={13} style={{ marginRight: '4px' }} /> Join Waitlist &amp; Claim ₹200 Off
              </button>
            </form>
          ) : (
            <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(38, 70, 53, 0.1)', border: '1px solid var(--green)' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--green)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <CheckCircle2 size={15} /> Thank you! You've joined the priority waitlist for PIN {pincode}. We'll notify you and apply your ₹200 voucher at launch.
              </p>
            </div>
          )}

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--line-soft)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="text-link" style={{ fontSize: '12px' }}>
              Order plants &amp; tonics (Nationwide Delivery) <ArrowRight size={12} />
            </Link>
            <Link to="/free-check" className="text-link" style={{ fontSize: '12px' }}>
              Book Remote Video Assessment <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* Currently served Punjab hubs summary */}
      {status === 'idle' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px', alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: '10.5px', color: 'var(--muted)', marginRight: '6px' }}>
            Active Punjab Hubs:
          </span>
          {[
            'Amritsar Urban & Cantt (143001-009)',
            'Ranjit Ave & Majitha Rd',
            'GT Road Corridor (143101-501)',
            'Batala & Gurdaspur (143505)',
            'Tarn Taran & Beas (143401)',
            'Jalandhar (144xxx)',
            'Ludhiana (141xxx)',
          ].map((h) => (
            <span
              key={h}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'var(--line-soft)',
                color: 'var(--muted)',
                border: '1px solid var(--line-soft)',
              }}
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
