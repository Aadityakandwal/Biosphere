import { useEffect, useState, useRef, useMemo } from 'react';
import { MapPin, Navigation, Search, Sparkles } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { curatedPlaces, Place } from '@/data/places';

const categories = ['All Green Spaces', 'Nurseries', 'Garden Stores', 'Plant Shops', 'Parks', 'Botanical Gardens'];

const categoryKeywords: Record<string, string[]> = {
  'Nurseries': ['nursery', 'garden nursery'],
  'Garden Stores': ['garden store', 'garden centre', 'garden center'],
  'Plant Shops': ['plant shop', 'plant store'],
  'Parks': ['park', 'garden park'],
  'Botanical Gardens': ['botanical garden'],
};

export default function Maps() {
  const [category, setCategory] = useState('All Green Spaces');
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>(curatedPlaces);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'denied' | 'unavailable'>('idle');
  const mapRef = useRef<HTMLDivElement>(null);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesCategory = category === 'All Green Spaces' || p.category === category;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [places, category, query]);

  const requestLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('idle');
      },
      () => {
        setLocationStatus('denied');
      }
    );
  };

  const searchPlaces = async () => {
    if (!query && category === 'All Green Spaces' && !location) {
      setPlaces(curatedPlaces);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const keywords =
        category === 'All Green Spaces'
          ? Object.values(categoryKeywords).flat()
          : categoryKeywords[category] || [];
      const searchTerm = query || keywords.join(' OR ');
      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=20`;
      const res = await fetch(endpoint, { headers: { 'Accept-Language': 'en' } });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        // Fallback to searching curated
        const localMatches = curatedPlaces.filter((p) => {
          const matchCat = category === 'All Green Spaces' || p.category === category;
          const matchQ = query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()) : true;
          return matchCat && matchQ;
        });
        setPlaces(localMatches.length > 0 ? localMatches : curatedPlaces);
      } else {
        const mapped: Place[] = data.map((r: { place_id: string; display_name: string; lat: string; lon: string }) => {
          const parts = r.display_name.split(',');
          return {
            id: r.place_id,
            name: parts[0],
            category,
            address: r.display_name,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          };
        });
        setPlaces(mapped);
      }
    } catch {
      // Graceful fallback to curated data
      const localMatches = curatedPlaces.filter((p) => {
        const matchCat = category === 'All Green Spaces' || p.category === category;
        const matchQ = query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()) : true;
        return matchCat && matchQ;
      });
      setPlaces(localMatches.length > 0 ? localMatches : curatedPlaces);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) searchPlaces();
  }, [location]);

  return (
    <div style={{ paddingTop: '72px' }}>
      <PageHeader
        eyebrow="Green World — Discovery"
        title={<>Discover green spaces <em>around you.</em></>}
        description="Find nurseries, garden stores, plant shops, parks and botanical gardens near your location. Real places, real directions."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Glass Search and Category rail */}
          <div className="reveal-init" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            <div className="search-input-wrapper">
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
                  transition: 'all 0.25s ease',
                }}
                placeholder="Search green spaces by name or area…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchPlaces()}
              />
            </div>
            <div className="category-scroll-row">
              {categories.map((cat) => (
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

          <div className="reveal-init" data-delay="1" style={{ display: 'flex', gap: '14px', marginBottom: '36px' }}>
            <button
              onClick={requestLocation}
              className="btn btn--outline"
              style={{ borderRadius: '9999px' }}
            >
              <Navigation size={14} /> Use my location
            </button>
            <button
              onClick={searchPlaces}
              className="btn"
              style={{ borderRadius: '9999px' }}
            >
              Search Green World
            </button>
          </div>

          {locationStatus === 'denied' && (
            <p style={{ fontSize: '13px', color: 'var(--terracotta)', marginBottom: '20px' }}>
              Location permission was denied. You can still search by name or category.
            </p>
          )}
          {locationStatus === 'unavailable' && (
            <p style={{ fontSize: '13px', color: 'var(--terracotta)', marginBottom: '20px' }}>
              Location services are not available on this device.
            </p>
          )}

          <div
            className="reveal-init"
            data-delay="2"
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}
          >
            {/* Map Frame with Glass Edge */}
            <div
              ref={mapRef}
              className="glass-panel"
              style={{
                height: '520px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
              }}
            >
              {filteredPlaces.length > 0 ? (
                <iframe
                  title="Green World Map"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    Math.min(...filteredPlaces.map((p) => p.lng)) - 0.01
                  },${Math.min(...filteredPlaces.map((p) => p.lat)) - 0.01},${
                    Math.max(...filteredPlaces.map((p) => p.lng)) + 0.01
                  },${
                    Math.max(...filteredPlaces.map((p) => p.lat)) + 0.01
                  }&layer=mapnik&marker=${filteredPlaces[0].lat},${filteredPlaces[0].lng}`}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '32px',
                    textAlign: 'center',
                  }}
                >
                  <MapPin size={32} style={{ color: 'var(--sage)', marginBottom: '16px' }} />
                  <p className="body-copy">Search or use your location to discover nurseries, botanical gardens and parks.</p>
                </div>
              )}
            </div>

            {/* Places List */}
            <div>
              {loading && <div className="loading-state">Finding green spaces…</div>}
              {error && <p style={{ fontSize: '14px', color: 'var(--terracotta)' }}>{error}</p>}
              {!loading && !error && filteredPlaces.length === 0 && (
                <EmptyState
                  icon={<MapPin size={24} />}
                  title="No places found"
                  description="Try a different search query or select another category above."
                />
              )}
              {filteredPlaces.length > 0 && (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {filteredPlaces.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '20px 12px',
                        borderBottom: '1px solid var(--line-soft)',
                        borderRadius: '6px',
                        transition: 'all 0.25s ease',
                      }}
                      className="hover:pl-4 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <p className="serif" style={{ fontSize: '19px', color: 'var(--green)' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.5 }}>
                        {p.address}
                      </p>
                      <a
                        href={`https://www.openstreetmap.org/directions?from=&to=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                        style={{ marginTop: '10px' }}
                      >
                        Get directions <Navigation size={13} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
