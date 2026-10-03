import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Sparkles, X, TrendingUp, Tag } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { products, productCategories } from '@/data/products';

const SUGGESTED_SEARCHES = [
  { term: 'Neerva 1L Microbial Tonic', category: 'Tonics & Boosters', price: '₹799', url: '/shop/neerva-1l' },
  { term: 'Monstera Deliciosa', category: 'Plants', price: '₹649', url: '/shop/monstera-deliciosa' },
  { term: 'Classic Terracotta Planter', category: 'Planters', price: '₹349', url: '/shop/terracotta-planter-8' },
  { term: 'Foliar Bio-Spray 500ml', category: 'Tonics & Boosters', price: '₹449', url: '/shop/bio-foliar-spray' },
  { term: 'Precision Bypass Pruner', category: 'Tools', price: '₹599', url: '/shop/bypass-pruner' },
];

const POPULAR_TAGS = ['Neerva', 'Monstera', 'Organic Tonic', 'Terracotta', 'Bypass Pruner', 'Potted Flora'];

export default function Shop() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
    setSearchFocused(false);
  };

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Shop — Garden essentials"
        title={<>Thoughtful products for <em>growing well.</em></>}
        description="Tonics, plants, tools and planters — each chosen to support healthy growth. No fabricated ratings or stock counts."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Glass Search and Horizontal Category Rail */}
          <div className="reveal-init" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            
            {/* Search Input with Active Focus Glow & Suggestions Dropdown */}
            <div ref={searchWrapperRef} className="search-input-wrapper">
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: searchFocused ? 'var(--green)' : 'var(--muted)',
                  transition: 'color 0.2s ease',
                  zIndex: 2,
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{
                  paddingLeft: '44px',
                  paddingRight: query ? '38px' : '16px',
                  borderRadius: '9999px',
                  background: 'var(--glass-pill-bg)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                }}
                placeholder="Search products, tonics, tools…"
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    zIndex: 2,
                  }}
                >
                  <X size={14} />
                </button>
              )}

              {/* Interactive Quick-Suggest Dropdown Menu */}
              {searchFocused && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: 'var(--paper)',
                    borderRadius: '16px',
                    border: '1px solid var(--line)',
                    boxShadow: '0 20px 48px -8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
                    padding: '16px',
                    animation: 'fadeIn 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 4px' }}>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <TrendingUp size={12} style={{ color: 'var(--terracotta)' }} /> Suggested Botanical Items
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--green)', fontFamily: 'var(--mono)' }}>
                      Live Filter Ready
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {SUGGESTED_SEARCHES.map((item) => (
                      <div
                        key={item.term}
                        onClick={() => handleSelectSuggestion(item.term)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--line-soft)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={13} style={{ color: 'var(--green)', opacity: 0.7 }} />
                          <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>{item.term}</span>
                          <span className="mono" style={{ fontSize: '9.5px', color: 'var(--muted)', background: 'var(--line-soft)', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.category}
                          </span>
                        </div>
                        <span className="mono" style={{ fontSize: '12px', color: 'var(--terracotta)', fontWeight: 600 }}>
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Trending quick tags */}
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ fontSize: '9.5px', color: 'var(--muted)', marginRight: '4px', textTransform: 'uppercase' }}>
                        Quick Tags:
                      </span>
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleSelectSuggestion(tag)}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--line-soft)',
                            border: '1px solid var(--line)',
                            color: 'var(--ink)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Tag size={10} style={{ opacity: 0.5 }} /> {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Swipeable Horizontal Category Scroll Row */}
            <div className="category-scroll-row">
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
              <button
                onClick={() => { setQuery(''); setCategory('All'); }}
                className="btn btn--outline"
                style={{ marginTop: '16px', fontSize: '12px' }}
              >
                Reset Filter
              </button>
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
