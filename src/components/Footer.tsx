import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" aria-label="My Gardener home">
            <img className="footer-logo" src="/logo.jpg" alt="My Gardener" />
          </Link>
          <p style={{ marginTop: '14px', maxWidth: '300px', fontSize: '13px', lineHeight: '1.6', color: 'var(--muted)' }}>
            Professional care for living gardens. Structured horticulture, organic nutrition, and considered stewardship.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={13} style={{ color: 'var(--green)' }} /> concierge@mygardener.me
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={13} style={{ color: 'var(--green)' }} /> +91 88476 88838
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={13} style={{ color: 'var(--muted)' }} /> Mon–Sat, 9:00 AM – 7:00 PM IST
            </span>
          </div>
        </div>

        {/* Explore Column */}
        <div className="footer-col">
          <h5>Explore</h5>
          <Link to="/services">Services Catalogue</Link>
          <Link to="/free-check">Free Garden Check</Link>
          <Link to="/membership">Care Memberships</Link>
          <Link to="/become-member">Become a Member</Link>
          <Link to="/shop">Garden Shop</Link>
          <Link to="/about">About My Gardener</Link>
        </div>

        {/* Account Column */}
        <div className="footer-col">
          <h5>Account</h5>
          <Link to="/profile">Profile Hub</Link>
          <Link to="/profile/garden">My Garden</Link>
          <Link to="/profile/membership">Active Care Plan</Link>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/profile/activity">Activity &amp; Orders</Link>
          <Link to="/profile/settings">Settings</Link>
        </div>

        {/* Support & Legal Column */}
        <div className="footer-col">
          <h5>Support &amp; Legal</h5>
          <Link to="/support">Help &amp; Support</Link>
          <Link to="/faq">Frequently Asked Questions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/refunds">Refund &amp; Cancellation</Link>
          <Link to="/shipping">Shipping &amp; Delivery</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 My Gardener. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: 'inherit' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'inherit' }}>Terms</Link>
          <Link to="/refunds" style={{ color: 'inherit' }}>Refunds</Link>
          <Link to="/shipping" style={{ color: 'inherit' }}>Shipping</Link>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
          Made for living gardens
        </span>
      </div>
    </footer>
  );
}
