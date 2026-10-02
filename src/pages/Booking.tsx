import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, MapPin, User } from 'lucide-react';
import { getServiceById } from '@/data/services';
import { authService, bookingsService } from '@/services';
import { NotFound } from '@/components/UI';
import { openRazorpayPayment } from '@/lib/razorpay';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

const STEPS = ['Service', 'Date', 'Time', 'Details', 'Address', 'Review', 'Confirmation'] as const;

export default function Booking() {
  const { serviceId } = useParams();
  const service = serviceId ? getServiceById(serviceId) : undefined;
  const [step, setStep] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  if (!service) return <NotFound />;

  const today = new Date().toISOString().split('T')[0];

  const canProceed = () => {
    if (step === 1) return !!date;
    if (step === 2) return !!time;
    if (step === 3) return name.trim() && phone.trim() && email.trim();
    if (step === 4) return address.trim() && city.trim() && pincode.trim();
    return true;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const session = await authService.getSession();
      const userId = session?.user?.id || null;

      const newBooking = await bookingsService.createBooking({
        service_id: service.id,
        service_name: service.name,
        price: service.price,
        booking_date: date,
        booking_time: time,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        address_line: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        user_id: userId,
        status: service.price === 0 ? 'confirmed' : 'pending_payment',
      });

      if (service.price > 0) {
        await openRazorpayPayment({
          amount: service.price,
          name: 'My Gardener Service',
          description: `${service.name} — ${date} at ${time}`,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: phone.trim(),
          },
          notes: {
            booking_id: newBooking.id,
            service_name: service.name,
          },
          onSuccess: async () => {
            await bookingsService.updateBookingStatus(newBooking.id, 'confirmed');
            setConfirmed(true);
            setStep(6);
          },
          onDismiss: () => {
            setError('Payment was not completed. Your booking is saved as pending.');
            setSubmitting(false);
          },
        });
      } else {
        setConfirmed(true);
        setStep(6);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ paddingTop: '72px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', margin: '0 auto 28px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ marginBottom: '16px' }}>Booking confirmed</h1>
          <p className="body-copy" style={{ margin: '0 auto 32px' }}>
            Your {service.name} is booked for {date} at {time}. We've noted your address in {city}. A My Gardener professional will be assigned to your visit.
          </p>
          <div style={{ background: 'var(--paper)', padding: '28px', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Service</p><p style={{ fontSize: '14px' }}>{service.name}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Price</p><p className="mono" style={{ fontSize: '14px', color: 'var(--terracotta)' }}>₹{service.price}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Date</p><p style={{ fontSize: '14px' }}>{date}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Time</p><p style={{ fontSize: '14px' }}>{time}</p></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/bookings" className="btn">View bookings</Link>
            <Link to="/" className="btn btn--outline">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '72px' }}>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Link to={`/services/${service.id}`} className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={15} /> Service details
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '12px' }}>Booking</p>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>{service.name}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>Price</p>
              <p className="serif" style={{ fontSize: '36px', color: 'var(--green)' }}>₹{service.price}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '48px' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '40px' }}>
            {STEPS.slice(0, 6).map((_, i) => (
              <div key={i} style={{ flex: 1, height: '3px', background: i <= step ? 'var(--green)' : 'var(--line)' }} />
            ))}
          </div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Step {step + 1} of 6 — {STEPS[step]}
          </p>

          {/* Step 0: Service summary */}
          {step === 0 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Confirm your service</h3>
              <div style={{ background: 'var(--paper)', padding: '28px' }}>
                <p className="serif" style={{ fontSize: '22px', color: 'var(--green)', marginBottom: '8px' }}>{service.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>{service.description}</p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line-soft)' }}>
                  <span className="mono" style={{ fontSize: '13px', color: 'var(--terracotta)' }}>₹{service.price}</span>
                  {service.price === 0 && <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>45-minute on-site assessment</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Date */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Select a date</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>Choose your preferred date for the visit.</p>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date</label>
                <input type="date" id="date" className="form-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Select a time slot</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>Available slots for {date}.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className="btn"
                    style={time === slot ? {} : { background: 'var(--paper)', color: 'var(--green)', borderColor: 'var(--line)' }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '20px' }}>
                <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Slot availability is confirmed after booking.
              </p>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Your details</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone number</label>
                <input type="tel" id="phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {step === 4 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Service address</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address line</label>
                <textarea id="address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, area" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input type="text" id="city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">Pincode</label>
                  <input type="text" id="pincode" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Review your booking</h3>
              <div style={{ background: 'var(--paper)', padding: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />Date</p><p style={{ fontSize: '14px' }}>{date}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />Time</p><p style={{ fontSize: '14px' }}>{time}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><User size={11} style={{ display: 'inline', marginRight: '4px' }} />Name</p><p style={{ fontSize: '14px' }}>{name}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Phone</p><p style={{ fontSize: '14px' }}>{phone}</p></div>
                  <div style={{ gridColumn: '1 / -1' }}><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />Address</p><p style={{ fontSize: '14px' }}>{address}, {city} — {pincode}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Service</p><p style={{ fontSize: '14px' }}>{service.name}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>Price</p><p className="mono" style={{ fontSize: '18px', color: 'var(--terracotta)' }}>₹{service.price}</p></div>
                </div>
              </div>
              {service.price > 0 && (
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
                  Payment will be collected via Razorpay after you confirm.
                </p>
              )}
              {error && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '16px' }}>{error}</p>}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            {step > 0 ? (
              <button className="btn btn--outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <Link to={`/services/${service.id}`} className="btn btn--outline">
                <ArrowLeft size={15} /> Cancel
              </Link>
            )}
            {step < 5 ? (
              <button className="btn" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn" onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Confirming…' : service.price === 0 ? 'Confirm booking' : 'Confirm & proceed to payment'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
