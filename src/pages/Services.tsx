import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { serviceCategories } from '@/data/services';
import ServiceabilityChecker from '@/components/ServiceabilityChecker';

export default function Services() {
  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Services — Professional garden care"
        title={<>Hands-on care for <em>every kind of garden.</em></>}
        description="From a single watering visit to a complete terrace garden setup, each service is delivered by a My Gardener professional. Browse the full catalogue by category."
      />

      {serviceCategories.map((category, idx) => (
        <section
          key={category.id}
          id={category.id}
          className={idx === 0 ? '' : 'section'}
          style={{
            scrollMarginTop: '100px',
            ...(idx === 0 ? { paddingBottom: 'clamp(80px, 12vw, 144px)' } : { paddingTop: 0 }),
          }}
        >
          <div className="container">
            {idx > 0 && <div className="divider" style={{ marginBottom: 'clamp(80px, 12vw, 144px)' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'clamp(40px, 8vw, 100px)', alignItems: 'flex-start' }}>
              {/* Sticky Editorial Sidebar */}
              <div className="reveal-init" style={{ position: 'sticky', top: '100px' }}>
                <p className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  {String(idx + 1).padStart(2, '0')} — {category.name}
                </p>
                <h2 style={{ marginBottom: '24px' }}>{category.name}</h2>
                <p className="body-copy">{category.intro}</p>
                {category.image && (
                  <div className="split-image" style={{ marginTop: '32px', aspectRatio: '1.5' }}>
                    <img src={category.image} alt={category.name} loading="lazy" />
                    <div className="glass-overlay-tag floating-subtle" style={{ bottom: '16px', left: '16px' }}>
                      <Sparkles size={11} style={{ color: 'var(--amber)' }} />
                      <span>{category.services.length} Specialized Services</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Service rows */}
              <div className="reveal-init" data-delay="1">
                {category.services.map((service) => {
                  const isALaCarte = service.price > 0 && service.price < 499 && service.id !== 'video-consultation';
                  return (
                    <div key={service.id} className="service-row">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <Link to={`/services/${service.id}`} className="sr-name" style={{ textDecoration: 'none' }}>
                            {service.name}
                          </Link>
                          {isALaCarte && (
                            <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: '3px', background: 'var(--line-soft)', color: 'var(--muted)' }}>
                              Add-on / Standalone
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="sr-desc">{service.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span className="sr-price">₹{service.price}</span>
                        <Link
                          to={`/book/${service.id}`}
                          className="btn"
                          style={{ padding: '10px 18px', fontSize: '11px', borderRadius: '9999px' }}
                        >
                          Book <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Pricing and dispatch policy note */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: '32px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '12px', border: '1px solid var(--line)', background: 'var(--paper)' }}>
            <p className="eyebrow" style={{ fontSize: '11px', marginBottom: '6px' }}>On-Site Dispatch &amp; Add-on Policy</p>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0, lineHeight: '1.5' }}>
              Dedicated physical gardener dispatch is available across Amritsar and Punjab with a standard <strong>minimum visit value of ₹499</strong>. Individual a la carte services (such as ₹199 Watering or ₹249 Pruning) can be bundled together, combined with our organic bio-tonic nutrition boosters, or added directly to any ongoing care membership.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Check Section */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 12vw, 144px)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <ServiceabilityChecker />
        </div>
      </section>
    </div>
  );
}
