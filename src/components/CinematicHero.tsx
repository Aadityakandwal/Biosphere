import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

const HERO_IMAGE = '/hero-garden.jpg';

export default function CinematicHero() {
  return (
    <section className="hero-static">
      <img className="hero-image" src={HERO_IMAGE} alt="A peaceful landscaped garden estate" />
      <div className="hero-overlay" />
      <div className="hero-overlay--bottom" />

      {/* Floating glass badge on top right */}
      <div
        className="glass-overlay-tag floating-subtle"
        style={{ top: '100px', right: 'clamp(24px, 6vw, 96px)' }}
      >
        <Sparkles size={12} style={{ color: 'var(--amber)' }} />
        <span>Living Botanical Stewardship</span>
      </div>

      <div className="hero-content">
        <p className="eyebrow eyebrow--accent reveal-init" data-delay="1">
          <span className="eyebrow-dot" /> Continuous garden care
        </p>
        <h1 className="reveal-init" data-delay="2">
          Your garden.<br />
          <em>Managed better.</em>
        </h1>
        <p className="hero-desc reveal-init" data-delay="3">
          Professional garden care, plant health guidance, products and smarter garden management — all in one place.
        </p>
        <div className="hero-actions reveal-init" data-delay="4">
          <Link to="/services" className="btn">
            Explore My Gardener <ArrowUpRight size={15} />
          </Link>
          <Link to="/free-check" className="btn btn--outline">
            Claim Free Garden Check <ArrowRight size={15} />
          </Link>
        </div>
        <div
          className="reveal-init"
          data-delay="4"
          style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(247, 241, 232, 0.65)', fontSize: '11px', fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--sage)' }} /> Built around the way your garden actually grows
        </div>
      </div>

      {/* Floating glass badge on bottom right */}
      <div
        className="glass-overlay-tag floating-subtle-alt"
        style={{ bottom: '48px', right: 'clamp(24px, 6vw, 96px)' }}
      >
        <MapPin size={12} style={{ color: 'var(--terracotta)' }} />
        <span>On-Site Assessments Active</span>
      </div>
    </section>
  );
}
