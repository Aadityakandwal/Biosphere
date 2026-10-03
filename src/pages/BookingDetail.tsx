import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, LogIn } from 'lucide-react';
import { authService, bookingsService } from '@/services';
import type { Booking } from '@/services';
import { EmptyState } from '@/components/UI';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          if (mounted) {
            setSignedIn(false);
            setLoading(false);
          }
          return;
        }

        if (mounted) setSignedIn(true);

        if (!id) {
          if (mounted) setLoading(false);
          return;
        }

        const data = await bookingsService.getBookingById(id);
        if (mounted) setBooking(data);
      } catch (err) {
        console.error('Failed to load booking detail:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading booking…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <EmptyState
            icon={<Calendar size={28} />}
            title="Sign in to view this booking"
            description="Appointment details and assigned horticulturist records are protected and tied to your account."
            action={
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn">Sign in <LogIn size={13} /></Link>
                <Link to="/bookings" className="btn btn--outline">My Bookings</Link>
                <Link to="/signup" className="btn btn--outline">Create account</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <EmptyState
            icon={<Calendar size={28} />}
            title="Booking not found"
            description="We couldn't find the requested appointment in your account records. It may have been modified or cancelled."
            action={
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/bookings" className="btn">Back to bookings</Link>
                <Link to="/services" className="btn btn--outline">Browse services</Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <Link to="/bookings" className="text-link" style={{ marginBottom: '32px' }}><ArrowLeft size={15} /> All bookings</Link>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Booking</p>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{booking.service_name}</h1>
          <span className="mono" style={{ display: 'inline-block', marginTop: '12px', fontSize: '11px', color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{booking.status}</span>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '32px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div>
              <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />Date</p>
              <p style={{ fontSize: '15px' }}>{booking.booking_date}</p>
            </div>
            <div>
              <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />Time</p>
              <p style={{ fontSize: '15px' }}>{booking.booking_time}</p>
            </div>
            <div>
              <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Price</p>
              <p className="mono" style={{ fontSize: '15px', color: 'var(--terracotta)' }}>₹{booking.price}</p>
            </div>
            <div>
              <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Professional</p>
              <p style={{ fontSize: '15px' }}>My Gardener professional</p>
            </div>
          </div>
          <div style={{ padding: '32px 0' }}>
            <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />Address</p>
            <p style={{ fontSize: '15px', lineHeight: 1.6 }}>{booking.address_line}, {booking.city} — {booking.pincode}</p>
          </div>
          {booking.status === 'completed' && (
            <Link to="/bookings/review" className="btn" style={{ marginTop: '20px' }}>Leave a review</Link>
          )}
        </div>
      </section>
    </div>
  );
}
