import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { authService, bookingsService } from '@/services';
import type { Booking } from '@/services';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }
        setSignedIn(true);
        const data = await bookingsService.getUserBookings(session.user.id);
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading bookings…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <EmptyState
            icon={<Calendar size={28} />}
            title="Sign in to view your bookings"
            description="Your past appointments, upcoming gardener visits, care schedules and address details are tied to your account."
            action={
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn">Sign in</Link>
                <Link to="/services" className="btn btn--outline">Browse services</Link>
                <Link to="/signup" className="btn btn--outline">Create account</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending_payment' || b.status === 'pending');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader eyebrow="Bookings" title={<>Your <em>bookings.</em></>} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '20px' }}>Upcoming</p>
            {upcoming.length === 0 ? (
              <p className="body-copy">No upcoming bookings.</p>
            ) : (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {upcoming.map((b) => (
                  <Link
                    key={b.id}
                    to={`/bookings/${b.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px 8px',
                      borderBottom: '1px solid var(--line-soft)',
                      borderRadius: '4px',
                      transition: 'all 0.25s ease',
                    }}
                    className="hover:pl-4 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div>
                      <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>{b.service_name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{b.booking_date} at {b.booking_time}</p>
                    </div>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', textTransform: 'uppercase' }}>{b.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: '20px' }}>Past</p>
            {past.length === 0 ? (
              <p className="body-copy">No past bookings.</p>
            ) : (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {past.map((b) => (
                  <Link
                    key={b.id}
                    to={`/bookings/${b.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px 8px',
                      borderBottom: '1px solid var(--line-soft)',
                      borderRadius: '4px',
                      transition: 'all 0.25s ease',
                    }}
                    className="hover:pl-4 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div>
                      <p className="serif" style={{ fontSize: '18px', color: 'var(--green)' }}>{b.service_name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{b.booking_date} at {b.booking_time}</p>
                    </div>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>{b.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
