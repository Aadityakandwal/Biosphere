import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Award, Shield, Mail, Phone, MessageSquare, X, Lock, CheckCircle2, Minus, Zap } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { plans } from '@/data/plans';
import { authService, membershipsService, memberApplicationsService } from '@/services';
import { openRazorpayPayment } from '@/lib/razorpay';

export default function Membership() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [gardenType, setGardenType] = useState('Estate / Villa Garden');
  const [customNotes, setCustomNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);
  const [subscribedPlanName, setSubscribedPlanName] = useState<string | null>(null);
  const [authRequiredModal, setAuthRequiredModal] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await authService.getSession();
        if (session?.user?.id) {
          const m = await membershipsService.getActiveMembership(session.user.id);
          if (mounted && m && m.status === 'active') {
            setCurrentPlanId(m.plan_id);
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim() || !customPhone.trim()) {
      setError('Please provide your name, email and phone number.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await memberApplicationsService.submitApplication({
        full_name: customName.trim(),
        email: customEmail.trim().toLowerCase(),
        phone: customPhone.trim(),
        city: 'Custom Inquiry',
        experience: `Garden Type: ${gardenType}. Requirements: ${customNotes.trim() || 'Custom membership inquiry'}`,
        interests: 'Custom Membership Request',
        declaration_accepted: true,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubscribe = async (plan: (typeof plans)[number]) => {
    if (plan.isCustom || typeof plan.price !== 'number') {
      setModalOpen(true);
      return;
    }

    try {
      const session = await authService.getSession();
      if (!session?.user) {
        setAuthRequiredModal(plan.name);
        return;
      }

      setSubscribingPlan(plan.id);
      setError('');

      await openRazorpayPayment({
        amount: plan.price,
        name: `My Gardener — ${plan.name}`,
        description: `${plan.name} (${plan.period}) Membership Plan`,
        prefill: {
          email: session.user.email || '',
        },
        notes: {
          plan_id: plan.id,
          plan_name: plan.name,
          user_id: session.user.id,
        },
        onSuccess: async () => {
          await membershipsService.createMembership(session.user.id, plan.id);
          setSubscribedPlanName(plan.name);
        },
        onDismiss: () => {
          setSubscribingPlan(null);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not initiate Razorpay checkout. Please try again.');
    } finally {
      setSubscribingPlan(null);
    }
  };

  const resetModal = () => {
    setModalOpen(false);
    setSubmitted(false);
    setError('');
  };

  return (
    <div style={{ paddingTop: '72px' }}>
      <PageHeader
        eyebrow="Membership — Care plans"
        title={<>Care that <em>returns</em> with the seasons.</>}
        description="Choose a plan that matches how much attention your garden needs. Every plan includes regular visits, AI plant scans and discounts on one-time services."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* 4 Tactile Membership Cards */}
          <div
            className="reveal-init"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`membership-card ${plan.featured ? 'membership-card--featured' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '36px 28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p
                    className="mono"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: plan.featured ? '#b9cbb4' : plan.isCustom ? 'var(--terracotta)' : 'var(--muted)',
                      fontWeight: 600,
                    }}
                  >
                    {plan.name}
                  </p>
                  {plan.featured && (
                    <span className="glass-pill glass-pill--active" style={{ fontSize: '9px', padding: '4px 10px' }}>
                      <Sparkles size={10} style={{ display: 'inline', marginRight: '4px' }} /> Most Popular
                    </span>
                  )}
                  {plan.isCustom && (
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'color-mix(in srgb, var(--terracotta) 12%, transparent)',
                        color: 'var(--terracotta)',
                        border: '1px solid color-mix(in srgb, var(--terracotta) 25%, transparent)',
                      }}
                    >
                      Bespoke
                    </span>
                  )}
                </div>

                <div style={{ margin: '20px 0 10px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span
                    className="serif"
                    style={{
                      fontSize: plan.isCustom ? '40px' : '48px',
                      color: plan.featured ? '#f7f1e8' : 'var(--green)',
                      lineHeight: 1,
                    }}
                  >
                    {typeof plan.price === 'number' ? `₹${plan.price}` : 'Custom'}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: plan.featured ? '#b9cbb4' : 'var(--muted)',
                      fontFamily: 'var(--sans)',
                    }}
                  >
                    /{plan.period}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: '1.55',
                    color: plan.featured ? '#c4cfc6' : 'var(--muted)',
                    marginBottom: '24px',
                    minHeight: '40px',
                  }}
                >
                  {plan.tagline}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                  {plan.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 0',
                        borderBottom: plan.featured
                          ? '1px solid rgba(247,241,232,0.1)'
                          : '1px solid var(--line-soft)',
                      }}
                    >
                      <Check
                        size={14}
                        style={{
                          color: plan.featured ? '#b9cbb4' : plan.isCustom ? 'var(--terracotta)' : 'var(--green)',
                          marginTop: '2px',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '12.5px', lineHeight: '1.45' }}>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {currentPlanId === plan.id ? (
                  <div
                    style={{
                      marginTop: '28px',
                      padding: '12px',
                      borderRadius: '999px',
                      background: 'color-mix(in srgb, var(--green) 16%, transparent)',
                      border: '1px solid var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'var(--green)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={15} /> Current Active Plan
                  </div>
                ) : plan.isCustom ? (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="btn btn--outline w-full"
                    style={{
                      marginTop: '28px',
                      borderColor: 'var(--green)',
                    }}
                  >
                    {plan.ctaText || 'Request Custom Plan'} <MessageSquare size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribingPlan === plan.id}
                    className={`btn w-full ${plan.featured ? 'btn--light' : ''}`}
                    style={{
                      marginTop: '28px',
                    }}
                  >
                    {subscribingPlan === plan.id ? 'Connecting Razorpay…' : `Choose ${plan.name}`}{' '}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Dedicated Side-by-Side Comparison Matrix Table */}
          <div className="reveal-init" style={{ marginTop: '96px' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <p className="eyebrow" style={{ marginBottom: '10px' }}>Feature Comparison</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: '12px' }}>
                Compare Care Plans in <em>Detail</em>
              </h2>
              <p className="body-copy">
                Transparent specifications across all tiers so you choose exactly the depth of care your plants require.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{
                overflowX: 'auto',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '700px',
                  fontSize: '13px',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)' }}>
                    <th style={{ textAlign: 'left', padding: '16px 12px', fontWeight: 600, width: '28%' }}>
                      Features &amp; Benefits
                    </th>
                    <th style={{ textAlign: 'center', padding: '16px 12px', fontWeight: 600, width: '18%' }}>
                      <div>Essential Care</div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 400, marginTop: '2px' }}>₹399/mo</div>
                    </th>
                    <th style={{ textAlign: 'center', padding: '16px 12px', fontWeight: 600, width: '18%', background: 'rgba(23,61,44,0.04)', borderRadius: '8px 8px 0 0' }}>
                      <div style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> Complete Care
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--terracotta)', fontWeight: 600, marginTop: '2px' }}>₹799/mo</div>
                    </th>
                    <th style={{ textAlign: 'center', padding: '16px 12px', fontWeight: 600, width: '18%' }}>
                      <div>Master Care</div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 400, marginTop: '2px' }}>₹1,499/mo</div>
                    </th>
                    <th style={{ textAlign: 'center', padding: '16px 12px', fontWeight: 600, width: '18%' }}>
                      <div>Custom Care</div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--terracotta)', fontWeight: 400, marginTop: '2px' }}>Bespoke</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Monthly Scheduled Visits', essential: '1 Visit / month', complete: '2 Visits / month', master: '4 Visits (Weekly)', custom: 'Custom Frequency' },
                    { feature: 'AI Plant Health Scans', essential: '6 scans / day', complete: '15 scans / day', master: 'Unlimited scans', custom: 'Unlimited + Agronomist' },
                    { feature: 'Service Discounts', essential: '5% off catalogue', complete: '10% off catalogue', master: '15% off catalogue', custom: 'Bespoke VIP rates' },
                    { feature: 'Pruning & Organic Pest Checks', essential: 'Included', complete: 'Included', master: 'Included', custom: 'Included (Preventative)' },
                    { feature: 'Organic Bio-Tonic Nutrition', essential: 'Guidance', complete: 'Complimentary Feeding', master: 'Comprehensive Nutrition', custom: 'Formulated Soil Regimen' },
                    { feature: 'Repotting & Soil Balancing', essential: 'Standard', complete: 'Included guidance', master: 'Full potting & balancing', custom: 'Full estate stewardship' },
                    { feature: 'Lawn & Terrace Management', essential: '—', complete: 'Basic pruning & care', master: 'Full terrace & lawn care', custom: 'Estate groundskeeping' },
                    { feature: 'Free Video Consultations', essential: '—', complete: '1 free session / month', master: 'On-demand priority', custom: 'Direct concierge line' },
                    { feature: 'Green Points Multiplier', essential: '1x (50 pts / ₹100)', complete: '1.25x Multiplier', master: '1.5x Multiplier', custom: 'VIP Rewards Tier' },
                    { feature: 'Dedicated Lead Gardener', essential: 'Assigned crew', complete: 'Priority gardener', master: 'Senior lead horticulturist', custom: 'Personal head gardener' },
                    { feature: 'Storm & Emergency Support', essential: 'Standard queue', complete: 'Standard queue', master: 'Priority 24h response', custom: 'Instant concierge' },
                  ].map((row, idx) => (
                    <tr
                      key={row.feature}
                      style={{
                        borderBottom: '1px solid var(--line-soft)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                      }}
                    >
                      <td style={{ padding: '14px 12px', fontWeight: 500 }}>{row.feature}</td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--muted)' }}>
                        {row.essential === '—' ? <Minus size={14} style={{ opacity: 0.3 }} /> : row.essential}
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', fontWeight: 600, color: 'var(--green)', background: 'rgba(23,61,44,0.03)' }}>
                        {row.complete === '—' ? <Minus size={14} style={{ opacity: 0.3 }} /> : row.complete}
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--ink)' }}>
                        {row.master}
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', color: 'var(--terracotta)', fontWeight: 500 }}>
                        {row.custom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Value Props & Overview */}
          <div
            className="reveal-init"
            data-delay="2"
            style={{
              marginTop: '80px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            <div className="glass-panel" style={{ padding: '36px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Shield size={18} style={{ color: 'var(--green)' }} />
                <p className="eyebrow">How it works</p>
              </div>
              <h3 style={{ marginBottom: '16px' }}>A plan, not a promise.</h3>
              <p className="body-copy">
                Your membership covers scheduled visits from a My Gardener professional, AI plant health scans, and discounts on any additional services you book. You can change or cancel your plan at any time.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '36px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Award size={18} style={{ color: 'var(--terracotta)' }} />
                <p className="eyebrow">Green Points</p>
              </div>
              <h3 style={{ marginBottom: '16px' }}>Earn as your garden grows.</h3>
              <p className="body-copy">
                Members earn Green Points on every service — 50 points per ₹100 spent. Redeem them for discounts, free nursery plants and tonics.
              </p>
            </div>
          </div>

          <div className="reveal-init" data-delay="3" style={{ marginTop: '56px', textAlign: 'center' }}>
            <Link to="/become-member" className="text-link">
              Want to join our team? Become a member <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Membership Inquiry Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(16, 44, 32, 0.65)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) resetModal();
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '540px',
              background: 'var(--ivory)',
              padding: 'clamp(28px, 5vw, 40px)',
              borderRadius: '12px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={resetModal}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: 'color-mix(in srgb, var(--green) 12%, transparent)',
                    border: '1px solid var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={28} style={{ color: 'var(--green)' }} />
                </div>
                <h2 style={{ fontSize: '28px', color: 'var(--green)', marginBottom: '12px' }}>
                  Custom Request Received
                </h2>
                <p className="body-copy" style={{ margin: '0 auto 24px', fontSize: '14px' }}>
                  Thank you, <strong>{customName}</strong>. Our senior horticulture concierge will review your garden requirements and contact you at <strong>{customPhone}</strong> or <strong>{customEmail}</strong> within 24 business hours.
                </p>
                <button type="button" onClick={resetModal} className="btn">
                  Done
                </button>
              </div>
            ) : (
              <div>
                <p className="eyebrow eyebrow--accent" style={{ marginBottom: '8px' }}>
                  <span className="eyebrow-dot" /> Bespoke Stewardship
                </p>
                <h2 style={{ fontSize: '28px', color: 'var(--green)', marginBottom: '8px' }}>
                  Custom Membership Request
                </h2>
                <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '24px' }}>
                  For estates, expansive terraces, commercial grounds, or unique botanical needs, tell us about your space.
                </p>

                {error && (
                  <p style={{ fontSize: '12.5px', color: 'var(--terracotta)', marginBottom: '16px' }}>
                    {error}
                  </p>
                )}

                <form onSubmit={handleCustomSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-name">Full Name *</label>
                    <input
                      type="text"
                      id="cm-name"
                      className="form-input"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cm-phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="cm-phone"
                        className="form-input"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="Mobile number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cm-email">Email *</label>
                      <input
                        type="email"
                        id="cm-email"
                        className="form-input"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-type">Property / Garden Type</label>
                    <select
                      id="cm-type"
                      className="form-input"
                      value={gardenType}
                      onChange={(e) => setGardenType(e.target.value)}
                    >
                      <option value="Estate / Villa Garden">Estate / Villa Garden</option>
                      <option value="Large Terrace & Lawn">Large Terrace &amp; Lawn</option>
                      <option value="Commercial / Office Greenery">Commercial / Office Greenery</option>
                      <option value="Multi-balcony Residential">Multi-balcony Residential</option>
                      <option value="Farmhouse / Acreage">Farmhouse / Acreage</option>
                      <option value="Other Bespoke Requirement">Other Bespoke Requirement</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cm-notes">Requirements &amp; Preferred Frequency</label>
                    <textarea
                      id="cm-notes"
                      className="form-input"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. 50+ exotic plants, weekly pruning, specialized soil feeding, lawn treatment..."
                      rows={3}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn--lg w-full" disabled={submitting}>
                      {submitting ? 'Submitting Request…' : 'Submit Custom Request'} <ArrowRight size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '18px' }}>
                    <a href="mailto:aadityakandwal2000@gmail.com" className="text-link" style={{ fontSize: '11px' }}>
                      <Mail size={12} /> aadityakandwal2000@gmail.com
                    </a>
                    <a href="tel:+918847688838" className="text-link" style={{ fontSize: '11px' }}>
                      <Phone size={12} /> +91 88476 88838
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Required Modal */}
      {authRequiredModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(16, 44, 32, 0.65)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthRequiredModal(null);
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              background: 'var(--ivory)',
              padding: 'clamp(28px, 5vw, 36px)',
              borderRadius: '12px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setAuthRequiredModal(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'color-mix(in srgb, var(--green) 12%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green)',
              }}
            >
              <Lock size={22} />
            </div>

            <p className="eyebrow" style={{ marginBottom: '6px' }}>Account Required</p>
            <h3 style={{ fontSize: '24px', color: 'var(--green)', marginBottom: '10px' }}>
              Subscribe to {authRequiredModal}
            </h3>
            <p className="body-copy" style={{ fontSize: '13px', marginBottom: '24px' }}>
              Please sign in or create an account to tie your care plan visits, plant records, and Green Points to your personal garden hub.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/signup" className="btn w-full">
                Create Free Account <ArrowRight size={14} />
              </Link>
              <Link to="/login" className="btn btn--outline w-full">
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Confirmed Modal */}
      {subscribedPlanName && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(16, 44, 32, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--ivory)',
              padding: 'clamp(32px, 5vw, 44px)',
              borderRadius: '12px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'color-mix(in srgb, var(--green) 12%, transparent)',
                border: '1px solid var(--green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={28} style={{ color: 'var(--green)' }} />
            </div>

            <p className="eyebrow eyebrow--accent" style={{ marginBottom: '8px' }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> Membership Activated
            </p>
            <h2 style={{ fontSize: '28px', color: 'var(--green)', marginBottom: '12px' }}>
              Welcome to {subscribedPlanName}
            </h2>
            <p className="body-copy" style={{ fontSize: '13.5px', marginBottom: '28px' }}>
              Your Razorpay payment was successful and your care tier is now active. Your dedicated horticulturist visits and Green Points are now accessible in your account hub.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/profile/membership" className="btn">
                View My Care Plan <ArrowRight size={14} />
              </Link>
              <Link to="/profile" className="btn btn--outline">
                Account Hub
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
