import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, MapPin, User, ShieldCheck, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { allServices, getServiceById } from '@/data/services';
import type { Service } from '@/data/services';
import { authService, bookingsService } from '@/services';
import { openRazorpayPayment } from '@/lib/razorpay';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const STEPS = ['Service Selection', 'Visit Date', 'Time Slot', 'Your Details', 'Service Address', 'Review & Pay', 'Confirmation'] as const;

export default function Booking() {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();

  // Resolve service from path param, query param, or default to first maintenance service
  const queryParamService = searchParams.get('service') || searchParams.get('serviceId');
  const activeServiceId = serviceId || queryParamService || 'basic-maintenance';
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>(activeServiceId);
  const [hasAddon, setHasAddon] = useState<boolean>(false);

  useEffect(() => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    } else if (queryParamService) {
      setSelectedServiceId(queryParamService);
    }
  }, [serviceId, queryParamService]);

  const service: Service = useMemo(() => {
    return getServiceById(selectedServiceId) || allServices[0];
  }, [selectedServiceId]);

  const [step, setStep] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Amritsar');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  // Prefill signed-in user profile if available
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await authService.getSession();
        if (session?.user && mounted) {
          if (session.user.email) setEmail(session.user.email);
          const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
          if (metaName) setName(metaName);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];

  // Pricing & Add-on Calculations
  const isBelowMinOrder = service.price > 0 && service.price < 499 && service.id !== 'video-consultation';
  const addonPrice = 250; // Organic Bio-Tonic Nutrient Booster
  const finalPrice = service.price + (hasAddon ? addonPrice : 0);

  const canProceed = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!date;
    if (step === 2) return !!time;
    if (step === 3) return name.trim() && phone.trim() && email.trim();
    if (step === 4) return address.trim() && city.trim() && pincode.trim().length >= 5;
    return true;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const session = await authService.getSession();
      const userId = session?.user?.id || null;

      const fullServiceName = hasAddon
        ? `${service.name} + Organic Bio-Tonic Booster`
        : service.name;

      const newBooking = await bookingsService.createBooking({
        service_id: service.id,
        service_name: fullServiceName,
        price: finalPrice,
        booking_date: date,
        booking_time: time,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        address_line: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        user_id: userId,
        status: finalPrice === 0 ? 'confirmed' : 'pending_payment',
      });

      if (finalPrice > 0) {
        await openRazorpayPayment({
          amount: finalPrice,
          name: 'My Gardener Service',
          description: `${fullServiceName} — ${date} at ${time}`,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: phone.trim(),
          },
          notes: {
            booking_id: newBooking.id,
            service_name: fullServiceName,
            city: city.trim(),
            pincode: pincode.trim(),
          },
          onSuccess: async () => {
            await bookingsService.updateBookingStatus(newBooking.id, 'confirmed');
            setConfirmed(true);
            setStep(6);
          },
          onDismiss: () => {
            setError('Payment was not completed. Your appointment has been recorded as pending.');
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
      <div style={{ paddingTop: '96px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', margin: '0 auto 28px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ marginBottom: '16px' }}>Booking Confirmed</h1>
          <p className="body-copy" style={{ margin: '0 auto 24px' }}>
            Your <strong>{service.name}</strong> is booked for <strong>{date}</strong> at <strong>{time}</strong>. A certified My Gardener horticulturist has been assigned to your address in {city}.
          </p>
          <div style={{ background: 'var(--paper)', padding: '24px 28px', borderRadius: '12px', border: '1px solid var(--line)', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Service</p><p style={{ fontSize: '14px', fontWeight: 500 }}>{service.name}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Total Amount</p><p className="mono" style={{ fontSize: '14px', color: 'var(--terracotta)', fontWeight: 600 }}>₹{finalPrice}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Visit Date</p><p style={{ fontSize: '14px' }}>{date}</p></div>
              <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Time Slot</p><p style={{ fontSize: '14px' }}>{time}</p></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/bookings" className="btn">View My Bookings</Link>
            <Link to="/" className="btn btn--outline">Back Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <Link to="/services" className="text-link" style={{ marginBottom: '28px' }}>
            <ArrowLeft size={15} /> All Services Catalogue
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>Direct Service Booking</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>{service.name}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>Visit Price</p>
              <p className="serif" style={{ fontSize: '36px', color: 'var(--green)', lineHeight: '1.1' }}>
                ₹{finalPrice}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '36px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
            {STEPS.slice(0, 6).map((_, i) => (
              <div key={i} style={{ flex: 1, height: '3px', background: i <= step ? 'var(--green)' : 'var(--line)' }} />
            ))}
          </div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Step {step + 1} of 6 — {STEPS[step]}
          </p>

          {/* Step 0: Service summary & Selection */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Service Overview</h3>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Switch service below if needed
                </span>
              </div>

              {/* Service Selection Dropdown */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" htmlFor="service-select">Selected Gardening Service</label>
                <select
                  id="service-select"
                  className="form-input"
                  value={service.id}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  style={{ background: 'var(--paper)', cursor: 'pointer' }}
                >
                  {allServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--line)', background: 'var(--paper)' }}>
                <p style={{ color: 'var(--ink)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                  {service.description}
                </p>
                
                <p className="eyebrow" style={{ fontSize: '10.5px', marginBottom: '10px' }}>Included in this visit</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {service.includes.map((inc) => (
                    <div key={inc} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                      <Check size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* A La Carte / Minimum Order Value Advisory */}
              {isBelowMinOrder && (
                <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '10px', background: 'rgba(38, 70, 53, 0.05)', border: '1px solid var(--line-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Sparkles size={16} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', margin: '0 0 4px' }}>
                        A La Carte Service ({service.name} — ₹{service.price})
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 10px', lineHeight: '1.5' }}>
                        Standard standalone on-site visits have a minimum dispatch value of ₹499. You can bundle our <strong>Organic Bio-Tonic Nutrient Booster (+₹250)</strong> to reach optimal garden nutrition.
                      </p>
                      <button
                        type="button"
                        onClick={() => setHasAddon(!hasAddon)}
                        className="btn btn--outline"
                        style={{
                          fontSize: '11px',
                          padding: '6px 14px',
                          background: hasAddon ? 'var(--green)' : 'transparent',
                          color: hasAddon ? '#f7f1e8' : 'var(--green)',
                          borderColor: 'var(--green)',
                        }}
                      >
                        {hasAddon ? '✓ Bio-Tonic Booster Added (+₹250)' : '+ Add Bio-Tonic Booster (+₹250)'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Date */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Select visit date</h3>
              <p className="body-copy" style={{ marginBottom: '24px', fontSize: '13.5px' }}>
                Choose your preferred appointment date for horticulturist dispatch in Amritsar &amp; Punjab.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Scheduled Date</label>
                <input type="date" id="date" className="form-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Select a time slot</h3>
              <p className="body-copy" style={{ marginBottom: '24px', fontSize: '13.5px' }}>
                Available 45–90 min service slots for {date}.
              </p>
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
              <p className="mono" style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '20px' }}>
                <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Your assigned horticulturist will arrive within the selected time window.
              </p>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Contact Information</h3>
              <p className="body-copy" style={{ marginBottom: '24px', fontSize: '13.5px' }}>
                We'll send your visit itinerary, gardener ETA tracking, and invoice to these details.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Mobile Phone Number</label>
                <input type="tel" id="phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {step === 4 && (
            <div>
              <h3 style={{ marginBottom: '12px' }}>Service Address</h3>
              <p className="body-copy" style={{ marginBottom: '20px', fontSize: '13.5px' }}>
                Specify your garden location in Amritsar or surrounding Punjab regions.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address line</label>
                <textarea id="address" className="form-input" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House/Flat number, building, colony, street" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City / Region</label>
                  <input type="text" id="city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Amritsar, Batala, Jalandhar" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">Postal PIN Code</label>
                  <input type="text" id="pincode" maxLength={6} className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 143001" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--line-soft)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0 }}>
                  Active territory: Amritsar &amp; Punjab service zones (PIN prefixes 143xxx, 144xxx, 141xxx).
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Review &amp; Confirm Booking</h3>
              <div style={{ background: 'var(--paper)', padding: '24px 28px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}><Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />Visit Date</p><p style={{ fontSize: '14px', fontWeight: 500 }}>{date}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}><Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />Time Slot</p><p style={{ fontSize: '14px', fontWeight: 500 }}>{time}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}><User size={11} style={{ display: 'inline', marginRight: '4px' }} />Customer</p><p style={{ fontSize: '14px' }}>{name}</p></div>
                  <div><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Mobile Phone</p><p style={{ fontSize: '14px' }}>{phone}</p></div>
                  <div style={{ gridColumn: '1 / -1' }}><p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />Location</p><p style={{ fontSize: '14px' }}>{address}, {city} — {pincode}</p></div>
                  <div>
                    <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Service Booked</p>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{service.name}</p>
                    {hasAddon && <p style={{ fontSize: '11px', color: 'var(--green)', margin: '2px 0 0' }}>+ Bio-Tonic Nutrient Booster (₹250)</p>}
                  </div>
                  <div>
                    <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>Total Amount</p>
                    <p className="mono" style={{ fontSize: '20px', color: 'var(--terracotta)', fontWeight: 600 }}>₹{finalPrice}</p>
                  </div>
                </div>
              </div>
              {finalPrice > 0 && (
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
                  Secure payment via Razorpay (UPI, Netbanking, Cards) will launch upon confirmation.
                </p>
              )}
              {error && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '16px' }}>{error}</p>}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
            {step > 0 ? (
              <button className="btn btn--outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <Link to="/services" className="btn btn--outline">
                <ArrowLeft size={15} /> Cancel
              </Link>
            )}
            {step < 5 ? (
              <button className="btn" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn" onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Confirming…' : finalPrice === 0 ? 'Confirm Booking (₹0)' : `Pay ₹${finalPrice} & Confirm`}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
