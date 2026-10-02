import { Link } from 'react-router-dom';
import LegalNav from '@/components/LegalNav';
import { Mail, Phone, Clock, Shield, HelpCircle, Calendar, ShoppingBag, User, ArrowRight } from 'lucide-react';

export default function Support() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <header className="legal-header reveal-init">
          <p className="eyebrow eyebrow--accent" style={{ marginBottom: '14px' }}>
            <span className="eyebrow-dot" /> Help &amp; Concierge
          </p>
          <h1>Support &amp; Contact</h1>
          <p className="legal-subtitle">
            Get in touch with our team for assistance with bookings, orders, memberships, plant care, or account inquiries.
          </p>
        </header>

        <LegalNav />

        <main className="legal-content reveal-init" data-delay="1">
          {/* Quick Help Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <Calendar size={22} style={{ color: 'var(--green)', marginBottom: '14px' }} />
              <p className="serif" style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '6px' }}>Service Bookings</p>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                View upcoming appointments, reschedule visits, or review past service notes.
              </p>
              <Link to="/bookings" className="text-link">
                View bookings <ArrowRight size={13} />
              </Link>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <ShoppingBag size={22} style={{ color: 'var(--green)', marginBottom: '14px' }} />
              <p className="serif" style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '6px' }}>Shop &amp; Orders</p>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Questions regarding plant delivery, microbial tonics, tools, or order returns.
              </p>
              <Link to="/shop" className="text-link">
                Explore shop <ArrowRight size={13} />
              </Link>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <User size={22} style={{ color: 'var(--green)', marginBottom: '14px' }} />
              <p className="serif" style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '6px' }}>Account &amp; Care</p>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Update contact profile, manage memberships, or check Green Points.
              </p>
              <Link to="/profile" className="text-link">
                Your profile <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <section className="legal-section" id="official-contact">
            <h2>Official Contact Information</h2>
            <p>
              For general inquiries, booking support, or business communications, reach our team through the following official channels:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '24px' }}>
              <div style={{ padding: '20px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--green)' }}>
                  <Mail size={16} />
                  <strong style={{ fontSize: '14px' }}>Customer Support Email</strong>
                </div>
                <a
                  href="mailto:aadityakandwal2000@gmail.com"
                  style={{
                    color: 'var(--green)',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    wordBreak: 'break-all',
                  }}
                >
                  aadityakandwal2000@gmail.com
                </a>
              </div>

              <div style={{ padding: '20px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--green)' }}>
                  <Phone size={16} />
                  <strong style={{ fontSize: '14px' }}>Telephone Helpline</strong>
                </div>
                <a
                  href="tel:+918847688838"
                  style={{
                    color: 'var(--green)',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  +91 88476 88838
                </a>
              </div>

              <div style={{ padding: '20px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--green)' }}>
                  <Clock size={16} />
                  <strong style={{ fontSize: '14px' }}>Operational Support Hours</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>
                  Monday – Saturday: 9:00 AM – 7:00 PM IST
                </p>
              </div>

              <div style={{ padding: '20px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--green)' }}>
                  <Shield size={16} />
                  <strong style={{ fontSize: '14px' }}>Grievance &amp; Escalations</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>
                  Aaditya Kandwal · <a href="mailto:aadityakandwal2000@gmail.com" style={{ color: 'var(--green)', textDecoration: 'underline' }}>aadityakandwal2000@gmail.com</a>
                </p>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <p><strong>Privacy Inquiries &amp; Data Rights:</strong></p>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginTop: '4px' }}>
                Direct all data protection and account inquiries to <a href="mailto:aadityakandwal2000@gmail.com" style={{ color: 'var(--green)', textDecoration: 'underline' }}>aadityakandwal2000@gmail.com</a>.
              </p>
            </div>
          </section>

          <section className="legal-section" id="frequently-asked">
            <h2>Common Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  How do I reschedule a garden visit?
                </p>
                <p className="legal-subtext">
                  You can reschedule any confirmed service visit from your Bookings tab at least 12 hours prior to the slot, or message support for immediate assistance.
                </p>
              </div>

              <div>
                <p style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  What happens during the Free Garden Check?
                </p>
                <p className="legal-subtext">
                  Our specialist spends 45 minutes assessing plant species, light conditions, soil moisture, and container spacing, providing you with written care recommendations with zero obligation.
                </p>
              </div>

              <div>
                <p style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                  Can I change my Membership plan?
                </p>
                <p className="legal-subtext">
                  Yes, you can upgrade, downgrade, or cancel your care membership at any time through your Profile under Membership settings.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
