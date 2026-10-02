import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { authService, membershipsService } from '@/services';
import type { Membership } from '@/services';
import { plans } from '@/data/plans';

export default function ProfileMembership() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1200);

    (async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          if (mounted) setLoading(false);
          return;
        }
        if (mounted) {
          setSignedIn(true);
          setLoading(false);
        }

        const timeout = new Promise<null>((r) => setTimeout(() => r(null), 3000));
        const data = await Promise.race([membershipsService.getActiveMembership(session.user.id), timeout]);
        if (mounted && data) {
          setMembership(data);
        }
      } catch (err) {
        console.warn('Failed to load membership:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleCancelMembership = async () => {
    if (!membership) return;
    if (!confirm('Are you sure you want to cancel your ongoing care plan? Your benefits will remain active until the end of your billing cycle.')) {
      return;
    }
    setCancelling(true);
    try {
      await membershipsService.cancelMembership(membership.id);
      setMembership(null);
      setCancelMessage('Your membership has been successfully cancelled.');
    } catch (err) {
      console.error('Failed to cancel membership:', err);
      alert('Could not cancel membership. Please contact concierge support.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading care plan…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh' }}>
        <div className="container">
          <EmptyState
            icon={<Award size={26} />}
            title="Sign in to view your care plan"
            description="Your care membership and scheduled stewardship visits are tied to your account."
            action={<Link to="/login" className="btn">Sign in</Link>}
          />
        </div>
      </div>
    );
  }

  const currentPlan = membership ? plans.find((p) => p.id === membership.plan_id) : null;

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Membership — Care Plan"
        title={<>Your <em>Care Plan.</em></>}
        description="Dedicated garden stewardship with recurring visits, plant feeding and priority support."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {cancelMessage && (
            <div className="legal-callout" style={{ marginBottom: '28px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--green)' }}>{cancelMessage}</p>
            </div>
          )}

          {currentPlan ? (
            <div>
              <div className="panel-green" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p className="eyebrow eyebrow--light">Active Care Plan</p>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(247,241,232,0.15)',
                      color: '#f7f1e8',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Status: {membership?.status}
                  </span>
                </div>

                <h2 style={{ color: '#f7f1e8', fontSize: '38px', marginBottom: '8px' }}>
                  {currentPlan.name}
                </h2>

                <p className="serif" style={{ fontSize: '32px', color: '#b9cbb4', marginBottom: '16px' }}>
                  {typeof currentPlan.price === 'number' ? `₹${currentPlan.price}/${currentPlan.period}` : currentPlan.period}
                </p>

                <p style={{ color: '#c4cfc6', fontSize: '14px', lineHeight: 1.6, maxWidth: '520px', marginBottom: '28px' }}>
                  {currentPlan.tagline}
                </p>

                <div style={{ borderTop: '1px solid rgba(247,241,232,0.15)', paddingTop: '24px' }}>
                  <p className="eyebrow eyebrow--light" style={{ marginBottom: '14px' }}>Included Benefits</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {currentPlan.benefits.map((b) => (
                      <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f7f1e8', fontSize: '13.5px' }}>
                        <Check size={14} style={{ color: '#b9cbb4', flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {membership?.started_at && (
                  <p className="mono" style={{ fontSize: '11px', color: '#aebdaf', marginTop: '28px' }}>
                    Care stewardship active since {new Date(membership.started_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Plan Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <Link to="/membership" className="btn btn--outline">
                  Change Care Tier
                </Link>
                <button
                  type="button"
                  onClick={handleCancelMembership}
                  disabled={cancelling}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--terracotta)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  {cancelling ? 'Cancelling…' : 'Cancel Membership'}
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-feature-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} style={{ color: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '26px', color: 'var(--green)', marginBottom: '10px' }}>
                Your garden can have a dedicated care plan.
              </h3>
              <p className="body-copy" style={{ margin: '0 auto 28px', maxWidth: '480px' }}>
                Enjoy regular scheduled visits from a dedicated specialist, seasonal pruning, bio-tonic feeding, and discounts across all garden services.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/membership" className="btn">
                  Explore Memberships <ArrowRight size={15} />
                </Link>
                <Link to="/free-check" className="btn btn--outline">
                  Book Free Garden Check
                </Link>
              </div>
            </div>
          )}

          {/* Membership Info Box */}
          <div className="glass-panel" style={{ marginTop: '48px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Shield size={18} style={{ color: 'var(--green)' }} />
              <p className="eyebrow">Stewardship Guarantee</p>
            </div>
            <p className="body-copy" style={{ fontSize: '13.5px' }}>
              All care plans are flexible. You can pause, adjust, or cancel your recurring visits at any time without lock-in periods. Visits are scheduled in advance around your availability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
