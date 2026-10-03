import LegalNav from '@/components/LegalNav';
import { Truck, FileText, PackageCheck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <header className="legal-header reveal-init">
          <p className="eyebrow eyebrow--accent" style={{ marginBottom: '14px' }}>
            <span className="eyebrow-dot" /> Logistics &amp; Fulfilment
          </p>
          <h1>Shipping &amp; Delivery</h1>
          <p className="legal-subtitle">
            Information regarding delivery areas, shipping timeframes, plant transit care and order handling.
          </p>
          <div className="legal-meta-row">
            <span className="legal-meta-badge">
              <FileText size={13} /> Last updated: [INSERT DATE]
            </span>
            <span className="legal-meta-badge">
              <Truck size={13} /> Delivery Method: Secure Botanical Transit
            </span>
          </div>
        </header>

        <LegalNav />

        <main className="legal-content reveal-init" data-delay="1">
          <div className="legal-callout" style={{ marginBottom: '40px' }}>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Careful Packaging:</strong> Whether delivering microbial tonics, handcrafted planters, or healthy nursery plants, we utilize eco-conscious packaging engineered to prevent breakage and maintain plant vitality during transit.
            </p>
          </div>

          <section className="legal-section" id="delivery-areas">
            <h2>1. Delivery Areas</h2>
            <p>
              My Gardener ships botanical supplies, planters, and living plants across select serviceable regions and metropolitan areas.
            </p>
            <div className="legal-placeholder">
              [INSERT SERVICED CITIES, METRO ZONES &amp; PINCODE COVERAGE]
            </div>
            <p className="legal-subtext">
              Availability is verified automatically when entering your pincode during checkout.
            </p>
          </section>

          <section className="legal-section" id="delivery-timeframes">
            <h2>2. Delivery Timeframes</h2>
            <p>
              Delivery durations vary based on product category (hard goods vs living plants) and destination distance.
            </p>
            <div className="legal-placeholder">
              [INSERT STANDARD DELIVERY TIMEFRAMES (EXPRESS VS STANDARD)]
            </div>
          </section>

          <section className="legal-section" id="shipping-charges">
            <h2>3. Shipping Charges</h2>
            <p>
              Shipping fees are calculated based on parcel weight, package dimensions, and delivery location.
            </p>
            <div className="legal-placeholder">
              [INSERT APPLICABLE SHIPPING RATES &amp; FREE SHIPPING THRESHOLD]
            </div>
          </section>

          <section className="legal-section" id="order-processing">
            <h2>4. Order Processing &amp; Dispatch</h2>
            <p>
              Orders received on business days undergo quality inspection and careful packaging prior to courier handover. Living plants are inspected, watered, and packed immediately before dispatch to minimize transit stress.
            </p>
            <div className="legal-placeholder">
              [INSERT ORDER DISPATCH SCHEDULE &amp; DAILY CUT-OFF TIMES]
            </div>
          </section>

          <section className="legal-section" id="delivery-attempts">
            <h2>5. Delivery Attempts &amp; Access</h2>
            <p>
              Our courier partners attempt delivery up to a standard number of times. Please ensure the provided phone number and address (including flat/house numbers, landmarks, and gate instructions) are accurate.
            </p>
            <p className="legal-subtext">
              If delivery cannot be completed due to incorrect recipient address or unavailability after multiple attempts, returned orders will be processed according to our Cancellation &amp; Refund Policy.
            </p>
          </section>

          <section className="legal-section" id="damaged-packages">
            <h2>6. Damaged Packages</h2>
            <p>
              If your parcel shows visible external crushing, tearing, or wetness upon arrival, please take photos before unboxing. If contents inside are broken or damaged, notify support immediately with photos of the outer label and contents.
            </p>
          </section>

          <section className="legal-section" id="incorrect-missing">
            <h2>7. Incorrect or Missing Products</h2>
            <p>
              If your delivery is missing an item or contains an incorrect product, contact us with your order reference number. We will promptly dispatch the correct item at no additional charge.
            </p>
          </section>

          <section className="legal-section" id="living-plant-delivery">
            <h2>8. Living Plant Delivery &amp; Acclimatization</h2>
            <p>
              Living plants travel in breathable, reinforced packaging designed to keep root soil stable. Upon receiving your plant:
            </p>
            <ul className="legal-list">
              <li>Carefully open the outer carton from the top.</li>
              <li>Remove protective wrap around foliage and root ball.</li>
              <li>Check soil moisture and give the plant gentle indirect sunlight to acclimatize for the first 24–48 hours.</li>
            </ul>
          </section>

          <section className="legal-section" id="delays">
            <h2>9. Delays &amp; Extreme Weather</h2>
            <p>
              Deliveries may experience unforeseen delays during extreme meteorological events (such as intense monsoon downpours or transport strikes). In severe weather cases, plant shipments may be held temporarily at our nursery facility to protect plant health until transit routes normalize.
            </p>
          </section>

          <section className="legal-section" id="contact-tracking">
            <h2>10. Contact &amp; Tracking Assistance</h2>
            <p>
              For order status tracking assistance or shipping inquiries:
            </p>
            <div style={{ marginTop: '16px' }}>
              <p><strong>Support Email:</strong></p>
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
