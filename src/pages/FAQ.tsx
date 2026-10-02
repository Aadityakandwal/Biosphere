import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/UI';
import { 
  ChevronDown, ChevronUp, Search, Sparkles, HelpCircle, 
  Wrench, ShieldCheck, ShoppingBag, CreditCard, Award, LayoutDashboard, MapPin, User, ArrowRight
} from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const FAQS: FAQItem[] = [
  // 1. Services
  {
    category: 'Services',
    question: 'What types of gardening services do you offer?',
    answer: 'We provide end-to-end managed garden services including Garden Setup (Balcony, Terrace, Indoor, Outdoor, Kitchen garden), Basic Maintenance (pruning, targeted watering, repotting), Targeted Garden Care (organic fertilizer, bio-pest control, plant health checks), Lawn Care (mowing, hedge trimming), and Expert Consultations (on-site garden inspections and soil testing guidance).',
  },
  {
    category: 'Services',
    question: 'What are your standard visit hours and time slots?',
    answer: 'Our professional garden visits run Monday through Saturday with 6 dedicated time slots: 9:00 AM, 10:30 AM, 12:00 PM, 2:00 PM, 4:00 PM, and 6:00 PM.',
  },
  {
    category: 'Services',
    question: 'Do your gardeners bring their own equipment and organic inputs?',
    answer: 'Yes. Our trained professionals arrive with all required precision pruning tools, soil testers, and certified organic bio-tonics. Any specific planters or plants you purchase through the shop will be delivered and potted during the visit.',
  },

  // 2. Free Garden Check
  {
    category: 'Free Garden Check',
    question: 'What is included in the Free Garden Check?',
    answer: 'The Free Garden Check is a ₹0, 45-minute on-site assessment. A My Gardener professional visits your home to walk through your growing area, inspect plant conditions, check soil moisture and light levels, and provide a clear, no-obligation summary of care recommendations.',
  },
  {
    category: 'Free Garden Check',
    question: 'What is the eligibility rule for the Free Garden Check?',
    answer: 'To ensure every household can experience our stewardship, exactly one Free Garden Check is allowed per registered phone number or email address.',
  },

  // 3. Memberships
  {
    category: 'Memberships',
    question: 'How do My Gardener care memberships work?',
    answer: 'Our memberships are monthly stewardship plans designed for consistent plant health. We offer Essential Care (₹399/mo with 1 monthly visit and 6 daily AI scans), Complete Care (₹799/mo with 2 monthly visits, bio-tonic feeding and 15 daily AI scans), Master Care (₹1,499/mo with weekly visits and full lawn/terrace management), and Custom Care for bespoke villa and estate grounds.',
  },
  {
    category: 'Memberships',
    question: 'Can I cancel or change my membership plan?',
    answer: 'Yes, memberships are completely flexible with no long-term lock-in. You can pause, upgrade, or cancel your subscription anytime through your Profile Membership hub.',
  },

  // 4. Bookings & Rescheduling
  {
    category: 'Bookings',
    question: 'How do I track and manage my booked visits?',
    answer: 'All your past, upcoming, and confirmed service visits are listed inside your Profile under "My Bookings" and the Activity timeline. You can view assigned gardener details, visit dates, and receipts.',
  },
  {
    category: 'Bookings',
    question: 'Can I reschedule an upcoming visit?',
    answer: 'Yes. Please contact our support team at least 24 hours prior to your scheduled slot via phone (+91 88476 88838) or email (aadityakandwal2000@gmail.com) to reschedule without any cancellation fee.',
  },

  // 5. Shop & Delivery
  {
    category: 'Shop',
    question: 'What products do you sell in the Garden Shop?',
    answer: 'We stock proprietary organic botanical formulations (such as Neerva Microbial Tonic, Vardhak Flower Booster, and BioRooter Root Starter), hand-picked resilient indoor/outdoor plants, precision stainless bypass pruners, and breathable hand-thrown terracotta planters.',
  },
  {
    category: 'Shop',
    question: 'What are your delivery timelines for shop orders?',
    answer: 'Living plants and organic tonics are safely packaged and dispatched within 24–48 hours. Standard delivery takes 2 to 5 business days across supported metropolitan regions.',
  },

  // 6. Payments & Razorpay
  {
    category: 'Payments',
    question: 'Which payment methods are accepted?',
    answer: 'We integrate securely with Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, Mastercard, RuPay), and Net Banking across all major Indian banks.',
  },
  {
    category: 'Payments',
    question: 'What is your refund policy?',
    answer: 'If you cancel a booking at least 24 hours in advance, a 100% refund is processed back to your original payment method within 5–7 working days. For damaged shop items, replacements or refunds are issued upon photo verification within 48 hours of delivery.',
  },

  // 7. Green Points
  {
    category: 'Green Points',
    question: 'What are Green Points and how do I earn them?',
    answer: 'Green Points are loyalty rewards earned whenever you book services, purchase products, or maintain an active membership (50 points per ₹100 spent). You can redeem them for service vouchers, microbial tonics, and nursery plants in your Profile.',
  },

  // 8. Garden Dashboard
  {
    category: 'Garden Dashboard',
    question: 'What is the Garden Dashboard in my Profile?',
    answer: 'The Garden Dashboard allows you to catalog your personal plants, track their sunlight and soil parameters, record health assessments from your gardener visits, and analyze plant symptoms with our AI scan tool.',
  },

  // 9. Become a Member
  {
    category: 'Become a Member',
    question: 'How do I apply to become a gardener or specialist with My Gardener?',
    answer: 'You can apply directly via our Become a Member application page. Fill in your background, experience, city, and botanical interests, and our team will review and get in touch.',
  },
];

const CATEGORIES = [
  'All',
  'Services',
  'Free Garden Check',
  'Memberships',
  'Bookings',
  'Shop',
  'Payments',
  'Green Points',
  'Garden Dashboard',
  'Become a Member',
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true, 3: true });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh' }}>
      <PageHeader
        eyebrow="Help & Documentation"
        title={<>Frequently Asked <em>Questions.</em></>}
        description="Clear answers about our managed gardening services, membership stewardship, free checks, orders, and plant care."
      />

      <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Search bar */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '9999px',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              marginBottom: '32px',
            }}
          >
            <Search size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. Free check, visits, pruning, refund, tonics)..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: 'var(--ink)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '40px',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--green)' : 'var(--line)',
                  background: activeCategory === cat ? 'var(--green)' : 'transparent',
                  color: activeCategory === cat ? '#ffffff' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  fontWeight: activeCategory === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <HelpCircle size={32} style={{ color: 'var(--muted)', margin: '0 auto 12px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No answers matched your search</h3>
              <p className="body-copy" style={{ fontSize: '13px', margin: '0 auto 20px', maxWidth: '380px' }}>
                We could not find an exact match for "{searchQuery}". You can browse categories or reach our support team directly.
              </p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="btn btn--outline">
                View all FAQs
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredFaqs.map((faq, index) => {
                const isOpen = !!openItems[index];
                return (
                  <div
                    key={index}
                    className="glass-panel"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      background: 'var(--paper)',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 24px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <span
                          className="mono"
                          style={{
                            fontSize: '9.5px',
                            color: 'var(--terracotta)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          {faq.category}
                        </span>
                        <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', margin: 0 }}>
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--line-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'var(--green)',
                        }}
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 24px 22px',
                          color: 'var(--muted)',
                          fontSize: '13.5px',
                          lineHeight: '1.7',
                          borderTop: '1px solid var(--line-soft)',
                          paddingTop: '16px',
                        }}
                      >
                        <p style={{ margin: 0 }}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Need more help banner */}
          <div
            className="glass-panel"
            style={{
              marginTop: '56px',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '8px' }}>Have a question not answered here?</h3>
            <p className="body-copy" style={{ fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 24px' }}>
              Our horticulture support team is available Monday through Saturday from 9:00 AM to 7:00 PM IST.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/support" className="btn">
                Contact Support <ArrowRight size={14} />
              </Link>
              <Link to="/free-check" className="btn btn--outline">
                Book a Free Check
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
