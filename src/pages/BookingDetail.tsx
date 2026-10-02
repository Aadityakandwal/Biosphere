import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { bookingsService } from '@/services';
import type { Booking } from '@/services';
import { NotFound } from '@/components/UI';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }
        const data = await bookingsService.getBookingById(id);
        setBooking(data);
      } catch (err) {
        console.error('Failed to load booking detail:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading booking…</div>
      </div>
    );
  }

  if (!booking) return <NotFound />;

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
