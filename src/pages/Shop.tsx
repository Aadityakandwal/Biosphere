import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { products, productCategories } from '@/data/products';

export default function Shop() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Shop — Garden essentials"
        title={<>Thoughtful products for <em>growing well.</em></>}
        description="Tonics, plants, tools and planters — each chosen to support healthy growth. No fabricated ratings or stock counts."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Glass Search and filter rail */}
          <div className="reveal-init" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{
                  paddingLeft: '44px',
                  borderRadius: '9999px',
                  background: 'var(--glass-pill-bg)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Search products, tonics, tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`glass-pill ${category === cat ? 'glass-pill--active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state reveal-init">
              <h3>No products found</h3>
              <p className="body-copy">Try a different search query or select another category.</p>
            </div>
          ) : (
            <div
              className="reveal-init"
              data-delay="1"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '28px',
              }}
            >
              {filtered.map((p) => (
                <Link key={p.id} to={`/shop/${p.id}`} className="product-card">
                  <div className="product-card-image-wrap">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-card-image"
                      loading="lazy"
                    />
                    <div className="glass-overlay-tag" style={{ bottom: '12px', right: '12px' }}>
                      <span>{p.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.4', fontWeight: 500, flexGrow: 1 }}>
                      {p.name}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--line-soft)',
                      }}
                    >
                      <p className="mono" style={{ fontSize: '14px', color: 'var(--terracotta)', fontWeight: 600 }}>
                        ₹{p.price}
                      </p>
                      <span className="text-link" style={{ fontSize: '11px', borderBottom: 'none' }}>
                        View details <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
