import LegalNav from '@/components/LegalNav';
import { RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

export default function Refunds() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <header className="legal-header reveal-init">
          <p className="eyebrow eyebrow--accent" style={{ marginBottom: '14px' }}>
            <span className="eyebrow-dot" /> Service &amp; Order Policies
          </p>
          <h1>Cancellation, Refund &amp; Return Policy</h1>
          <p className="legal-subtitle">
            Guidelines on cancellations, rescheduling, refunds and returns across My Gardener services, memberships and shop products.
          </p>
          <div className="legal-meta-row">
            <span className="legal-meta-badge">
              <FileText size={13} /> Last updated: [INSERT DATE]
            </span>
            <span className="legal-meta-badge">
              <RotateCcw size={13} /> Policy Scope: Services, Care Plans &amp; Goods
            </span>
          </div>
        </header>

        <LegalNav />

        <main className="legal-content reveal-init" data-delay="1">
          <div className="legal-callout" style={{ marginBottom: '40px' }}>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Fair Stewardship Commitment:</strong> We aim to treat every garden and plant order with exceptional care. When things do not go as planned, our policies are designed to resolve issues promptly and transparently.
            </p>
          </div>

          <section className="legal-section" id="service-cancellation">
            <h2>1. Service Cancellation</h2>
            <p>
              We understand that schedules change. Service bookings can be cancelled through your account dashboard or by contacting customer support.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL SERVICE CANCELLATION TIMEFRAME &amp; FEE POLICY]
            </div>
            <p className="legal-subtext">
              If an appointment is cancelled by My Gardener due to unexpected specialist unavailability or emergency, you will receive an immediate full refund or priority rescheduling option.
            </p>
          </section>

          <section className="legal-section" id="service-rescheduling">
            <h2>2. Service Rescheduling</h2>
            <p>
              Appointments may be rescheduled to any available slot without penalty when requested in advance of the scheduled visit.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL RESCHEDULING NOTICE WINDOW]
            </div>
            <p className="legal-subtext">
              In cases of adverse weather conditions (such as severe rains or extreme heat) or unsafe outdoor conditions, our team will coordinate with you to reschedule at mutual convenience.
            </p>
          </section>

          <section className="legal-section" id="free-garden-check">
            <h2>3. Free Garden Check</h2>
            <p>
              The Free Garden Check is a ₹0 introductory service valid within our active serviceable PIN codes and up to a 25 km operational radius from urban hubs. While no cancellation fee applies, we kindly request at least 4 hours advance notice if you need to reschedule or cancel so our horticulturists can be reassigned to another garden.
            </p>
            <p className="legal-subtext">
              Each user, contact number, and physical household is eligible for exactly one Free Garden Check.
            </p>
          </section>

          <section className="legal-section" id="membership-cancellation">
            <h2>4. Membership Cancellation</h2>
            <p>
              You can cancel your recurring membership plan (Essential Care, Complete Care, or Master Care) at any time through your Profile settings.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL MEMBERSHIP CANCELLATION RULES &amp; BILLING CYCLE CUT-OFF]
            </div>
            <p className="legal-subtext">
              Upon cancellation, your membership benefits (including visit entitlements and discount rates) will remain active until the conclusion of your current paid billing period.
            </p>
          </section>

          <section className="legal-section" id="membership-refunds">
            <h2>5. Membership Refunds</h2>
            <p>
              Membership fees cover allocated personnel availability and recurring care management.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL MEMBERSHIP REFUND POLICY &amp; PRO-RATED CREDIT GUIDELINES]
            </div>
          </section>

          <section className="legal-section" id="shop-orders">
            <h2>6. Shop Orders &amp; Product Cancellation</h2>
            <p>
              Orders placed in the My Gardener shop (tonics, planters, tools, living plants) can be cancelled prior to dispatch. Once an order is handed to our courier partner, it enters the standard delivery and return workflow.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL SHOP ORDER CANCELLATION WINDOW &amp; CUT-OFF TIMES]
            </div>
          </section>

          <section className="legal-section" id="damaged-products">
            <h2>7. Damaged or Incorrect Products</h2>
            <p>
              If a product (planter, pruner, tonic, or tool) arrives damaged, broken, leaked, or differs from what you ordered:
            </p>
            <ul className="legal-list">
              <li>Inspect your package upon delivery.</li>
              <li>Notify customer support within the claim window with clear photographs of the package, shipping label, and damaged item.</li>
              <li>We will arrange a free replacement or a full refund upon verification.</li>
            </ul>
            <div className="legal-placeholder">
              [INSERT FINAL DAMAGED PRODUCT REPORTING WINDOW &amp; REPLACEMENT POLICY]
            </div>
          </section>

          <section className="legal-section" id="living-plants">
            <h2>8. Living Plant Returns &amp; Health Guarantee</h2>
            <p>
              Living plants require special handling during transit and after arrival. We ensure all plants are potted, hydrated, and securely packed prior to dispatch.
            </p>
            <ul className="legal-list">
              <li><strong>Transit Damage:</strong> If a plant arrives with broken main stems, severely crushed foliage, or damaged root ball, share photos within the claim window for a replacement.</li>
              <li><strong>Natural Variation:</strong> Slight variations in leaf count, variegation pattern, or minor lower-leaf yellowing during transit are natural biological reactions and do not constitute defective goods.</li>
            </ul>
            <div className="legal-placeholder">
              [INSERT LIVING PLANT RETURN / REPLACEMENT GUARANTEE POLICY]
            </div>
          </section>

          <section className="legal-section" id="consultation-cancellation">
            <h2>9. Consultation Cancellation</h2>
            <p>
              For Video Consultations (₹299) and Garden Inspections (₹599):
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL CONSULTATION CANCELLATION &amp; MISSED APPOINTMENT POLICY]
            </div>
          </section>

          <section className="legal-section" id="refund-processing">
            <h2>10. Refund Processing &amp; Timelines</h2>
            <p>
              Approved refunds are credited directly back to the original source payment method (bank account, credit/debit card, or UPI via Razorpay).
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL REFUND METHOD &amp; BANK PROCESSING TIMEFRAME]
            </div>
            <p className="legal-subtext">
              Store credits or Green Points adjustments will be reflected immediately in your account dashboard.
            </p>
          </section>

          <section className="legal-section" id="contact">
            <h2>11. Contact Support</h2>
            <p>
              To initiate a cancellation, request a refund, or submit an issue regarding a recent delivery, please contact our support team:
            </p>
            <div style={{ marginTop: '16px' }}>
              <p><strong>Customer Support Email:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--green)' }}>
                <a href="mailto:concierge@mygardener.me" style={{ color: 'inherit', textDecoration: 'underline' }}>concierge@mygardener.me</a>
              </p>
              <p style={{ marginTop: '10px' }}><strong>Helpline:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--green)' }}>
                <a href="tel:+918847688838" style={{ color: 'inherit', textDecoration: 'underline' }}>+91 88476 88838</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
