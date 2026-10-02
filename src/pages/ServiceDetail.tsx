import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { getServiceById, getServiceCategoryById } from '@/data/services';
import { NotFound } from '@/components/UI';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = serviceId ? getServiceById(serviceId) : undefined;

  if (!service) return <NotFound />;

  const category = getServiceCategoryById(service.category);

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div className="container">
          <Link to="/services" className="text-link" style={{ marginBottom: '40px' }}>
            <ArrowLeft size={15} /> All services
          </Link>
          {category && (
            <p className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', marginBottom: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {category.name}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'flex-end' }}>
            <h1 style={{ maxWidth: '680px' }}>{service.name}</h1>
            <div style={{ textAlign: 'right' }}>
              <p className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Price</p>
              <p className="serif" style={{ fontSize: '44px', color: 'var(--green)' }}>₹{service.price}</p>
            </div>
          </div>
        </div>
      </section>

      {category?.image && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
          <div style={{ aspectRatio: '2.2', overflow: 'hidden' }}>
            <img src={category.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'clamp(40px, 8vw, 100px)' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '20px' }}>About this service</p>
              <h3 style={{ marginBottom: '24px' }}>{service.description}</h3>
              <p className="body-copy" style={{ marginTop: '16px' }}>
                This service is delivered by a My Gardener professional. After booking, you'll receive a confirmation with your selected date, time and address details.
              </p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '36px 32px' }}>
              <p className="eyebrow" style={{ marginBottom: '24px' }}>What's included</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {service.includes.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                    <Check size={16} style={{ color: 'var(--green)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--ink)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/book/${service.id}`} className="btn btn--lg w-full" style={{ marginTop: '32px' }}>
                Book this service <ArrowUpRight size={16} />
              </Link>
              {service.price === 0 && (
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '14px', textAlign: 'center' }}>
                  One free check per registered phone or email.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
