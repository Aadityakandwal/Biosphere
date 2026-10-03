import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowLeft, Sparkles, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { authService, greenPointsService } from '@/services';
import type { GreenPointsTransaction } from '@/services';

export default function ProfileGreenPoints() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<GreenPointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

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

        const timeout = new Promise<GreenPointsTransaction[]>((r) => setTimeout(() => r([]), 3000));
        const txns = await Promise.race([greenPointsService.getTransactions(session.user.id), timeout]);
        if (mounted && Array.isArray(txns)) {
          setTransactions(txns);
          setBalance(txns.reduce((sum, t) => sum + (t.points || 0), 0));
        }
      } catch (err) {
        console.warn('Failed to load Green Points:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading Green Points…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <EmptyState
            icon={<Award size={28} />}
            title="Sign in to view your Green Points"
            description="Your Green Points balance, rewards ledger, and monthly membership bonuses are tied to your account."
            action={
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn">Sign in</Link>
                <Link to="/signup" className="btn btn--outline">Create account</Link>
                <Link to="/membership" className="btn btn--outline">Care Memberships</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Rewards & Stewardship"
        title={<>Your <em>Green Points.</em></>}
        description="Earn points on core gardening services and redeem them for care discounts, plants and bio-tonics."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {/* Points Balance Banner */}
          <div className="panel-green" style={{ marginBottom: '40px', padding: 'clamp(32px, 5vw, 48px)' }}>
            <p className="eyebrow eyebrow--light" style={{ marginBottom: '8px' }}>Active Balance</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
              <span className="serif" style={{ fontSize: 'clamp(48px, 8vw, 72px)', color: '#f7f1e8', lineHeight: 1 }}>
                {balance}
              </span>
              <span style={{ fontSize: '15px', color: '#b9cbb4' }}>
                Points (₹{(balance * 0.1).toFixed(2)} Store Credit Value)
              </span>
            </div>
            <p style={{ color: '#c4cfc6', fontSize: '13.5px', marginTop: '16px', maxWidth: '500px', lineHeight: 1.6 }}>
              1 Green Point = ₹0.10 redemption value. Earn 50 Green Points per ₹100 of eligible core service spend.
            </p>
          </div>

          {/* How Points Are Earned Box */}
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles size={18} style={{ color: 'var(--terracotta)' }} />
              <p className="eyebrow">How to Earn &amp; Redeem</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  1. Book Gardening Services
                </p>
                <p className="body-copy" style={{ fontSize: '13px' }}>
                  Every completed maintenance visit, terrace setup, or pruning earns 50 pts per ₹100 spend.
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  2. Automatic Credit
                </p>
                <p className="body-copy" style={{ fontSize: '13px' }}>
                  Points are credited to your account automatically upon service completion.
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  3. Redeem for Rewards
                </p>
                <p className="body-copy" style={{ fontSize: '13px' }}>
                  Apply points at checkout for discounts, free nursery potted plants, or microbial tonics.
                </p>
              </div>
            </div>
          </div>

          {/* Points Ledger / Transaction History */}
          <div style={{ marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Transaction History</p>
            {transactions.length === 0 ? (
              <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--paper)', borderRadius: '8px' }}>
                <p style={{ fontSize: '15px', color: 'var(--green)', fontWeight: 500, marginBottom: '6px' }}>
                  Your Green Points balance is 0.
                </p>
                <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 16px' }}>
                  You haven't earned or redeemed any points yet. Book your first gardening visit to start earning rewards.
                </p>
                <Link to="/services" className="btn" style={{ fontSize: '12px', padding: '8px 16px' }}>
                  Book a Service
                </Link>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {transactions.map((t) => (
                  <div key={t.id} className="profile-action-row">
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--paper)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--terracotta)',
                      }}
                    >
                      <Sparkles size={15} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>
                        {t.description || 'Green Points Activity'}
                      </p>
                      <p style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                        {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="mono" style={{ fontSize: '14px', fontWeight: 600, color: t.points > 0 ? 'var(--green)' : 'var(--terracotta)' }}>
                      {t.points > 0 ? `+${t.points}` : t.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Rewards Catalogue */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Eligible Redemption Rewards</p>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {[
                { title: '₹100 Off One-Time Gardening Service', pts: '1,000 pts' },
                { title: 'Free Potted Nursery Plant (Snake Plant / Syngonium)', pts: '3,000 pts' },
                { title: 'Neerva 1L Microbial Soil Tonic', pts: '2,400 pts' },
                { title: 'Vardhak Flower Booster Tonic', pts: '3,400 pts' },
              ].map((reward) => (
                <div key={reward.title} className="profile-action-row">
                  <ShoppingBag size={18} style={{ color: 'var(--green)' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>{reward.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Redeemable upon checkout</p>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--terracotta)', fontWeight: 600 }}>
                    {reward.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
