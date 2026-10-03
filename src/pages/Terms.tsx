import { Link } from 'react-router-dom';
import LegalNav from '@/components/LegalNav';
import { FileText, Shield, ArrowUpRight } from 'lucide-react';

export default function Terms() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <header className="legal-header reveal-init">
          <p className="eyebrow eyebrow--accent" style={{ marginBottom: '14px' }}>
            <span className="eyebrow-dot" /> Terms of Service
          </p>
          <h1>Terms &amp; Conditions</h1>
          <p className="legal-subtitle">
            The terms that apply when you use My Gardener, book services, purchase products or use our platform features.
          </p>
          <div className="legal-meta-row">
            <span className="legal-meta-badge">
              <FileText size={13} /> Last updated: [INSERT DATE]
            </span>
            <span className="legal-meta-badge">
              <Shield size={13} /> Platform: Web &amp; Mobile Service
            </span>
          </div>
        </header>

        <LegalNav />

        <main className="legal-content reveal-init" data-delay="1">
          <div className="legal-callout" style={{ marginBottom: '40px' }}>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Important Notice:</strong> These Terms &amp; Conditions govern the relationship between you and My Gardener. Please read them carefully before booking gardening appointments, subscribing to care plans, or ordering items from our shop.
            </p>
          </div>

          <section className="legal-section" id="introduction">
            <h2>1. Introduction</h2>
            <p>
              These Terms &amp; Conditions govern your access to and use of the My Gardener website, web application, and associated gardening services.
            </p>
            <p>
              My Gardener provides an integrated garden-management platform that may include professional on-site gardening services, garden assessments, recurring care memberships, horticultural products, Green Points loyalty rewards, Garden Dashboard tracking features, Green World local discovery features, and related botanical tools.
            </p>
            <p>
              By accessing any part of the platform, creating an account, scheduling a booking, or making a purchase, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="legal-section" id="account-registration">
            <h2>2. Account Registration</h2>
            <p>
              To access certain features (including booking management, order tracking, and garden history), you may need to register an account. You agree to provide accurate, complete, and current information during registration.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must not create accounts using false identities or impersonate any individual or entity.
            </p>
          </section>

          <section className="legal-section" id="services">
            <h2>3. Services &amp; Live Catalogue</h2>
            <p>
              My Gardener offers on-site professional gardening and plant-care services performed by trained gardening personnel. Current catalogue offerings and baseline pricing are as follows:
            </p>

            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Service Name</th>
                    <th>Price (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Garden Setup</td><td>Indoor Plant Setup</td><td>₹799</td></tr>
                  <tr><td>Garden Setup</td><td>Outdoor Plant Setup</td><td>₹1,499</td></tr>
                  <tr><td>Garden Setup</td><td>Balcony Garden Setup</td><td>₹1,299</td></tr>
                  <tr><td>Garden Setup</td><td>Terrace Garden Setup</td><td>₹2,999</td></tr>
                  <tr><td>Garden Setup</td><td>Kitchen Garden Setup</td><td>₹999</td></tr>
                  <tr><td>Basic Maintenance</td><td>Basic Maintenance</td><td>₹499</td></tr>
                  <tr><td>Basic Maintenance</td><td>Watering</td><td>₹199</td></tr>
                  <tr><td>Basic Maintenance</td><td>Pruning</td><td>₹249</td></tr>
                  <tr><td>Basic Maintenance</td><td>Repotting</td><td>₹349</td></tr>
                  <tr><td>Garden Care</td><td>Garden Care</td><td>₹799</td></tr>
                  <tr><td>Garden Care</td><td>Fertilizer Application</td><td>₹349</td></tr>
                  <tr><td>Garden Care</td><td>Pest Control</td><td>₹499</td></tr>
                  <tr><td>Garden Care</td><td>Plant Health Check</td><td>₹299</td></tr>
                  <tr><td>Garden Care</td><td>Weed Removal</td><td>₹249</td></tr>
                  <tr><td>Lawn &amp; Garden Care</td><td>Lawn &amp; Garden Care</td><td>₹899</td></tr>
                  <tr><td>Lawn &amp; Garden Care</td><td>Mowing</td><td>₹399</td></tr>
                  <tr><td>Lawn &amp; Garden Care</td><td>Hedge Trimming</td><td>₹449</td></tr>
                  <tr><td>Lawn &amp; Garden Care</td><td>Weed Removal</td><td>₹249</td></tr>
                  <tr><td>Assessment / Consultation</td><td>Free Garden Check</td><td>₹0</td></tr>
                  <tr><td>Assessment / Consultation</td><td>Video Consultation</td><td>₹299</td></tr>
                  <tr><td>Assessment / Consultation</td><td>Garden Inspection</td><td>₹599</td></tr>
                  <tr><td>Assessment / Consultation</td><td>Soil Testing Guidance</td><td>₹449</td></tr>
                </tbody>
              </table>
            </div>

            <p className="legal-subtext">
              Service prices are displayed in Indian Rupees (₹) and correspond to our live service catalogue. Any seasonal promotions or location-specific fee adjustments will be presented transparently prior to checkout.
            </p>
          </section>

          <section className="legal-section" id="service-bookings">
            <h2>4. Service Bookings &amp; Scheduling</h2>
            <p>
              When booking a service, you must provide your service selection, preferred date, service address, reachable contact number, and any special garden notes (such as pets, gate access, or water source availability).
            </p>
            <p>Standard service time slots may include:</p>
            <ul className="legal-list">
              <li>9:00 AM</li>
              <li>10:30 AM</li>
              <li>12:00 PM</li>
              <li>2:00 PM</li>
              <li>4:00 PM</li>
              <li>6:00 PM</li>
            </ul>
            <p>
              Service availability may vary based on gardener schedules, territory coverage, and peak seasonal demand. My Gardener reserves the right to reschedule an appointment where inclement weather, worker safety, inaccessible premises, or operational emergencies prevent safe and effective service completion.
            </p>
          </section>

          <section className="legal-section" id="free-garden-check">
            <h2>5. Free Garden Check</h2>
            <p>
              The Free Garden Check is a ₹0 introductory on-site garden walkthrough and assessment designed to inspect plant health, sunlight exposure, soil conditions, and care requirements.
            </p>
            <ul className="legal-list">
              <li><strong>Geographic &amp; Logistical Boundaries:</strong> Free Garden Checks are valid exclusively within designated active service PIN codes and within a maximum operational travel radius of 25 km from My Gardener urban service centers (Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, Chennai). Locations beyond active service boundaries, unserviceable postal PIN codes, or remote premises requiring extended travel are not eligible for complimentary on-site dispatch (a complimentary digital/virtual consultation may be offered at our discretion).</li>
              <li><strong>Household Eligibility:</strong> Strictly limited to one Free Garden Check per phone number, email address, or unique physical premises/household. Repeat claims for the same premises or contact credentials are not eligible.</li>
              <li><strong>Informational Scope:</strong> The Free Garden Check provides an initial 45-minute observational evaluation and care recommendations; it does not constitute physical labor, comprehensive garden overhaul, soil replacement, or landscaping installation, nor does it guarantee specific botanical revival outcomes.</li>
            </ul>
          </section>

          <section className="legal-section" id="membership-plans">
            <h2>6. Membership Plans</h2>
            <p>
              My Gardener offers recurring garden-care membership plans tailored for ongoing stewardship:
            </p>

            <h3>Essential Care — ₹399 / month</h3>
            <ul className="legal-list">
              <li>1 monthly on-site visit</li>
              <li>Seasonal pruning &amp; organic pest check</li>
              <li>5% discount on one-time services</li>
              <li>6 AI plant scans per day</li>
            </ul>

            <h3>Complete Care — ₹799 / month</h3>
            <ul className="legal-list">
              <li>2 monthly on-site visits</li>
              <li>Repotting guidance &amp; bio-tonic feeding</li>
              <li>10% discount on one-time services</li>
              <li>15 AI plant scans per day</li>
              <li>1 complimentary video consultation per month</li>
            </ul>

            <h3>Master Care — ₹1,499 / month</h3>
            <ul className="legal-list">
              <li>4 monthly on-site visits (weekly stewardship)</li>
              <li>Full lawn and terrace management</li>
              <li>15% discount on one-time services</li>
              <li>Unlimited AI plant scans</li>
              <li>VIP priority scheduling and support</li>
            </ul>

            <h3>Custom Care — Bespoke / Tailored Quote</h3>
            <ul className="legal-list">
              <li>Bespoke on-site visit frequency and dedicated schedules</li>
              <li>Custom nutrition, soil rehabilitation and plant health therapy</li>
              <li>Dedicated lead gardener and priority concierge line</li>
              <li>Full terrace, lawn, orchard and landscape management</li>
              <li>Priority emergency and post-storm response</li>
              <li>Customized plant audit and progress reports</li>
            </ul>
          </section>

          <section className="legal-section" id="membership-billing">
            <h2>7. Membership Billing &amp; Cancellation</h2>
            <p>
              Memberships operate on a periodic billing cycle (monthly or as configured during signup). Renewal charges will be processed automatically using your configured payment method unless cancelled prior to the billing date.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL MEMBERSHIP BILLING / CANCELLATION / REFUND TERMS]
            </div>
          </section>

          <section className="legal-section" id="shop-products">
            <h2>8. Shop &amp; Botanical Products</h2>
            <p>
              My Gardener supplies specialized botanical tonics, living plants, planters, and precision tools:
            </p>
            <ul className="legal-list">
              <li><strong>Neerva 1L Microbial Tonic:</strong> ₹249</li>
              <li><strong>BioBloom / Vardhak Flower Booster:</strong> ₹349</li>
              <li><strong>BioRooter Root Starter:</strong> ₹199</li>
              <li><strong>Monstera Deliciosa (Potted Plant):</strong> ₹649</li>
              <li><strong>Snake Plant (Potted Plant):</strong> ₹349</li>
              <li><strong>Bypass Pruner:</strong> ₹499</li>
              <li><strong>Steel Hand Trowel:</strong> ₹249</li>
              <li><strong>Hand-thrown Terracotta Pot:</strong> ₹179</li>
              <li><strong>Matte Ceramic Planter:</strong> ₹549</li>
            </ul>
            <p>
              <strong>Natural Variation Disclaimer:</strong> Living plants are biological specimens. Individual plants naturally vary in leaf shape, size, foliage density, branching structure, and coloration compared to promotional imagery. Such natural biological variations do not constitute product defects. However, damaged, crushed, or diseased plants upon arrival remain fully eligible for replacement under our Refund &amp; Return Policy.
            </p>
          </section>

          <section className="legal-section" id="payments-section">
            <h2>9. Payments &amp; Currency</h2>
            <p>
              All prices are listed in Indian Rupees (INR / ₹) inclusive of applicable taxes unless explicitly indicated otherwise.
            </p>
            <p>
              Payments are processed through authorized payment service providers (e.g. Razorpay). By submitting payment information, you authorize our processing partner to charge the specified amount for your order or membership.
            </p>
          </section>

          <section className="legal-section" id="cancellation-refunds-terms">
            <h2>10. Cancellation, Refunds &amp; Returns</h2>
            <p>
              Detailed terms governing service cancellations, rescheduling windows, membership cancellations, damaged product claims, and refund turnaround times are set forth in our dedicated{' '}
              <Link to="/refunds" className="text-link" style={{ fontSize: '14px', display: 'inline-flex' }}>
                Cancellation, Refund &amp; Return Policy <ArrowUpRight size={13} />
              </Link>
              .
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL CANCELLATION / REFUND / RETURN POLICY]
            </div>
          </section>

          <section className="legal-section" id="green-points">
            <h2>11. Green Points Loyalty Program</h2>
            <p>
              My Gardener may award Green Points on eligible transactions as part of our customer stewardship program:
            </p>
            <ul className="legal-list">
              <li><strong>Earning Rate:</strong> 50 Green Points earned per ₹100 of eligible core service spend.</li>
              <li><strong>Redemption Value:</strong> 1 Green Point = ₹0.10 in store/service credit value.</li>
              <li><strong>Eligible Rewards:</strong> Green Points may be redeemed for service discounts, free nursery plants, or biological tonics.</li>
            </ul>
            <div className="legal-placeholder">
              [INSERT FINAL GREEN POINT EXPIRATION / TRANSFER / REDEMPTION RULES]
            </div>
          </section>

          <section className="legal-section" id="ai-terms">
            <h2>12. AI Plant Health Analysis</h2>
            <p>
              The AI Plant Health Analysis feature provides automated, algorithmic plant-care advice based on user-submitted photos and symptom inputs.
            </p>
            <p>
              AI outputs are provided for educational and general informational purposes only. My Gardener does not warrant or guarantee that AI diagnostic recommendations will prevent plant loss, cure diseases, or substitute for trained professional horticultural judgment. You agree not to upload photos or content that violates copyright or contains private sensitive personal data.
            </p>
          </section>

          <section className="legal-section" id="green-world">
            <h2>13. Green World Discovery</h2>
            <p>
              Green World displays nearby botanical gardens, public parks, nurseries, and plant stores using map integrations and curated directory data.
            </p>
            <p className="legal-subtext">
              Third-party business hours, entry fees, inventory availability, and driving distances are maintained by external sources and may fluctuate. My Gardener does not endorse, control, or warrant the operations or status of independent third-party establishments displayed.
            </p>
          </section>

          <section className="legal-section" id="user-responsibilities">
            <h2>14. User Responsibilities &amp; Fair Use</h2>
            <p>When using My Gardener, you agree not to:</p>
            <ul className="legal-list">
              <li>Provide false, misleading, or deceptive account or booking details</li>
              <li>Interfere with or disrupt platform infrastructure, security protocols, or network integrity</li>
              <li>Abuse, exploit, or attempt unauthorized manipulation of payment systems or Green Points</li>
              <li>Upload malicious code, viruses, or unlawful imagery</li>
              <li>Harass, intimidate, or endanger gardening professionals during on-site visits</li>
              <li>Use platform content or intellectual property for unauthorized commercial reselling</li>
            </ul>
          </section>

          <section className="legal-section" id="intellectual-property">
            <h2>15. Intellectual Property</h2>
            <p>
              All materials on My Gardener—including logos, branding, typography, UI designs, code, written copy, illustrations, and proprietary media—are the intellectual property of My Gardener or its licensors and are protected under applicable copyright, trademark, and intellectual property laws.
            </p>
          </section>

          <section className="legal-section" id="user-content">
            <h2>16. User-Submitted Content</h2>
            <p>
              You retain ownership of the photos, garden logs, and notes you submit to My Gardener. By submitting content, you grant My Gardener a non-exclusive, royalty-free license to use, display, and process such content solely to provide the requested services, maintain your garden history, and operate platform features.
            </p>
          </section>

          <section className="legal-section" id="third-party-dependencies">
            <h2>17. Third-Party Services</h2>
            <p>
              Certain features rely on third-party technologies including payment gateways, AI engines, map providers, and cloud hosting. My Gardener is not liable for intermittent service interruptions originating from third-party provider infrastructure outages.
            </p>
          </section>

          <section className="legal-section" id="service-limitations">
            <h2>18. Service Limitations &amp; Living Organisms</h2>
            <p>
              Gardening and plant cultivation outcomes are fundamentally subject to natural variables beyond human control—including ambient temperature, soil composition, water quality, sunlight exposure, humidity, atmospheric pollution, pest migrations, and owner maintenance between scheduled visits.
            </p>
            <p className="legal-subtext">
              While our gardeners apply professional techniques and quality organic materials, My Gardener does not guarantee unconditional plant survival, specific yield quantities, or bloom timelines.
            </p>
          </section>

          <section className="legal-section" id="weather-safety">
            <h2>19. Weather &amp; Worker Safety</h2>
            <p>
              The safety of our gardening specialists and customers is paramount. In the event of severe weather (heavy rainfall, severe thunderstorms, extreme heat advisories), structural hazards, or aggressive pets on the premises, service appointments may be paused or rescheduled without penalty.
            </p>
          </section>

          <section className="legal-section" id="suspension-termination">
            <h2>20. Account Suspension &amp; Termination</h2>
            <p>
              My Gardener reserves the right to suspend or terminate accounts that engage in fraudulent transactions, repeated abusive behaviour, harassment of personnel, or material breaches of these Terms.
            </p>
          </section>

          <section className="legal-section" id="disclaimers">
            <h2>21. Disclaimers</h2>
            <p>
              The platform and all services and products are provided on an "as is" and "as available" basis without express or implied warranties of any kind, including merchantability, fitness for a particular horticultural purpose, or non-infringement, to the maximum extent permitted by applicable law.
            </p>
          </section>

          <section className="legal-section" id="limitation-of-liability">
            <h2>22. Limitation of Liability</h2>
            <div className="legal-placeholder">
              [FINAL LIMITATION OF LIABILITY CLAUSE TO BE REVIEWED AND APPROVED FOR THE MY GARDENER BUSINESS BY QUALIFIED LEGAL COUNSEL]
            </div>
          </section>

          <section className="legal-section" id="governing-law">
            <h2>23. Governing Law &amp; Jurisdiction</h2>
            <div className="legal-placeholder">
              [INSERT FINAL GOVERNING LAW AND JURISDICTION]
            </div>
          </section>

          <section className="legal-section" id="changes-to-terms">
            <h2>24. Changes to Terms</h2>
            <p>
              We may update these Terms &amp; Conditions periodically. Modifications take effect upon posting to this page. Continued use of the platform following updates constitutes agreement to the amended Terms.
            </p>
          </section>

          <section className="legal-section" id="contact-grievance">
            <h2>25. Contact &amp; Grievance</h2>
            <p>For inquiries, support, or legal grievances regarding these Terms:</p>
            <div style={{ marginTop: '16px' }}>
              <p><strong>Customer Support Email:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--green)' }}>
                <a href="mailto:aadityakandwal2000@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>aadityakandwal2000@gmail.com</a>
              </p>
              <p style={{ marginTop: '10px' }}><strong>Helpline:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--green)' }}>
                <a href="tel:+918847688838" style={{ color: 'inherit', textDecoration: 'underline' }}>+91 88476 88838</a>
              </p>
              <p style={{ marginTop: '10px' }}><strong>Grievance Officer:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--ink)' }}>
                Aaditya Kandwal (aadityakandwal2000@gmail.com)
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
