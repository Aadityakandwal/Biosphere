import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Sparkles, CheckCircle2, HeartHandshake, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/UI';

export default function About() {
  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh' }}>
      <PageHeader
        eyebrow="About My Gardener"
        title={<>Professional care for <em>living gardens.</em></>}
        description="A managed gardening service company dedicated to mindful horticulture, certified organic practices, and living spaces that thrive."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <p className="body-copy body-copy--lg" style={{ marginBottom: '32px' }}>
            My Gardener is a managed gardening service platform that connects homeowners and estates with certified horticulturists, organic botanical nutrition, and structured seasonal stewardship — all in one coherent experience.
          </p>
          <p className="body-copy" style={{ marginBottom: '32px' }}>
            We believe gardens are living spaces that deserve the same considered attention as any other part of your home. Whether it's a balcony with three containers or an expansive terrace with planting beds and lawns, the right care makes all the difference.
          </p>
          <p className="body-copy" style={{ marginBottom: '48px' }}>
            Our gardeners visit your space, understand what is growing, and provide care that is grounded in real botanical observation — not generic schedules or harmful chemical shortcuts.
          </p>

          {/* Pillars of Practice */}
          <div
            className="glass-panel"
            style={{
              padding: '36px clamp(24px, 4vw, 40px)',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              marginBottom: '64px',
            }}
          >
            <p className="eyebrow" style={{ marginBottom: '20px' }}>Our Core Pillars</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
              <div>
                <Leaf size={22} style={{ color: 'var(--green)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '8px' }}>Observation First</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  Every plant microclimate is unique. We start every engagement by assessing soil moisture, sunlight lux, and root health.
                </p>
              </div>
              <div>
                <Shield size={22} style={{ color: 'var(--terracotta)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '8px' }}>100% Organic Inputs</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  We exclusively use biological microbial tonics, cold-pressed neem oils, and certified vermicompost safe for children and pets.
                </p>
              </div>
              <div>
                <HeartHandshake size={22} style={{ color: 'var(--green)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', color: 'var(--green)', marginBottom: '8px' }}>Accountability</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  Transparent pricing, scheduled visits, and direct communication with verified professional gardeners.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '12px' }}>Experience the difference in your garden</h3>
            <p className="body-copy" style={{ maxWidth: '480px', margin: '0 auto 24px', fontSize: '13.5px' }}>
              Begin with a ₹0, 45-minute on-site assessment. A My Gardener professional will evaluate your space and outline recommendations.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/free-check" className="btn">
                Book Free Garden Check (₹0) <ArrowRight size={14} />
              </Link>
              <Link to="/services" className="btn btn--outline">
                Browse All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
