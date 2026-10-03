import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Leaf, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { authService, bookingsService } from '@/services';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const STEPS = ['Eligibility & Scope', 'Your Details', 'Service Address', 'Choose Date', 'Time Slot', 'Confirmation'] as const;

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
    if (step === 2) return address.trim() && city.trim() && pincode.trim().length >= 5;
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
        setError('A free garden check has already been claimed with this phone number or email. One complimentary check per household / registered contact within our serviceable areas.');
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
          <p className="body-copy" style={{ margin: '0 auto 24px' }}>
            We'll visit your garden on {date} at {time}. A My Gardener professional will spend approximately 45 minutes assessing your space.
          </p>
          <div className="legal-callout" style={{ textAlign: 'left', marginBottom: '32px', fontSize: '12px' }}>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              <strong>Logistics Reminder:</strong> On-site dispatch is confirmed for eligible PIN codes within our 25 km city service radius. If your location requires special gate access or parking permits, our dispatch coordinator will reach out before arrival.
            </p>
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
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Free Garden Check"
        title={<>Start with a <em>free assessment.</em></>}
        description="A 45-minute on-site garden assessment at ₹0. Available within serviceable PIN codes & 25 km radius of our city hubs."
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
                  A My Gardener professional will walk through your garden, assess your plants and space, inspect soil health and sunlight, and provide a summary of recommendations. This is a 100% no-obligation introductory visit.
                </p>
              </div>

              <div>
                <p className="eyebrow" style={{ marginBottom: '16px' }}>What's included</p>
                {[
                  'On-site walkthrough of your balcony, terrace, or ground garden',
                  'Plant condition & pest vulnerability overview',
                  'Soil moisture, drainage & sunlight orientation assessment',
                  'Actionable seasonal care recommendations summary',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                    <Check size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Logistical Boundaries Disclaimer */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', marginTop: '28px', border: '1px solid var(--line)', background: 'var(--paper)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={15} style={{ color: 'var(--green)' }} />
                  <span className="eyebrow" style={{ margin: 0, fontSize: '11px' }}>Service Area &amp; Logistical Boundaries</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                  Complimentary on-site visits are available across our active <strong>Amritsar &amp; Punjab service zones</strong> (Ranjit Avenue, Mall Road, Cantonment, Majitha Road, GT Road Corridor, Batala, Tarn Taran, Jalandhar &amp; Ludhiana corridors) within eligible PIN codes up to a <strong>25 km operational radius</strong> from urban service hubs. Strictly limited to <strong>one free check per physical household or registered contact</strong>. Out-of-zone locations are supported with a complimentary virtual video consultation.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Your details</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>
                We'll use this contact information to coordinate your gardener's arrival and send your digital assessment report.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-name">Full name</label>
                <input type="text" id="fc-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-phone">Phone number</label>
                <input type="tel" id="fc-phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-email">Email address</label>
                <input type="email" id="fc-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Garden address</h3>
              <p className="body-copy" style={{ marginBottom: '20px', fontSize: '13px' }}>
                Please specify your exact premises location so we can dispatch the nearest horticulturist.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-address">Address line</label>
                <textarea id="fc-address" className="form-input" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House/Flat number, building name, street, area" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fc-city">City / Region</label>
                  <input type="text" id="fc-city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Amritsar, Jalandhar, Batala" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fc-pincode">Postal PIN code</label>
                  <input type="text" id="fc-pincode" maxLength={6} className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 143001" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--line-soft)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--green)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0, lineHeight: '1.4' }}>
                  On-site dispatch is available across active PIN codes in Amritsar &amp; Punjab within our 25 km operational radius. One free check per household or registered phone/email.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Select a date</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>Choose your preferred date for the on-site garden review.</p>
              <div className="form-group">
                <label className="form-label" htmlFor="fc-date">Date</label>
                <input type="date" id="fc-date" className="form-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Select a time slot</h3>
              <p className="body-copy" style={{ marginBottom: '24px' }}>Available 45-minute slots for {date}.</p>
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
                {submitting ? 'Confirming appointment…' : 'Confirm free check (₹0)'}
              </button>
            )}
          </div>
          {error && step !== 4 && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '16px' }}>{error}</p>}
        </div>
      </section>
    </div>
  );
}
