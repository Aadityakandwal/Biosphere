import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export type TransformationProject = {
  id: string;
  title: string;
  gardenType: string;
  serviceProvided: string;
  timeline: string;
  story: string;
  highlights: string[];
  beforeImage: string;
  afterImage: string;
};

export const TRANSFORMATION_PROJECTS: TransformationProject[] = [
  {
    id: 'balcony-revival',
    title: 'High-Rise Balcony Oasis',
    gardenType: 'Apartment Balcony (80 sq.ft)',
    serviceProvided: 'Balcony Garden Setup & Bio-Tonic Feeding',
    timeline: 'Single Day Installation + 4-Week Monitoring',
    story: 'The client faced severe wind exposure and depleted pot soil causing leaf-scorch. Our team installed tailored terracotta containers, wind-tolerant foliage, and established a Neerva microbial feeding regimen.',
    highlights: [
      'Soil aeration and bio-amendment',
      'Wind-resistant hardy tropical species',
      'Integrated sub-irrigation planters',
    ],
    beforeImage: 'https://images.pexels.com/photos/9507239/pexels-photo-9507239.jpeg?auto=compress&cs=tinysrgb&w=1200',
    afterImage: 'https://images.pexels.com/photos/19324257/pexels-photo-19324257.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'terrace-sanctuary',
    title: 'Rooftop Terrace Kitchen & Flora Garden',
    gardenType: 'Rooftop Terrace (350 sq.ft)',
    serviceProvided: 'Terrace Garden Setup & Organic Pest Management',
    timeline: '3 Visits over 10 Days',
    story: 'Transforming an unutilized concrete rooftop into a productive botanical haven with raised planting boxes, companion herbs, and drip hydration lines.',
    highlights: [
      'Organic vegetable & culinary herb beds',
      'Natural neem-based pest control',
      'Structural rootzone protection',
    ],
    beforeImage: 'https://images.pexels.com/photos/37554739/pexels-photo-37554739.jpeg?auto=compress&cs=tinysrgb&w=1200',
    afterImage: 'https://images.pexels.com/photos/33995853/pexels-photo-33995853.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'indoor-canopy',
    title: 'Indoor Living Botanical Canopy',
    gardenType: 'Indoor Living Space (Light-Filtered)',
    serviceProvided: 'Indoor Plant Setup & Health Assessment',
    timeline: 'Full Afternoon Consultation & Setup',
    story: 'Diagnosed low-light chlorosis on existing houseplants. Curated statement Monstera, Snake plants and ZZ varieties matched to specific lux measurements.',
    highlights: [
      'Light meter calibration for optimum placement',
      'Porous ceramic drainage upgrades',
      'Monthly Complete Care stewardship plan',
    ],
    beforeImage: 'https://images.pexels.com/photos/10467813/pexels-photo-10467813.jpeg?auto=compress&cs=tinysrgb&w=1200',
    afterImage: 'https://images.pexels.com/photos/17619301/pexels-photo-17619301.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export default function TransformationGallery() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');

  const project = TRANSFORMATION_PROJECTS[activeProjectIndex];

  return (
    <div className="transformation-gallery-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>Real Transformations</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)' }}>Before &amp; After Stewardship</h2>
        </div>

        {/* Project tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {TRANSFORMATION_PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => { setActiveProjectIndex(idx); setViewMode('after'); }}
              style={{
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeProjectIndex === idx ? 'var(--green)' : 'var(--line)',
                background: activeProjectIndex === idx ? 'var(--green)' : 'transparent',
                color: activeProjectIndex === idx ? '#ffffff' : 'var(--muted)',
                cursor: 'pointer',
                fontWeight: activeProjectIndex === idx ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              Project {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main transformation display card */}
      <div
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          padding: 'clamp(20px, 4vw, 36px)',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          background: 'var(--paper)',
          alignItems: 'center',
        }}
      >
        {/* Interactive Image Showcase */}
        <div>
          <div
            style={{
              position: 'relative',
              aspectRatio: '1.25',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--line-soft)',
              border: '1px solid var(--line)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
            }}
          >
            <img
              src={viewMode === 'after' ? project.afterImage : project.beforeImage}
              alt={`${project.title} - ${viewMode} transformation`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s ease' }}
            />

            {/* View State Badge */}
            <div
              className="mono"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: viewMode === 'after' ? 'var(--green)' : 'var(--terracotta)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            >
              {viewMode === 'after' ? 'After Care & Styling' : 'Before Stewardship'}
            </div>

            {/* Quick Toggle Controls */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(5, 12, 8, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '4px',
                borderRadius: '999px',
                display: 'flex',
                gap: '4px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <button
                onClick={() => setViewMode('before')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  border: 'none',
                  background: viewMode === 'before' ? 'var(--terracotta)' : 'transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: viewMode === 'before' ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                Before
              </button>
              <button
                onClick={() => setViewMode('after')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  border: 'none',
                  background: viewMode === 'after' ? 'var(--green)' : 'transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: viewMode === 'after' ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                After
              </button>
            </div>
          </div>
        </div>

        {/* Project Story & Meta */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', textTransform: 'uppercase' }}>
              {project.gardenType}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '10px' }}>•</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--green)', textTransform: 'uppercase' }}>
              {project.timeline}
            </span>
          </div>

          <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--ink)' }}>{project.title}</h3>
          <p className="body-copy" style={{ fontSize: '13.5px', lineHeight: '1.65', marginBottom: '20px' }}>
            {project.story}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Service Provided: <strong style={{ color: 'var(--ink)' }}>{project.serviceProvided}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {project.highlights.map((h) => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--ink)' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/free-check" className="btn" style={{ fontSize: '11px', padding: '8px 16px' }}>
              Book a Free Garden Check (₹0) <ArrowRight size={13} />
            </Link>
            <Link to="/services" className="text-link" style={{ fontSize: '12px' }}>
              Explore similar services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
