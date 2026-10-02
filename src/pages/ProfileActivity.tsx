import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, Award, Sparkles, ArrowLeft, ArrowUpRight, Clock, MapPin, Package } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { authService, bookingsService, ordersService, membershipsService, greenPointsService } from '@/services';
import type { Booking, Order, Membership, GreenPointsTransaction } from '@/services';
import { plans } from '@/data/plans';

type TabKey = 'all' | 'bookings' | 'orders' | 'membership' | 'green-points';

export default function ProfileActivity() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [pointsTransactions, setPointsTransactions] = useState<GreenPointsTransaction[]>([]);
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
        const uid = session.user.id;

        const timeout = (ms: number) => new Promise<null>((r) => setTimeout(() => r(null), ms));
        const [b, o, m, p] = await Promise.allSettled([
          Promise.race([bookingsService.getUserBookings(uid), timeout(3000)]),
          Promise.race([ordersService.getUserOrders(uid), timeout(3000)]),
          Promise.race([membershipsService.getActiveMembership(uid), timeout(3000)]),
          Promise.race([greenPointsService.getTransactions(uid), timeout(3000)]),
        ]);

        if (mounted) {
          if (b.status === 'fulfilled' && Array.isArray(b.value)) setBookings(b.value);
          if (o.status === 'fulfilled' && Array.isArray(o.value)) setOrders(o.value);
          if (m.status === 'fulfilled' && m.value) setMembership(m.value as Membership);
          if (p.status === 'fulfilled' && Array.isArray(p.value)) setPointsTransactions(p.value);
        }
      } catch (err) {
        console.warn('Failed to load activity:', err);
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
        <div className="loading-state">Loading account activity…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh' }}>
        <div className="container">
          <EmptyState
            icon={<Calendar size={26} />}
            title="Sign in to view your activity"
            description="Your visits, bookings, orders and rewards history are tied to your account."
            action={<Link to="/login" className="btn">Sign in</Link>}
          />
        </div>
      </div>
    );
  }

  const activePlan = membership ? plans.find((p) => p.id === membership.plan_id) : null;

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Account History"
        title={<>Visits, orders &amp; <em>activity.</em></>}
        description="A complete chronological record of your gardening appointments, shop orders and rewards."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {/* Segmented Tab Navigation */}
          <div className="profile-tab-bar" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`profile-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Activity
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'bookings'}
              className={`profile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Visits ({bookings.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'orders'}
              className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'membership'}
              className={`profile-tab-btn ${activeTab === 'membership' ? 'active' : ''}`}
              onClick={() => setActiveTab('membership')}
            >
              Care Plan {activePlan ? '· Active' : ''}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'green-points'}
              className={`profile-tab-btn ${activeTab === 'green-points' ? 'active' : ''}`}
              onClick={() => setActiveTab('green-points')}
            >
              Green Points ({pointsTransactions.length})
            </button>
          </div>

          {/* Tab 1: Visits & Bookings */}
          {(activeTab === 'all' || activeTab === 'bookings') && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} style={{ color: 'var(--green)' }} /> Gardening Visits &amp; Bookings
                </p>
                <Link to="/services" className="text-link" style={{ fontSize: '11px' }}>
                  Book new visit →
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--paper)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--green)', fontWeight: 500, marginBottom: '6px' }}>
                    No visits booked yet.
                  </p>
                  <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 16px' }}>
                    Schedule maintenance, plant setups, or a ₹0 Free Garden Check.
                  </p>
                  <Link to="/services" className="btn" style={{ fontSize: '12px', padding: '8px 16px' }}>
                    Explore Services
                  </Link>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {bookings.map((b) => (
                    <Link
                      key={b.id}
                      to={`/bookings/${b.id}`}
                      className="profile-action-row"
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--paper)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--green)',
                        }}
                      >
                        <Calendar size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>
                            {b.service_name}
                          </p>
                          <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
                            {b.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {b.booking_date} at {b.booking_time}
                          {b.city && <span> · {b.city}</span>}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="mono" style={{ fontSize: '14px', color: 'var(--green)' }}>
                          ₹{b.price}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--sage)' }}>Details →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Shop Orders */}
          {(activeTab === 'all' || activeTab === 'orders') && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={13} style={{ color: 'var(--green)' }} /> Shop Purchases
                </p>
                <Link to="/shop" className="text-link" style={{ fontSize: '11px' }}>
                  Shop tonics &amp; plants →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--paper)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--green)', fontWeight: 500, marginBottom: '6px' }}>
                    No orders yet.
                  </p>
                  <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 16px' }}>
                    Explore our botanical tonics, potted nursery plants, and handmade terracotta planters.
                  </p>
                  <Link to="/shop" className="btn" style={{ fontSize: '12px', padding: '8px 16px' }}>
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {orders.map((o) => (
                    <div key={o.id} className="profile-action-row">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--paper)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--green)',
                        }}
                      >
                        <Package size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <p className="mono" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)' }}>
                            Order #{o.id.slice(0, 8)}
                          </p>
                          <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
                            {o.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          Placed on {new Date(o.created_at).toLocaleDateString()}
                          {o.address_line && <span> · Delivered to {o.city}</span>}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="mono" style={{ fontSize: '15px', color: 'var(--green)' }}>
                          ₹{o.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Membership Activity */}
          {(activeTab === 'all' || activeTab === 'membership') && (
            <div style={{ marginBottom: '48px' }}>
              <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={13} style={{ color: 'var(--green)' }} /> Care Plan Status
              </p>

              {activePlan ? (
                <div className="panel-green" style={{ padding: '24px 28px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <p className="eyebrow eyebrow--light">Active Plan</p>
                      <h3 style={{ color: '#f7f1e8', fontSize: '24px', margin: '4px 0' }}>{activePlan.name}</h3>
                      <p style={{ color: '#b9cbb4', fontSize: '13px' }}>
                        {typeof activePlan.price === 'number' ? `₹${activePlan.price}/${activePlan.period}` : activePlan.period}
                      </p>
                    </div>
                    <Link to="/profile/membership" className="btn btn--light" style={{ fontSize: '12px', padding: '8px 16px' }}>
                      Manage Care Plan
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--paper)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--green)', fontWeight: 500, marginBottom: '6px' }}>
                    No active care plan.
                  </p>
                  <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 16px' }}>
                    Get recurring monthly visits and organic feeding tailored to your garden.
                  </p>
                  <Link to="/membership" className="btn" style={{ fontSize: '12px', padding: '8px 16px' }}>
                    Explore Memberships
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Green Points Activity */}
          {(activeTab === 'all' || activeTab === 'green-points') && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={13} style={{ color: 'var(--terracotta)' }} /> Green Points Ledger
                </p>
                <Link to="/profile/green-points" className="text-link" style={{ fontSize: '11px' }}>
                  View full rewards →
                </Link>
              </div>

              {pointsTransactions.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--paper)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'var(--green)', fontWeight: 500, marginBottom: '6px' }}>
                    Your Green Points balance is 0.
                  </p>
                  <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 16px' }}>
                    You will automatically earn 50 Green Points for every ₹100 spent on eligible core gardening services.
                  </p>
                  <Link to="/services" className="btn" style={{ fontSize: '12px', padding: '8px 16px' }}>
                    Book a Service to Earn Points
                  </Link>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {pointsTransactions.map((t) => (
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
                          {t.description || 'Green Points Earned'}
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
          )}

        </div>
      </section>
    </div>
  );
}
