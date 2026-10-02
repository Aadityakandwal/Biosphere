import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Plus, ArrowLeft, Calendar, Sparkles, MapPin, Compass, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/UI';
import { authService, plantHealthService } from '@/services';
import type { PlantHealthRecord } from '@/services';

type GardenPassport = {
  spaceType: string;
  city: string;
  sunlightExposure: string;
  notes: string;
};

const DEFAULT_PASSPORT: GardenPassport = {
  spaceType: 'Balcony & Indoor Garden',
  city: 'Bengaluru',
  sunlightExposure: 'Morning Direct Sunlight (East-facing)',
  notes: 'Potted foliage, herbs and flowering plants in terracotta planters.',
};

export default function ProfileGarden() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [records, setRecords] = useState<PlantHealthRecord[]>([]);
  const [passport, setPassport] = useState<GardenPassport>(DEFAULT_PASSPORT);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [editingPassport, setEditingPassport] = useState(false);
  const [addingPlant, setAddingPlant] = useState(false);

  // New plant form state
  const [plantName, setPlantName] = useState('');
  const [condition, setCondition] = useState('Healthy');
  const [careNotes, setCareNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savingPlant, setSavingPlant] = useState(false);
  const [plantError, setPlantError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1200);

    (async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          if (mounted) setLoading(false);
          return;
        }
        if (mounted) {
          setSignedIn(true);
          setUser({ id: session.user.id, email: session.user.email || '' });
          setLoading(false);
        }

        // Load passport from local storage
        const savedPassport = localStorage.getItem(`my_garden_passport_${session.user.id}`);
        if (savedPassport && mounted) {
          try {
            setPassport(JSON.parse(savedPassport));
          } catch {
            // fallback to default
          }
        }

        // Load user plant health records from Supabase with safe timeout
        const timeout = new Promise<PlantHealthRecord[]>((r) => setTimeout(() => r([]), 3000));
        const userRecords = await Promise.race([plantHealthService.getUserRecords(session.user.id), timeout]);
        if (mounted && Array.isArray(userRecords)) {
          setRecords(userRecords);
        }
      } catch (err) {
        console.warn('Failed to load garden records:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleSavePassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      localStorage.setItem(`my_garden_passport_${user.id}`, JSON.stringify(passport));
    }
    setEditingPassport(false);
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) {
      setPlantError('Please enter a plant name or species.');
      return;
    }
    if (!user?.id) return;

    setSavingPlant(true);
    setPlantError('');
    try {
      const newRecord = await plantHealthService.saveRecord({
        user_id: user.id,
        plant_name: plantName.trim(),
        condition: condition.trim(),
        care_notes: careNotes.trim() || null,
        image_url: imageUrl.trim() || null,
      });
      setRecords([newRecord, ...records]);
      setPlantName('');
      setCondition('Healthy');
      setCareNotes('');
      setImageUrl('');
      setAddingPlant(false);
    } catch (err) {
      setPlantError(err instanceof Error ? err.message : 'Could not save plant record. Please try again.');
    } finally {
      setSavingPlant(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to remove this plant entry from your garden?')) return;
    try {
      await plantHealthService.deleteRecord(recordId);
      setRecords(records.filter((r) => r.id !== recordId));
    } catch (err) {
      console.error('Failed to delete plant record:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading Garden Dashboard…</div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '80vh' }}>
        <div className="container">
          <EmptyState
            icon={<Leaf size={26} />}
            title="Sign in to view My Garden"
            description="Your garden records, documented plants and passport are tied to your account."
            action={<Link to="/login" className="btn">Sign in</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Garden Dashboard"
        title={<>Your garden at a <em>glance.</em></>}
        description="A living record of your space, documented plants, species logs and care observations."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {/* Garden Passport Section */}
          <div className="profile-feature-card" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <p className="eyebrow eyebrow--accent">
                  <span className="eyebrow-dot" /> Garden Passport
                </p>
                <h3 style={{ fontSize: '22px', marginTop: '4px' }}>Space Specifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPassport(!editingPassport)}
                className="btn btn--outline"
                style={{ padding: '8px 16px', fontSize: '11px' }}
              >
                {editingPassport ? 'Cancel Edit' : 'Edit Passport'}
              </button>
            </div>

            {editingPassport ? (
              <form onSubmit={handleSavePassport}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Garden Space Type</label>
                    <input
                      type="text"
                      className="form-input"
                      value={passport.spaceType}
                      onChange={(e) => setPassport({ ...passport, spaceType: e.target.value })}
                      placeholder="e.g. Balcony, Terrace Garden, Villa Grounds"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={passport.city}
                      onChange={(e) => setPassport({ ...passport, city: e.target.value })}
                      placeholder="e.g. Bengaluru, Mumbai, Delhi"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sunlight / Exposure</label>
                  <input
                    type="text"
                    className="form-input"
                    value={passport.sunlightExposure}
                    onChange={(e) => setPassport({ ...passport, sunlightExposure: e.target.value })}
                    placeholder="e.g. East-facing morning sun, filtered shade"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Garden Notes / Composition</label>
                  <textarea
                    className="form-input"
                    value={passport.notes}
                    onChange={(e) => setPassport({ ...passport, notes: e.target.value })}
                    placeholder="Describe containers, plant species, microclimate..."
                    rows={2}
                  />
                </div>
                <button type="submit" className="btn" style={{ fontSize: '12px', padding: '10px 20px' }}>
                  Save Passport Details
                </button>
              </form>
            ) : (
              <div className="garden-passport-box" style={{ margin: 0 }}>
                <div>
                  <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>
                    <MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} /> Space &amp; City
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>
                    {passport.spaceType} ({passport.city})
                  </p>
                </div>
                <div>
                  <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>
                    <Compass size={11} style={{ display: 'inline', marginRight: '4px' }} /> Light &amp; Orientation
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>
                    {passport.sunlightExposure}
                  </p>
                </div>
                <div>
                  <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>
                    <Leaf size={11} style={{ display: 'inline', marginRight: '4px' }} /> Documented Plants
                  </p>
                  <p className="serif" style={{ fontSize: '24px', color: 'var(--terracotta)', lineHeight: 1 }}>
                    {records.length} {records.length === 1 ? 'Specimen' : 'Specimens'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Plant Records / Collection Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <p className="eyebrow">Documented Plants</p>
              <h2 style={{ fontSize: '28px' }}>Your Plant Collection</h2>
            </div>
            <button
              type="button"
              onClick={() => setAddingPlant(true)}
              className="btn"
              style={{ fontSize: '12px', padding: '10px 18px' }}
            >
              <Plus size={15} /> Document Plant
            </button>
          </div>

          {/* Add Plant Modal / Form Drawer */}
          {addingPlant && (
            <div
              className="glass-panel"
              style={{
                background: 'var(--ivory)',
                padding: '28px',
                borderRadius: '10px',
                border: '1px solid var(--green)',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--green)' }}>Document New Plant</h3>
                <button
                  onClick={() => setAddingPlant(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {plantError && (
                <p style={{ fontSize: '12.5px', color: 'var(--terracotta)', marginBottom: '14px' }}>
                  {plantError}
                </p>
              )}

              <form onSubmit={handleAddPlant}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Plant Name / Species *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={plantName}
                      onChange={(e) => setPlantName(e.target.value)}
                      placeholder="e.g. Monstera Deliciosa, Fiddle Leaf Fig"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Observed Condition</label>
                    <select
                      className="form-input"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="Thriving & Healthy">Thriving &amp; Healthy</option>
                      <option value="Stable / Growing">Stable / Growing</option>
                      <option value="Needs Pruning / Repotting">Needs Pruning / Repotting</option>
                      <option value="Under Stress / Yellowing">Under Stress / Yellowing</option>
                      <option value="Pest Inspection Needed">Pest Inspection Needed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Photo URL (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... image link or leave blank"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Care Notes / Placement</label>
                  <textarea
                    className="form-input"
                    value={careNotes}
                    onChange={(e) => setCareNotes(e.target.value)}
                    placeholder="e.g. Living room corner, watered weekly, bio-tonic applied..."
                    rows={2}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn" disabled={savingPlant}>
                    {savingPlant ? 'Saving Plant…' : 'Save to Garden'} <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingPlant(false)}
                    className="btn btn--outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Plant Records List / Empty State */}
          {records.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 20px', background: 'var(--paper)', borderRadius: '12px' }}>
              <div className="es-icon" style={{ borderColor: 'var(--line)' }}>
                <Leaf size={24} style={{ color: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '24px' }}>Your garden is ready to be documented.</h3>
              <p className="body-copy" style={{ margin: '8px auto 24px', maxWidth: '440px' }}>
                Keep a clean journal of the plants growing in your home, balcony, or terrace. Add notes, conditions, and photographs.
              </p>
              <button
                type="button"
                onClick={() => setAddingPlant(true)}
                className="btn"
              >
                <Plus size={15} /> Set up My Garden
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {records.map((record) => (
                <div key={record.id} className="garden-plant-item">
                  {record.image_url ? (
                    <div style={{ height: '160px', overflow: 'hidden', background: 'var(--paper)' }}>
                      <img
                        src={record.image_url}
                        alt={record.plant_name || 'Plant'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: '100px',
                        background: 'color-mix(in srgb, var(--paper) 75%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid var(--line-soft)',
                      }}
                    >
                      <Leaf size={28} style={{ color: 'var(--sage)', opacity: 0.7 }} />
                    </div>
                  )}

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <p className="serif" style={{ fontSize: '19px', color: 'var(--green)', lineHeight: 1.2 }}>
                        {record.plant_name || 'Unnamed Specimen'}
                      </p>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        aria-label="Delete plant record"
                        style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {record.condition && (
                      <span
                        className="mono"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--terracotta)',
                          marginTop: '6px',
                        }}
                      >
                        {record.condition}
                      </span>
                    )}

                    {record.care_notes && (
                      <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5, marginTop: '10px', flex: 1 }}>
                        {record.care_notes}
                      </p>
                    )}

                    <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--line-soft)' }}>
                      <Calendar size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      Documented {new Date(record.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Recommendation Banner */}
          <div className="glass-panel" style={{ marginTop: '56px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>Need expert assistance?</p>
              <h3 style={{ fontSize: '20px' }}>Book an on-site garden check</h3>
              <p className="body-copy" style={{ fontSize: '13.5px', marginTop: '4px' }}>
                Our specialists will inspect your plants in person, assess root condition, and provide customized recommendations.
              </p>
            </div>
            <Link to="/free-check" className="btn">
              Free Garden Check
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
