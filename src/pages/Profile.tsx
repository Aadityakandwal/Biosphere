import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Leaf,
  Award,
  Calendar,
  ShoppingBag,
  Settings,
  LifeBuoy,
  ArrowRight,
  ArrowUpRight,
  Check,
  Edit3,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import {
  authService,
  profilesService,
  membershipsService,
  bookingsService,
  ordersService,
  greenPointsService,
  plantHealthService,
} from '@/services';
import type { Profile, Membership, Booking, Order, PlantHealthRecord } from '@/services';
import { plans } from '@/data/plans';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [userAuth, setUserAuth] = useState<{ id: string; email: string; fullName?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plants, setPlants] = useState<PlantHealthRecord[]>([]);
  const [greenPoints, setGreenPoints] = useState<number>(0);

  const loadUserData = async (uid: string, email: string, metadataName?: string) => {
    setUserAuth({ id: uid, email, fullName: metadataName });
    setSignedIn(true);
    // Unblock UI immediately so user sees their account hub without waiting
    setLoading(false);

    try {
      // Fetch data in background with safe timeout
      const timeout = (ms: number) => new Promise<null>((r) => setTimeout(() => r(null), ms));

      const [profRes, membRes, bookRes, ordRes, plantRes, pointsRes] = await Promise.allSettled([
        Promise.race([profilesService.getProfile(uid), timeout(3000)]),
        Promise.race([membershipsService.getActiveMembership(uid), timeout(3000)]),
        Promise.race([bookingsService.getUserBookings(uid), timeout(3000)]),
        Promise.race([ordersService.getUserOrders(uid), timeout(3000)]),
        Promise.race([plantHealthService.getUserRecords(uid), timeout(3000)]),
        Promise.race([greenPointsService.getBalance(uid), timeout(3000)]),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value) {
        setProfile(profRes.value as Profile);
      } else if (metadataName) {
        setProfile({
          id: uid,
          full_name: metadataName,
          email: email,
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile);
      }

      if (membRes.status === 'fulfilled' && membRes.value) setMembership(membRes.value as Membership);
      if (bookRes.status === 'fulfilled' && Array.isArray(bookRes.value)) setBookings(bookRes.value);
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value)) setOrders(ordRes.value);
      if (plantRes.status === 'fulfilled' && Array.isArray(plantRes.value)) setPlants(plantRes.value);
      if (pointsRes.status === 'fulfilled' && typeof pointsRes.value === 'number') setGreenPoints(pointsRes.value);
    } catch (err) {
      console.warn('Profile hub data load note:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety fallback: Never keep user stuck on loading screen longer than 1.2 seconds
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1200);

    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          if (mounted) setLoading(false);
          return;
        }

        const uid = session.user.id;
        const email = session.user.email || '';
        const metadataName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
        if (mounted) {
          await loadUserData(uid, email, metadataName);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = authService.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const uid = session.user.id;
        const email = session.user.email || '';
        const metadataName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
        await loadUserData(uid, email, metadataName);
      } else {
        setSignedIn(false);
        setUserAuth(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-state">Loading personal account hub…</div>
      </div>
    );
  }

  if (!signedIn || !userAuth) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div className="empty-state">
            <div className="es-icon"><User size={26} /></div>
            <h3>Sign in to your account</h3>
            <p className="body-copy">
              Access your garden records, care memberships, bookings and orders in one place.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <Link to="/login" className="btn">Sign in</Link>
              <Link to="/signup" className="btn btn--outline">Create account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine display name
  const displayName = profile?.full_name?.trim() || userAuth.fullName?.trim() || userAuth.email.split('@')[0] || 'Gardener';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  // Determine active plan
  const activePlan = membership ? plans.find((p) => p.id === membership.plan_id) : null;

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          
          {/* Profile Header */}
          <div className="profile-hub-header">
            <div className="profile-avatar-row">
              <div className="profile-avatar" aria-hidden="true">
                {initials || <User size={24} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15 }}>
                    {greeting}, <em>{displayName}</em>
                  </h1>
                  {activePlan ? (
                    <span className="profile-status-badge profile-status-badge--member">
                      <Sparkles size={11} /> {activePlan.name} Member
                    </span>
                  ) : (
                    <span className="profile-status-badge">
                      Standard Account
                    </span>
                  )}
                </div>
                <p className="body-copy" style={{ fontSize: '13.5px', marginTop: '6px' }}>
                  Your garden, services and My Gardener account in one place.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12.5px', color: 'var(--muted)' }}>
                  <span>{userAuth.email}</span>
                  {profile?.phone && <span>· {profile.phone}</span>}
                </div>
              </div>
            </div>

            <div>
              <Link to="/profile/edit" className="btn btn--outline" style={{ padding: '10px 18px', fontSize: '12px' }}>
                <Edit3 size={14} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Grid Layout for Hub Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '32px' }}>
            
            {/* 1. MY GARDEN (Major Feature) */}
            <div className="profile-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p className="eyebrow eyebrow--accent">
                    <span className="eyebrow-dot" /> Major Feature
                  </p>
                  <h3 style={{ fontSize: '24px', color: 'var(--green)', marginTop: '4px' }}>My Garden</h3>
                </div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--terracotta)' }}>
                  {plants.length} {plants.length === 1 ? 'Plant' : 'Plants'} Logged
                </span>
              </div>

              <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '20px', flex: 1 }}>
                {plants.length > 0
                  ? `Your living garden journal with ${plants.length} documented specimen${plants.length === 1 ? '' : 's'} and care notes.`
                  : 'Your garden is ready to be documented. Record species, track condition notes, and build your garden passport.'}
              </p>

              {plants.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                  {plants.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--paper)',
                        borderRadius: '6px',
                        border: '1px solid var(--line-soft)',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Leaf size={12} style={{ display: 'inline', marginRight: '6px', color: 'var(--green)' }} />
                      <strong>{p.plant_name || 'Plant'}</strong>
                      {p.condition && <span style={{ color: 'var(--muted)', marginLeft: '6px' }}>· {p.condition}</span>}
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/profile/garden"
                className="btn w-full"
                style={{ justifyContent: 'space-between' }}
              >
                <span>{plants.length > 0 ? 'View Garden Dashboard' : 'Set up My Garden'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* 2. YOUR CARE PLAN (Membership) */}
            <div className="profile-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p className="eyebrow">Stewardship</p>
                  <h3 style={{ fontSize: '24px', color: 'var(--green)', marginTop: '4px' }}>Your Care Plan</h3>
                </div>
                <Award size={20} style={{ color: activePlan ? 'var(--terracotta)' : 'var(--muted)' }} />
              </div>

              {activePlan ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                    <span className="serif" style={{ fontSize: '32px', color: 'var(--green)' }}>{activePlan.name}</span>
                    <span className="mono" style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      {typeof activePlan.price === 'number' ? `₹${activePlan.price}/${activePlan.period}` : activePlan.period}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '12.5px', color: 'var(--ink)' }}>
                    {activePlan.benefits.slice(0, 2).map((b) => (
                      <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                        <Check size={13} style={{ color: 'var(--green)' }} /> {b}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 'auto' }}>
                    <Link to="/profile/membership" className="btn btn--outline w-full" style={{ justifyContent: 'space-between' }}>
                      <span>Manage Care Plan</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '24px', flex: 1 }}>
                    Your garden can have a dedicated care plan with monthly on-site visits, organic plant feeding, and VIP priority scheduling.
                  </p>
                  <Link to="/profile/membership" className="btn btn--outline w-full" style={{ justifyContent: 'space-between' }}>
                    <span>Explore Memberships</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* 3. VISITS & BOOKINGS / RECENT ORDERS SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '40px' }}>
            
            {/* Bookings Overview */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} style={{ color: 'var(--green)' }} />
                  <h3 style={{ fontSize: '19px' }}>Visits &amp; Bookings</h3>
                </div>
                <Link to="/profile/activity" className="text-link" style={{ fontSize: '12px' }}>
                  All activity →
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div style={{ padding: '20px 0' }}>
                  <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '16px' }}>
                    No visits booked yet. Book professional plant setups, pruning, or a Free Garden Check.
                  </p>
                  <Link to="/services" className="btn" style={{ fontSize: '12px', padding: '10px 18px' }}>
                    Explore Services
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {bookings.slice(0, 3).map((b) => (
                    <Link
                      key={b.id}
                      to={`/bookings/${b.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--line-soft)',
                      }}
                    >
                      <div>
                        <p className="serif" style={{ fontSize: '16px', color: 'var(--green)' }}>{b.service_name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {b.booking_date} at {b.booking_time}
                        </p>
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          color: b.status === 'confirmed' ? 'var(--green)' : 'var(--terracotta)',
                        }}
                      >
                        {b.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Overview */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--green)' }} />
                  <h3 style={{ fontSize: '19px' }}>Shop Orders</h3>
                </div>
                <Link to="/shop" className="text-link" style={{ fontSize: '12px' }}>
                  Visit shop →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div style={{ padding: '20px 0' }}>
                  <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '16px' }}>
                    No orders yet. Discover organic microbial tonics, living plants, and handcrafted planters.
                  </p>
                  <Link to="/shop" className="btn" style={{ fontSize: '12px', padding: '10px 18px' }}>
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {orders.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--line-soft)',
                      }}
                    >
                      <div>
                        <p className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>
                          Order #{o.id.slice(0, 8)}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          ₹{o.total} · {new Date(o.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          color: o.status === 'confirmed' || o.status === 'delivered' ? 'var(--green)' : 'var(--terracotta)',
                        }}
                      >
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* 4. GREEN POINTS STRIP */}
          <div
            className="panel-green"
            style={{
              padding: '28px 32px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div>
              <p className="eyebrow eyebrow--light" style={{ marginBottom: '4px' }}>Green Points Balance</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span className="serif" style={{ fontSize: '40px', color: '#f7f1e8', lineHeight: 1 }}>
                  {greenPoints}
                </span>
                <span style={{ fontSize: '13px', color: '#b9cbb4' }}>
                  (₹{(greenPoints * 0.1).toFixed(2)} redemption value)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#c4cfc6', marginTop: '6px' }}>
                50 Green Points earned per ₹100 of eligible core service spend.
              </p>
            </div>
            <Link
              to="/profile/green-points"
              className="btn btn--light"
              style={{ padding: '10px 20px', fontSize: '12px' }}
            >
              View Green Points <ArrowRight size={14} />
            </Link>
          </div>

          {/* 5. ACCOUNT CONCIERGE & SETTINGS SHORTCUTS */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Account Directory</p>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              
              <Link to="/profile/garden" className="profile-action-row">
                <Leaf size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>My Garden Dashboard</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Document plants, view space specifications, and garden passport
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/membership" className="profile-action-row">
                <Award size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Care Plan &amp; Membership</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Manage active care tiers, visit entitlements, or request custom plans
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/activity" className="profile-action-row">
                <Calendar size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Account History &amp; Activity</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Full ledger of scheduled visits, order receipts and points transactions
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/green-points" className="profile-action-row">
                <Sparkles size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Green Points Rewards</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Redeem accrued points for services, plants, and bio-tonics
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/edit" className="profile-action-row">
                <User size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Personal Information</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Update full name, phone number, and service delivery addresses
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/settings" className="profile-action-row">
                <Settings size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Settings &amp; Appearance</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Theme preferences, security, session, and legal documentation
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

              <Link to="/profile/support" className="profile-action-row">
                <LifeBuoy size={18} style={{ color: 'var(--green)' }} />
                <div>
                  <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>Support &amp; Concierge</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    Get direct assistance with visits, plant care, and orders
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--green)' }} />
              </Link>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
