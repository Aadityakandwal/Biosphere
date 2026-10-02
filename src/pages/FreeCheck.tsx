import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Leaf } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { authService, bookingsService } from '@/services';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const STEPS = ['Eligibility', 'Details', 'Address', 'Date', 'Time', 'Confirmation'] as const;

export default function FreeCheck() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const canProceed = () => {
    if (step === 1) return name.trim() && phone.trim() && email.trim();
    if (step === 2) return address.trim() && city.trim() && pincode.trim();
    if (step === 3) return !!date;
    if (step === 4) return !!time;
    return true;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const isEligible = await bookingsService.checkFreeCheckEligibility(phone, email);
      if (!isEligible) {
        setError('A free garden check has already been claimed with this phone number or email. One free check per registered phone or email.');
        setSubmitting(false);
        return;
      }

      const session = await authService.getSession();
      const userId = session?.user?.id || null;

      await bookingsService.createBooking({
        service_id: 'free-garden-check',
        service_name: 'Free Garden Check',
        price: 0,
        booking_date: date,
        booking_time: time,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        address_line: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        user_id: userId,
        status: 'confirmed',
      });

      setConfirmed(true);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', margin: '0 auto 28px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ marginBottom: '16px' }}>Your free check is booked</h1>
          <p className="body-copy" style={{ margin: '0 auto 32px' }}>
            We'll visit your garden on {date} at {time}. A My Gardener professional will spend approximately 45 minutes assessing your space.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/bookings" className="btn">View bookings</Link>
            <Link to="/" className="btn btn--outline">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Free Garden Check"
        title={<>Start with a <em>free assessment.</em></>}
        description="A 45-minute on-site garden assessment, on us. One free check per registered phone or email."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '40px' }}>
            {STEPS.slice(0, 5).map((_, i) => (
              <div key={i} style={{ flex: 1, height: '3px', background: i <= step ? 'var(--green)' : 'var(--line)' }} />
            ))}
          </div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Step {step + 1} of 5 — {STEPS[step]}
          </p>

          {step === 0 && (
            <div>
              <div className="panel-green" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <Leaf size={24} />
                  <span className="serif" style={{ fontSize: '32px' }}>₹0</span>
                  <span style={{ color: '#cad4cb', fontSize: '12px' }}><Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />45 minutes · on-site</span>
                </div>
                <p className="body-copy" style={{ color: '#c4cfc6' }}>
                  A My Gardener professional will walk through your garden, assess your plants and space, and provide a summary of recommendations. This is a no-obligation first visit.
                </p>
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: '16px' }}>What's included</p>
                {['On-site walkthrough of your garden', 'Plant condition overview', 'Space assessment', 'Recommendations summary'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                    <Check size={16} style={{ color: 'var(--green)' }} />
                    <span style={{ fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '24px' }}>
                <Check size={13} style={{ display: 'inline', marginRight: '6px' }} />
                One free check per registered phone or email.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Your details</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-name">Full name</label>
                <input type="text" id="fc-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-phone">Phone number</label>
                <input type="tel" id="fc-phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-email">Email</label>
                <input type="email" id="fc-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Garden address</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-address">Address line</label>
                <textarea id="fc-address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, area" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fc-city">City</label>
                  <input type="text" id="fc-city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fc-pincode">Pincode</label>
                  <input type="text" id="fc-pincode" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Select a date</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>Choose your preferred date for the assessment.</p>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-date">Date</label>
                <input type="date" id="fc-date" className="form-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
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
              {error && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '20px' }}>{error}</p>}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            {step > 0 ? (
              <button className="btn btn--outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <Link to="/" className="btn btn--outline">
                <ArrowLeft size={15} /> Cancel
              </Link>
            )}
            {step < 4 ? (
              <button className="btn" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn" onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Confirming…' : 'Confirm free check'}
              </button>
            )}
          </div>
          {error && step !== 4 && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '16px' }}>{error}</p>}
        </div>
      </section>
    </div>
  );
}
