import { Link, useLocation } from 'react-router-dom';

const legalLinks = [
  { to: '/support', label: 'Support & Help' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/refunds', label: 'Refund & Cancellation' },
  { to: '/shipping', label: 'Shipping & Delivery' },
];

export default function LegalNav() {
  const location = useLocation();

  return (
    <nav className="legal-nav-bar" aria-label="Legal & Support Navigation">
      {legalLinks.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`legal-nav-link ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
