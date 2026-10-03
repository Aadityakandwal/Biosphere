import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/UI';
import {
  Calendar,
  Award,
  ShoppingBag,
  Leaf,
  User,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Shield,
  HelpCircle,
} from 'lucide-react';

const supportCategories = [
  {
    icon: Calendar,
    title: 'Booking & Visits Help',
    desc: 'Reschedule an upcoming visit, modify service address, or request specific garden attention.',
    cta: 'Manage bookings',
    link: '/bookings',
  },
  {
    icon: Award,
    title: 'Membership & Care Plans',
    desc: 'Questions about visit frequency, plan changes, included benefits, or custom care.',
    cta: 'View care plan',
    link: '/profile/membership',
  },
  {
    icon: ShoppingBag,
    title: 'Shop Orders & Delivery',
    desc: 'Assistance with plant shipments, delivery timeframes, microbial tonics, or item replacements.',
    cta: 'View order activity',
    link: '/profile/activity',
  },
  {
    icon: Leaf,
    title: 'Garden Dashboard & Plants',
    desc: 'Guidance on documenting your plants, garden passport specifications, and health logs.',
    cta: 'Open garden dashboard',
    link: '/profile/garden',
  },
  {
    icon: CreditCard,
    title: 'Payments & Invoices',
    desc: 'Questions regarding Razorpay transactions, payment statuses, or refund processing.',
    cta: 'Refund guidelines',
    link: '/refunds',
  },
  {
    icon: User,
    title: 'Account & Data Privacy',
    desc: 'Update profile details, request data access, or learn about data protection rights.',
    cta: 'Edit profile',
    link: '/profile/edit',
  },
];

export default function ProfileSupport() {
  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Support & Concierge"
        title={<>How can we <em>help?</em></>}
        description="Assistance with your appointments, garden passport, care memberships, shop orders and account."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {/* Support Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {supportCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--paper)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--green)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <h3 style={{ fontSize: '16px', color: 'var(--green)' }}>{cat.title}</h3>
                  </div>
                  <p className="body-copy" style={{ fontSize: '12.5px', lineHeight: 1.55, marginBottom: '20px', flex: 1 }}>
                    {cat.desc}
                  </p>
                  <Link to={cat.link} className="text-link" style={{ fontSize: '12px', marginTop: 'auto' }}>
                    {cat.cta} <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Official Contact Channels */}
          <div className="panel-green" style={{ padding: '36px 32px', borderRadius: '10px', marginBottom: '36px' }}>
            <p className="eyebrow eyebrow--light" style={{ marginBottom: '8px' }}>Direct Concierge Assistance</p>
            <h2 style={{ color: '#f7f1e8', fontSize: '28px', marginBottom: '12px' }}>
              Speak with a Horticulture Specialist
            </h2>
            <p style={{ color: '#c4cfc6', fontSize: '13.5px', lineHeight: 1.6, maxWidth: '520px', marginBottom: '24px' }}>
              Our gardening team is available to assist with complex plant issues, customized estate care, and booking inquiries.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: 'rgba(247,241,232,0.1)', borderRadius: '6px' }}>
                <p className="mono" style={{ fontSize: '10px', color: '#b9cbb4', marginBottom: '4px' }}>Support Email</p>
                <a href="mailto:concierge@mygardener.me" style={{ color: '#f7f1e8', fontSize: '13px', wordBreak: 'break-all', textDecoration: 'underline' }}>
                  concierge@mygardener.me
                </a>
              </div>
              <div style={{ padding: '16px', background: 'rgba(247,241,232,0.1)', borderRadius: '6px' }}>
                <p className="mono" style={{ fontSize: '10px', color: '#b9cbb4', marginBottom: '4px' }}>Helpline</p>
                <a href="tel:+918847688838" style={{ color: '#f7f1e8', fontSize: '13px', textDecoration: 'underline' }}>
                  +91 88476 88838
                </a>
              </div>
              <div style={{ padding: '16px', background: 'rgba(247,241,232,0.1)', borderRadius: '6px' }}>
                <p className="mono" style={{ fontSize: '10px', color: '#b9cbb4', marginBottom: '4px' }}>Operating Hours</p>
                <p style={{ color: '#f7f1e8', fontSize: '13px', margin: 0 }}>Mon – Sat: 9 AM – 7 PM IST</p>
              </div>
            </div>

            <Link to="/support" className="btn btn--light" style={{ fontSize: '12px', padding: '10px 20px' }}>
              Visit Main Support &amp; Help Portal <ArrowRight size={14} />
            </Link>
          </div>

          {/* Quick FAQ / Policy Shortcuts */}
          <div className="glass-panel" style={{ padding: '28px 32px' }}>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>Policy Resources</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/refunds" className="text-link" style={{ fontSize: '12px' }}>
                Cancellation &amp; Refund Policy →
              </Link>
              <Link to="/shipping" className="text-link" style={{ fontSize: '12px' }}>
                Shipping &amp; Delivery →
              </Link>
              <Link to="/privacy" className="text-link" style={{ fontSize: '12px' }}>
                Privacy Policy →
              </Link>
              <Link to="/terms" className="text-link" style={{ fontSize: '12px' }}>
                Terms &amp; Conditions →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
