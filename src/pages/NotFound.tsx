import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Search, Compass, ShoppingBag, Wrench, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
        {/* Botanical Icon Halo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'color-mix(in srgb, var(--green) 12%, transparent)',
            border: '1px solid var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(23, 61, 44, 0.15)',
          }}
        >
          <Leaf size={34} style={{ color: 'var(--green)' }} />
        </div>

        <p className="mono" style={{ fontSize: '12px', color: 'var(--terracotta)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Error 404 — Path Not Found
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px' }}>
          This path has <em>overgrown.</em>
        </h1>
        <p className="body-copy" style={{ margin: '0 auto 36px', maxWidth: '480px' }}>
          The garden bed or page you are looking for has been replanted, moved, or never existed in our directory.
        </p>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <Link to="/" className="btn btn--lg">
            Return to Homepage <ArrowRight size={15} />
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('mg:open-search'))}
            className="btn btn--outline btn--lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Search size={15} /> Open Search (⌘K)
          </button>
        </div>

        {/* Quick Botanical Shortcuts */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            textAlign: 'left',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: '16px', textAlign: 'center' }}>
            Where would you like to grow next?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Link
              to="/services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--card-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--line-soft)',
                textDecoration: 'none',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <Wrench size={15} style={{ color: 'var(--green)' }} />
              <span>Service Catalogue</span>
            </Link>
            <Link
              to="/shop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--card-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--line-soft)',
                textDecoration: 'none',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <ShoppingBag size={15} style={{ color: 'var(--terracotta)' }} />
              <span>Garden Shop</span>
            </Link>
            <Link
              to="/membership"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--card-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--line-soft)',
                textDecoration: 'none',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <ShieldCheck size={15} style={{ color: 'var(--green)' }} />
              <span>Care Plans</span>
            </Link>
            <Link
              to="/maps"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--card-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--line-soft)',
                textDecoration: 'none',
                color: 'var(--ink)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <Compass size={15} style={{ color: 'var(--amber)' }} />
              <span>Green World Maps</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
