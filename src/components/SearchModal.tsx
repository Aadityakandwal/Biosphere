import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, ArrowRight, CornerDownLeft, Sparkles, 
  Wrench, ShoppingBag, ShieldCheck, MapPin, FileText, Clock, Trash2
} from 'lucide-react';
import { allServices } from '@/data/services';
import { products } from '@/data/products';
import { plans } from '@/data/plans';
import { curatedPlaces } from '@/data/places';

export type SearchResultType = 'service' | 'product' | 'membership' | 'place' | 'page';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  badge: string;
  url: string;
  price?: number | string;
};

const STATIC_PAGES: SearchResult[] = [
  { id: 'page-home', type: 'page', title: 'Home', subtitle: 'Overview of living garden care & philosophy', badge: 'Page', url: '/' },
  { id: 'page-services', type: 'page', title: 'Services Catalogue', subtitle: 'Browse setup, pruning, health checks & care', badge: 'Page', url: '/services' },
  { id: 'page-free-check', type: 'page', title: 'Free Garden Check', subtitle: '45-minute on-site assessment at ₹0', badge: 'Page', url: '/free-check' },
  { id: 'page-membership', type: 'page', title: 'Care Memberships', subtitle: 'Compare Essential, Complete & Master stewardship plans', badge: 'Page', url: '/membership' },
  { id: 'page-shop', type: 'page', title: 'Garden Shop', subtitle: 'Microbial tonics, hardy plants, planters and tools', badge: 'Page', url: '/shop' },
  { id: 'page-maps', type: 'page', title: 'Green World Explorer', subtitle: 'Find botanical gardens, local nurseries and green spaces', badge: 'Page', url: '/maps' },
  { id: 'page-about', type: 'page', title: 'About My Gardener', subtitle: 'Our craft, organic methodology and green mission', badge: 'Page', url: '/about' },
  { id: 'page-support', type: 'page', title: 'Support & Help Desk', subtitle: 'Assistance with bookings, memberships and orders', badge: 'Page', url: '/support' },
  { id: 'page-faq', type: 'page', title: 'Frequently Asked Questions', subtitle: 'Answers on services, plans, free checks and shop', badge: 'Page', url: '/faq' },
  { id: 'page-profile', type: 'page', title: 'Customer Profile', subtitle: 'Manage your garden, bookings, points & settings', badge: 'Page', url: '/profile' },
  { id: 'page-cart', type: 'page', title: 'Shopping Cart', subtitle: 'Review selected plants and organic tonics', badge: 'Page', url: '/cart' },
];

const RECENT_SEARCHES_KEY = 'mg_recent_searches_v1';

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const filtered = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(filtered);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      const filtered = recentSearches.filter((s) => s !== term);
      setRecentSearches(filtered);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Compute indexed results
  const allIndexedResults = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    // 1. Services
    allServices.forEach((s) => {
      items.push({
        id: `service-${s.id}`,
        type: 'service',
        title: s.name,
        subtitle: s.description,
        badge: 'Service',
        url: `/services/${s.id}`,
        price: `₹${s.price}`,
      });
    });

    // 2. Products
    products.forEach((p) => {
      items.push({
        id: `product-${p.id}`,
        type: 'product',
        title: p.name,
        subtitle: p.description,
        badge: p.category,
        url: `/shop/${p.id}`,
        price: `₹${p.price}`,
      });
    });

    // 3. Plans
    plans.forEach((pl) => {
      items.push({
        id: `plan-${pl.id}`,
        type: 'membership',
        title: `${pl.name} Plan`,
        subtitle: pl.tagline,
        badge: 'Membership',
        url: `/membership`,
        price: typeof pl.price === 'number' ? `₹${pl.price}/${pl.period}` : 'Bespoke',
      });
    });

    // 4. Curated Green Spots
    curatedPlaces.forEach((cp) => {
      items.push({
        id: `place-${cp.id}`,
        type: 'place',
        title: cp.name,
        subtitle: cp.address,
        badge: cp.category,
        url: `/maps`,
      });
    });

    // 5. Static Pages
    STATIC_PAGES.forEach((pg) => {
      items.push(pg);
    });

    return items;
  }, []);

  // Filter results by search query and category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allIndexedResults.filter((item) => {
      if (activeCategory !== 'all' && item.type !== activeCategory) {
        return false;
      }
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle.toLowerCase().includes(q);
      const matchBadge = item.badge.toLowerCase().includes(q);
      return matchTitle || matchSub || matchBadge;
    });
  }, [allIndexedResults, query, activeCategory]);

  // Adjust selected index on query/category change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredResults.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredResults.length > 0) {
          setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
          const item = filteredResults[selectedIndex];
          saveRecentSearch(query || item.title);
          navigate(item.url);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, query, navigate, onClose]);

  const handleSelect = (item: SearchResult) => {
    saveRecentSearch(query || item.title);
    navigate(item.url);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultType) => {
    switch (type) {
      case 'service':
        return <Wrench size={14} className="text-emerald" />;
      case 'product':
        return <ShoppingBag size={14} className="text-terracotta" />;
      case 'membership':
        return <ShieldCheck size={14} className="text-gold" />;
      case 'place':
        return <MapPin size={14} className="text-emerald" />;
      case 'page':
      default:
        return <FileText size={14} style={{ opacity: 0.7 }} />;
    }
  };

  return (
    <div
      className="search-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 12, 8, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(20px, 8vh, 80px) 16px 20px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="search-modal-container glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--paper)',
          borderRadius: '16px',
          border: '1px solid var(--line)',
          boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'min(82vh, 720px)',
        }}
      >
        {/* Search Header Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--line-soft)',
            gap: '12px',
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
          }}
        >
          <Search size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, products, memberships, botanical spots..."
            aria-label="Search site content"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--ink)',
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="icon-btn"
              aria-label="Clear search"
              style={{ width: '28px', height: '28px' }}
            >
              <X size={14} />
            </button>
          ) : (
            <kbd
              className="mono"
              style={{
                fontSize: '10px',
                padding: '3px 6px',
                borderRadius: '4px',
                background: 'var(--line-soft)',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
              }}
            >
              ESC
            </kbd>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 20px',
            borderBottom: '1px solid var(--line-soft)',
            overflowX: 'auto',
            background: 'rgba(0,0,0,0.02)',
          }}
        >
          {[
            { id: 'all', label: 'All Content' },
            { id: 'service', label: 'Services' },
            { id: 'product', label: 'Shop' },
            { id: 'membership', label: 'Memberships' },
            { id: 'place', label: 'Green World' },
            { id: 'page', label: 'Pages' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'var(--green)' : 'var(--line)',
                background: activeCategory === cat.id ? 'var(--green)' : 'transparent',
                color: activeCategory === cat.id ? '#ffffff' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                fontWeight: activeCategory === cat.id ? 600 : 400,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Content Body */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
          }}
        >
          {query.trim() === '' ? (
            /* Empty Search State: Recent Searches + Quick Suggestions */
            <div>
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 8px' }}>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Recent Searches
                    </span>
                    <button
                      onClick={clearAllRecent}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={11} /> Clear
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'var(--line-soft)',
                          border: '1px solid var(--line)',
                          fontSize: '12px',
                          color: 'var(--ink)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <Clock size={11} style={{ opacity: 0.5 }} />
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--muted)',
                            padding: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation Suggestions */}
              <div>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', padding: '0 8px' }}>
                  Popular Destinations
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {[
                    { title: 'Free Garden Check', subtitle: 'Book a 45-min on-site review', url: '/free-check', badge: '₹0' },
                    { title: 'Care Memberships', subtitle: 'Essential, Complete, Master', url: '/membership', badge: 'Stewardship' },
                    { title: 'Garden Shop', subtitle: 'Bio-tonics & healthy plants', url: '/shop', badge: 'Shop' },
                    { title: 'Green World Maps', subtitle: 'Nurseries & botanical spots', url: '/maps', badge: 'Explore' },
                  ].map((dest) => (
                    <div
                      key={dest.url}
                      onClick={() => { navigate(dest.url); onClose(); }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--line-soft)',
                        background: 'var(--card-bg, rgba(255,255,255,0.02))',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--green)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--line-soft)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{dest.title}</span>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)' }}>{dest.badge}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>{dest.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            /* No Results State */
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <Sparkles size={28} style={{ color: 'var(--muted)', margin: '0 auto 12px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>No matches found for "{query}"</h4>
              <p className="body-copy" style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '360px', margin: '0 auto 20px' }}>
                Try searching for specific services like "pruning", "lawn", or products like "Neerva", or membership plans.
              </p>
              <button
                onClick={() => { setQuery(''); setActiveCategory('all'); }}
                className="btn btn--outline"
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            /* Results List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-active={isSelected ? 'true' : 'false'}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--line-soft)' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--line)' : 'transparent',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'var(--paper)',
                          border: '1px solid var(--line-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getTypeIcon(item.type)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: 'var(--ink)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.title}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'var(--paper)',
                              border: '1px solid var(--line-soft)',
                              color: 'var(--muted)',
                              flexShrink: 0,
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '11.5px',
                            color: 'var(--muted)',
                            margin: '2px 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                      {item.price && (
                        <span className="mono" style={{ fontSize: '12px', color: 'var(--terracotta)', fontWeight: 600 }}>
                          {item.price}
                        </span>
                      )}
                      {isSelected ? (
                        <CornerDownLeft size={13} style={{ color: 'var(--green)', opacity: 0.8 }} />
                      ) : (
                        <ArrowRight size={13} style={{ opacity: 0.2 }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            borderTop: '1px solid var(--line-soft)',
            background: 'var(--card-bg, rgba(255,255,255,0.02))',
            fontSize: '11px',
            color: 'var(--muted)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>
              <kbd style={{ padding: '2px 5px', borderRadius: '3px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>↑</kbd>{' '}
              <kbd style={{ padding: '2px 5px', borderRadius: '3px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>↓</kbd> Navigate
            </span>
            <span>
              <kbd style={{ padding: '2px 5px', borderRadius: '3px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>↵</kbd> Select
            </span>
          </div>
          <span>
            {filteredResults.length > 0 && `${filteredResults.length} matches`}
          </span>
        </div>
      </div>
    </div>
  );
}
