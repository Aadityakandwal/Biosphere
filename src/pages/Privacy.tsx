import LegalNav from '@/components/LegalNav';
import { Shield, Lock, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <header className="legal-header reveal-init">
          <p className="eyebrow eyebrow--accent" style={{ marginBottom: '14px' }}>
            <span className="eyebrow-dot" /> Legal &amp; Data Transparency
          </p>
          <h1>Privacy Policy</h1>
          <p className="legal-subtitle">
            How My Gardener collects, uses and protects information when you use our website, app and services.
          </p>
          <div className="legal-meta-row">
            <span className="legal-meta-badge">
              <FileText size={13} /> Last updated: [INSERT DATE]
            </span>
            <span className="legal-meta-badge">
              <Shield size={13} /> Status: Prototype / Pre-Launch Policy
            </span>
          </div>
        </header>

        <LegalNav />

        <main className="legal-content reveal-init" data-delay="1">
          <div className="legal-callout" style={{ marginBottom: '40px' }}>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Pre-Launch Notice:</strong> My Gardener is dedicated to transparent, respectful handling of your data. This document outlines our data practices. Specific corporate entity details, data retention schedules, and regulatory contact identifiers will be finalized upon commercial deployment.
            </p>
          </div>

          <section className="legal-section" id="information-collected">
            <h2>1. Information We Collect</h2>
            <p>
              My Gardener may collect information needed to create and manage your account, provide gardening services, process bookings and orders, and operate features of the platform.
            </p>
            <p>This may include:</p>

            <h3>Account Information</h3>
            <ul className="legal-list">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Authentication information (such as secure credentials)</li>
              <li>Profile information and garden preferences</li>
            </ul>

            <h3>Service Information</h3>
            <ul className="legal-list">
              <li>Services selected</li>
              <li>Booking dates and times</li>
              <li>Service address and premises access notes</li>
              <li>Garden-related information (space size, plant types, conditions)</li>
              <li>Booking and visit history</li>
              <li>Membership plan information</li>
            </ul>

            <h3>Shop &amp; Order Information</h3>
            <ul className="legal-list">
              <li>Products ordered and quantities</li>
              <li>Delivery address and recipient contact information</li>
              <li>Order history and fulfilment status</li>
              <li>Payment status and transaction reference identifiers</li>
            </ul>

            <p className="legal-subtext">
              We only collect information that is relevant to providing, fulfilling or improving the requested services and platform features.
            </p>
          </section>

          <section className="legal-section" id="garden-plant-information">
            <h2>2. Garden &amp; Plant Information</h2>
            <p>
              My Gardener may allow you to provide garden and plant-related information, including:
            </p>
            <ul className="legal-list">
              <li>Plant photographs and specimen images</li>
              <li>Garden photographs (balconies, terraces, indoor spaces, flower beds, lawns)</li>
              <li>Plant species details, watering notes, and health logs</li>
              <li>Garden care preferences and environmental conditions (sunlight, shade, soil type)</li>
              <li>Service-related notes and professional visit logs</li>
              <li>Information stored and tracked in your Garden Dashboard</li>
            </ul>
            <p>
              This information is used exclusively to provide requested garden-management services, maintain ongoing care history, support Garden Dashboard features, and deliver relevant platform functionality. We only collect this information when it is actively requested or provided by you through the applicable feature.
            </p>
          </section>

          <section className="legal-section" id="ai-plant-health">
            <h2>3. AI Plant Health Analysis</h2>
            <p>
              My Gardener may provide an AI-powered Plant Health Analysis feature. When you use this feature, you may provide plant photographs, symptom descriptions, and related garden information for automated analysis.
            </p>
            <div className="legal-callout">
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65 }}>
                <strong>Important Advisory:</strong> AI-generated results are intended solely to provide informational plant-care guidance. AI analysis may be incomplete or inaccurate and should not be treated as a guaranteed scientific diagnosis or definitive horticultural prescription. For critical plant conditions, we recommend booking an on-site inspection with a gardening professional.
              </p>
            </div>
            <p>
              Where an external AI provider (such as Google Gemini or equivalent AI service) is used to process information required for this feature, relevant image and text data may be transmitted to that provider solely to execute the requested analysis.
            </p>
            <div className="legal-placeholder">
              [INSERT PRODUCTION AI SERVICE PROVIDER &amp; DATA PROCESSING / STORAGE SPECIFICATION]
            </div>
            <p className="legal-subtext">
              We do not claim that My Gardener stores or retains AI inputs long-term unless that behaviour has been verified and documented in the live production implementation.
            </p>
          </section>

          <section className="legal-section" id="location-information">
            <h2>4. Location Information</h2>
            <p>
              My Gardener’s Green World feature may use device location information when you grant explicit permission through your browser or device settings.
            </p>
            <p>When permitted, location data is used to help discover nearby:</p>
            <ul className="legal-list">
              <li>Nurseries and plant centres</li>
              <li>Plant shops and boutique greenery stores</li>
              <li>Garden supply and tool stores</li>
              <li>Public parks and historic greens</li>
              <li>Botanical gardens and nature reserves</li>
              <li>Other community green spaces</li>
            </ul>
            <p>
              You may also manually search for a city, neighbourhood or landmark without granting device location access.
            </p>
            <p className="legal-subtext">
              <strong>Notice:</strong> My Gardener does not collect background location data or engage in continuous location tracking. Location is accessed solely in the foreground when you actively interact with discovery or address features.
            </p>
          </section>

          <section className="legal-section" id="how-we-use-information">
            <h2>5. How We Use Information</h2>
            <p>We use the collected information for specific, legitimate operational purposes:</p>
            <ul className="legal-list">
              <li>Creating, authenticating, and managing your user account</li>
              <li>Scheduling, dispatching, and fulfilling on-site gardening services</li>
              <li>Managing ongoing garden-care memberships and visit schedules</li>
              <li>Processing, packaging, and delivering shop orders</li>
              <li>Processing payments securely through authorized payment gateway partners</li>
              <li>Powering the Garden Dashboard and plant tracking tools</li>
              <li>Delivering requested AI Plant Health Analysis reports</li>
              <li>Facilitating Green World map discovery and local search</li>
              <li>Managing and calculating Green Points rewards and redemptions</li>
              <li>Providing responsive customer and horticultural support</li>
              <li>Maintaining platform security, integrity, and preventing fraud or misuse</li>
              <li>Complying with applicable statutory, tax, and legal obligations</li>
            </ul>
          </section>

          <section className="legal-section" id="payments">
            <h2>6. Payments</h2>
            <p>
              Payments on My Gardener are processed through certified third-party payment gateway providers (such as Razorpay).
            </p>
            <p>
              My Gardener receives only transaction-related confirmation tokens, payment IDs, and order completion statuses needed to confirm and manage bookings, memberships, and shop purchases.
            </p>
            <div className="legal-callout">
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65 }}>
                <Lock size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px', color: 'var(--green)' }} />
                <strong>Payment Security:</strong> My Gardener does not store credit card numbers, debit card numbers, CVV codes, net-banking credentials, or UPI PINs on its servers. All sensitive financial data is handled directly by PCI-DSS compliant payment processing partners.
              </p>
            </div>
          </section>

          <section className="legal-section" id="cookies-technical">
            <h2>7. Cookies &amp; Technical Information</h2>
            <p>
              The platform utilizes essential cookies, local browser storage, and session tokens strictly necessary to:
            </p>
            <ul className="legal-list">
              <li>Maintain secure user authentication sessions across page navigation</li>
              <li>Remember interface preferences (such as light/dark display theme)</li>
              <li>Preserve items in your shopping cart during your session</li>
              <li>Maintain essential platform security and prevent CSRF/tampering</li>
            </ul>
            <p className="legal-subtext">
              My Gardener does not deploy third-party advertising trackers, cross-site profiling pixels, or behavioural data broker networks.
            </p>
          </section>

          <section className="legal-section" id="third-party-services">
            <h2>8. Third-Party Services</h2>
            <p>
              To deliver a modern web experience, My Gardener integrates trusted infrastructure providers for specific platform functions:
            </p>
            <ul className="legal-list">
              <li><strong>Authentication &amp; Database:</strong> Cloud database infrastructure (such as Supabase) for secure data storage and auth session management</li>
              <li><strong>Payment Gateway:</strong> Payment gateway infrastructure (such as Razorpay) for transaction execution</li>
              <li><strong>AI Intelligence:</strong> AI processing models (such as Google Gemini) for automated plant photograph assessment</li>
              <li><strong>Maps &amp; Geocoding:</strong> Map and location data services for green space discovery</li>
              <li><strong>Cloud Hosting:</strong> Cloud hosting, CDN, and asset delivery networks</li>
            </ul>
            <p className="legal-subtext">
              Third-party partners are granted access only to the minimal data necessary to execute their respective functional roles.
            </p>
          </section>

          <section className="legal-section" id="data-sharing">
            <h2>9. Data Sharing</h2>
            <p>
              My Gardener shares relevant information solely where necessary to fulfil requested services and comply with legal requirements. This includes:
            </p>
            <ul className="legal-list">
              <li>Payment gateways to process transaction authorizations</li>
              <li>Assigned professional gardeners and service teams to fulfil on-site visits and reach service addresses</li>
              <li>Logistics and courier partners to deliver physical plant and shop shipments</li>
              <li>Law enforcement, regulatory bodies, or legal processes where strictly required by applicable law or to protect legitimate platform security</li>
            </ul>
            <div className="legal-callout">
              <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: 'var(--green)' }}>
                We do not sell, rent, or trade your personal information to advertisers or data brokers under any circumstances.
              </p>
            </div>
          </section>

          <section className="legal-section" id="data-security">
            <h2>10. Data Security</h2>
            <p>
              My Gardener employs reasonable technical, administrative, and physical safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.
            </p>
            <p>
              These measures include encrypted HTTPS data transmission in transit, secure token-based session handling, database-level row security policies, and access controls. While we strive to maintain robust safeguards, no internet-based transmission or storage system can be guaranteed to be entirely infallible.
            </p>
          </section>

          <section className="legal-section" id="data-retention">
            <h2>11. Data Retention</h2>
            <p>
              Information is retained only for as long as reasonably necessary to fulfill the purposes for which it was collected, including providing ongoing gardening services, maintaining active user accounts, fulfilling warranty or support inquiries, resolving disputes, and meeting statutory tax or accounting obligations.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL DATA RETENTION SCHEDULE &amp; ACCOUNT PURGE PROTOCOLS]
            </div>
          </section>

          <section className="legal-section" id="privacy-rights">
            <h2>12. Your Privacy Choices &amp; Rights</h2>
            <p>
              Depending on applicable jurisdiction and data protection laws, you may have rights regarding your personal information, including:
            </p>
            <ul className="legal-list">
              <li><strong>Access:</strong> The right to request a summary of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> The right to update or correct inaccurate or incomplete profile details.</li>
              <li><strong>Deletion:</strong> The right to request deletion of your account and associated personal data, subject to legitimate record-keeping obligations.</li>
              <li><strong>Consent Withdrawal:</strong> The right to withdraw consent for optional processing activities (such as marketing communications or location permissions).</li>
            </ul>
            <div className="legal-placeholder">
              [INSERT PRIVACY REQUEST / DATA RIGHTS PROCESS &amp; SUBMISSION FORM]
            </div>
          </section>

          <section className="legal-section" id="childrens-privacy">
            <h2>13. Children’s Privacy</h2>
            <p>
              My Gardener services, bookings, and product sales are directed at individuals capable of forming legally binding agreements. We do not knowingly collect personal data from minors without parental or guardian oversight.
            </p>
            <div className="legal-placeholder">
              [INSERT FINAL AGE / CHILDREN'S PRIVACY POLICY]
            </div>
          </section>

          <section className="legal-section" id="policy-changes">
            <h2>14. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect modifications in our service features, technology infrastructure, or legal obligations.
            </p>
            <p>
              When changes are made, the revised policy will be posted on this page with an updated "Last updated" date. Where appropriate, we may provide prominent notice (such as an email or in-app notification) for material modifications.
            </p>
          </section>

          <section className="legal-section" id="contact-grievance">
            <h2>15. Contact &amp; Privacy Requests</h2>
            <p>
              For questions about this Privacy Policy, your personal information, or to submit a privacy request, please contact:
            </p>
            <div style={{ marginTop: '16px' }}>
              <p><strong>Privacy &amp; Data Protection Officer:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--ink)' }}>
                Aaditya Kandwal
              </p>
              <p style={{ marginTop: '10px' }}><strong>Email:</strong></p>
              <p style={{ margin: '4px 0 10px', fontSize: '14px', color: 'var(--green)' }}>
                <a href="mailto:privacy@mygardener.me" style={{ color: 'inherit', textDecoration: 'underline' }}>privacy@mygardener.me</a>
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
