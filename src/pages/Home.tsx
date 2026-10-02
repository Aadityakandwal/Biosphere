import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Leaf, Check, MapPin, Sparkles, Sprout } from 'lucide-react';
import CinematicHero from '@/components/CinematicHero';
import { serviceCategories } from '@/data/services';
import { products } from '@/data/products';
import { plans } from '@/data/plans';

const ecosystemItems = [
  ['01', 'Professional care', 'Hands-on attention for the garden you live with.'],
  ['02', 'Plant health', 'Clear guidance when a leaf starts to tell a story.'],
  ['03', 'Garden management', 'One calm, considered record of your garden.'],
  ['04', 'Garden essentials', 'Thoughtful products chosen for better growth.'],
];

const previewProducts = products.slice(0, 4);
const previewServices = serviceCategories[0].services.slice(0, 3);

export default function Home() {
  return (
    <>
      <CinematicHero />

      {/* ECOSYSTEM */}
      <section className="section">
        <div className="container">
          <div className="reveal-init" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
            <span className="eyebrow">01 — One living system</span>
          </div>
          <div className="reveal-init" data-delay="1" style={{ margin: '70px 0 80px', maxWidth: '680px' }}>
            <h2>Everything your garden needs, <em>in one place.</em></h2>
            <p className="body-copy" style={{ marginTop: '24px' }}>
              A considered way to care for your outside spaces. From the first new leaf to the seasons that follow, My Gardener brings expertise, insight and practical help together.
            </p>
          </div>
          <div className="eco-list reveal-init" data-delay="2">
            {ecosystemItems.map(([number, title, copy]) => (
              <Link className="eco-item" to="/services" key={number}>
                <span className="eco-number">{number}</span>
                <span className="eco-text">
                  <strong>{title}</strong>
                  <span>{copy}</span>
                </span>
                <ArrowUpRight className="eco-arrow" size={19} strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="split split--reverse">
            <div className="split-image reveal-init" data-delay="1">
              <img src="https://images.pexels.com/photos/27176068/pexels-photo-27176068.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Gardener planting in soil" loading="lazy" />
              <div className="glass-overlay-tag floating-subtle" style={{ top: '20px', right: '20px' }}>
                <Sprout size={12} style={{ color: '#b9cbb4' }} />
                <span>Hands-on care</span>
              </div>
            </div>
            <div className="split-copy reveal-init" data-delay="2">
              <p className="eyebrow" style={{ marginBottom: '20px' }}>Services / 02</p>
              <h2>When your garden needs <em>hands-on care.</em></h2>
              <p className="body-copy">
                From a single pruning visit to a full garden setup, bring in the right help for the work that keeps a garden thriving.
              </p>
              <div style={{ marginTop: '32px' }}>
                {previewServices.map((s) => (
                  <Link key={s.id} to={`/services/${s.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px', borderBottom: '1px solid var(--line-soft)', borderRadius: '4px', transition: 'all 0.25s ease' }}
                    className="hover:pl-4 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="serif" style={{ fontSize: '19px', color: 'var(--green)' }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: '13px', color: 'var(--terracotta)' }}>₹{s.price}</span>
                  </Link>
                ))}
              </div>
              <Link to="/services" className="text-link" style={{ marginTop: '28px' }}>
                Explore all services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FREE CHECK */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="panel-green reveal-init" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '36px', alignItems: 'start' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid rgba(247,241,232,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={22} strokeWidth={1.4} />
            </div>
            <div>
              <p className="eyebrow eyebrow--light" style={{ marginBottom: '16px' }}>A first step, on us</p>
              <h2 style={{ color: '#f7f1e8', maxWidth: '520px' }}>Start with a <em style={{ color: '#b9cbb4' }}>Free Garden Check.</em></h2>
              <p className="body-copy" style={{ color: '#c4cfc6', margin: '24px 0 28px', maxWidth: '420px' }}>
                A 45-minute on-site assessment to understand your space and what it needs next.
              </p>
              <Link to="/free-check" className="btn btn--light">
                Claim free garden check <ArrowUpRight size={15} />
              </Link>
            </div>
            <div style={{ borderLeft: '1px solid rgba(247,241,232,0.2)', paddingLeft: '28px', color: '#cad4cb', fontSize: '11px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#f8e9d0', fontFamily: 'var(--serif)', fontSize: '48px', lineHeight: '1' }}>₹0</span>
              <span>45-minute<br />on-site assessment</span>
            </div>
          </div>
          <p className="reveal-init" data-delay="1" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '11px', marginTop: '14px', fontFamily: 'var(--mono)' }}>
            <Check size={13} /> One free check per registered phone or email.
          </p>
        </div>
      </section>

      {/* MEMBERSHIP PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="reveal-init" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>Membership / 03</p>
              <h2 style={{ maxWidth: '520px' }}>Care that <em>returns</em> with the seasons.</h2>
            </div>
            <Link to="/membership" className="text-link" style={{ marginBottom: '8px' }}>
              Explore plans <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid-3 reveal-init" data-delay="1">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`membership-card ${plan.featured ? 'membership-card--featured' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="mono" style={{ fontSize: '10px', color: plan.featured ? '#b9cbb4' : 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{plan.name}</p>
                  {plan.featured && (
                    <span className="glass-pill glass-pill--active" style={{ fontSize: '9px', padding: '4px 10px' }}>
                      <Sparkles size={10} style={{ display: 'inline', marginRight: '4px' }} /> Most Popular
                    </span>
                  )}
                </div>
                <p className="serif" style={{ fontSize: '42px', color: plan.featured ? '#f7f1e8' : 'var(--green)', margin: '20px 0 4px' }}>
                  ₹{plan.price}<span style={{ fontSize: '14px', color: plan.featured ? '#c4cfc6' : 'var(--muted)', fontFamily: 'var(--sans)' }}>/{plan.period}</span>
                </p>
                <p style={{ color: plan.featured ? '#c4cfc6' : 'var(--muted)', fontSize: '13px', lineHeight: '1.6', marginTop: '12px' }}>{plan.tagline}</p>
                <Link
                  to="/membership"
                  className={`btn ${plan.featured ? 'btn--light' : 'btn--outline'}`}
                  style={{ marginTop: '28px' }}
                >
                  Choose {plan.name} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reveal-init" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '44px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>Shop / 04</p>
              <h2 style={{ maxWidth: '480px' }}>Essentials for <em>growing well.</em></h2>
            </div>
            <Link to="/shop" className="text-link" style={{ marginBottom: '8px' }}>
              Visit shop <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid-2 reveal-init" data-delay="1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {previewProducts.map((p) => (
              <Link key={p.id} to={`/shop/${p.id}`} className="product-card">
                <div className="product-card-image-wrap">
                  <img src={p.image} alt={p.name} className="product-card-image" loading="lazy" />
                  <div className="glass-overlay-tag" style={{ bottom: '12px', right: '12px' }}>
                    <span>{p.category}</span>
                  </div>
                </div>
                <div style={{ padding: '20px 18px' }}>
                  <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.4', fontWeight: 500 }}>{p.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <p className="mono" style={{ fontSize: '13px', color: 'var(--terracotta)', fontWeight: 600 }}>₹{p.price}</p>
                    <span className="text-link" style={{ fontSize: '11px', borderBottom: 'none' }}>View <ArrowUpRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BECOME A MEMBER SECTION */}
      <section className="section">
        <div className="container">
          <div className="panel-green reveal-init" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'center' }}>
            <div>
              <p className="eyebrow eyebrow--light" style={{ marginBottom: '14px' }}>Join the Network / 05</p>
              <h2 style={{ color: '#f7f1e8', maxWidth: '580px', marginBottom: '16px' }}>
                Become part of <em style={{ color: '#b9cbb4' }}>My Gardener.</em>
              </h2>
              <p className="body-copy" style={{ color: '#c4cfc6', maxWidth: '500px' }}>
                Whether you're an experienced garden professional or looking for continuous regular care, apply to join our growing community of botanical stewards.
              </p>
            </div>
            <div>
              <Link to="/become-member" className="btn btn--light" style={{ whiteSpace: 'nowrap' }}>
                Apply to Become Member <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-deep-green reveal-init" style={{ position: 'relative', overflow: 'hidden', minHeight: '480px', display: 'flex', alignItems: 'center', padding: 'clamp(80px, 12vw, 140px) clamp(24px, 12vw, 190px)' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow eyebrow--light" style={{ marginBottom: '20px' }}>My Gardener</p>
          <h2 style={{ color: '#f7f1e8', fontSize: 'clamp(48px, 6.5vw, 90px)' }}>Better care.<br /><em style={{ color: '#b8cbb3' }}>Healthier gardens.</em></h2>
          <Link to="/signup" className="btn btn--light" style={{ marginTop: '36px' }}>
            Begin your garden story <ArrowUpRight size={16} />
          </Link>
        </div>
        <Leaf size={240} strokeWidth={0.4} style={{ position: 'absolute', right: '6%', bottom: '-40px', color: 'rgba(164, 188, 156, 0.08)', transform: 'rotate(-22deg)', pointerEvents: 'none' }} />
      </section>
    </>
  );
}
