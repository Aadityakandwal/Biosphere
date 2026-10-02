import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/theme';
import { authService } from '@/services';
import { PageHeader } from '@/components/UI';
import { ArrowLeft, User, Sun, Moon, Monitor, Shield, LogOut, ArrowRight, FileText, ArrowUpRight } from 'lucide-react';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setEmail(session.user.email || '');
        }
      } catch (err) {
        console.error('Failed to get session:', err);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    if (!confirm('Are you sure you want to sign out of your My Gardener account?')) return;
    setSigningOut(true);
    try {
      await authService.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Failed to sign out:', err);
      navigate('/login');
    } finally {
      setSigningOut(false);
    }
  };

  const themeOptions: { value: 'light' | 'dark' | 'system'; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Account Settings"
        title={<>Preferences &amp; <em>settings.</em></>}
        description="Theme customization, account controls, and platform legal policies."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {/* 1. ACCOUNT SECTION */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Account Information</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--green)' }}>Primary Email</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{email || 'Signed in user'}</p>
              </div>
              <Link to="/profile/edit" className="btn btn--outline" style={{ fontSize: '12px', padding: '8px 16px' }}>
                Edit Personal Info <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* 2. APPEARANCE SECTION */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Appearance &amp; Theme</p>
            <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '16px' }}>
              Choose your preferred visual presentation. Warm ivory theme is optimized for daylight reading; dark theme for low-light ambiance.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className="btn"
                    style={{
                      padding: '12px 22px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isSelected ? 'var(--deep-green)' : 'transparent',
                      color: isSelected ? '#f7f1e8' : 'var(--green)',
                      borderColor: isSelected ? 'var(--deep-green)' : 'var(--line)',
                    }}
                  >
                    <Icon size={14} /> {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PRIVACY & LEGAL SECTION */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Privacy &amp; Legal Policies</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/privacy" className="profile-action-row" style={{ padding: '12px 0' }}>
                <FileText size={16} style={{ color: 'var(--green)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>Privacy Policy</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>How your garden data and records are protected</p>
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/terms" className="profile-action-row" style={{ padding: '12px 0' }}>
                <FileText size={16} style={{ color: 'var(--green)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>Terms &amp; Conditions</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Terms governing gardening visits and care plans</p>
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/refunds" className="profile-action-row" style={{ padding: '12px 0' }}>
                <FileText size={16} style={{ color: 'var(--green)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>Refund &amp; Cancellation Policy</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Guidelines on rescheduling, returns and cancellations</p>
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/shipping" className="profile-action-row" style={{ padding: '12px 0' }}>
                <FileText size={16} style={{ color: 'var(--green)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>Shipping &amp; Delivery</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Potted plant transit care and order timeframes</p>
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/support" className="profile-action-row" style={{ padding: '12px 0' }}>
                <Shield size={16} style={{ color: 'var(--green)' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>Official Support &amp; Concierge</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Reach customer help and grievance officer</p>
                </div>
                <ArrowUpRight size={15} style={{ color: 'var(--green)' }} />
              </Link>
            </div>
          </div>

          {/* 4. SECURITY & SESSION CONTROLS */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Security &amp; Session</p>
            <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '20px' }}>
              Your session is securely encrypted with authentication tokens. Sign out if using a shared computer.
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn btn--outline"
              style={{
                borderColor: 'var(--terracotta)',
                color: 'var(--terracotta)',
              }}
            >
              <LogOut size={15} /> {signingOut ? 'Signing out…' : 'Sign Out of Account'}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
