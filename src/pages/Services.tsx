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
                {category.services.map((service) => (
                  <div key={service.id} className="service-row">
                    <div>
                      <Link to={`/services/${service.id}`} className="sr-name" style={{ textDecoration: 'none' }}>
                        {service.name}
                      </Link>
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
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Coverage Check Section */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 12vw, 144px)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <ServiceabilityChecker />
        </div>
      </section>
    </div>
  );
}
