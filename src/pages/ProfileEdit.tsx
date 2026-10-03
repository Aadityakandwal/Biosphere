import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { authService, profilesService } from '@/services';
import type { Profile } from '@/services';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fallbackTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1200);

    (async () => {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }
        if (mounted) {
          setEmail(session.user.email || '');
          setName(session.user.user_metadata?.full_name || '');
          setLoading(false);
        }
        const timeout = new Promise<Profile | null>((r) => setTimeout(() => r(null), 3000));
        const profile = await Promise.race([profilesService.getProfile(session.user.id), timeout]);
        if (mounted && profile) {
          if (profile.full_name) setName(profile.full_name);
          if (profile.phone) setPhone(profile.phone);
        }
      } catch (err) {
        console.warn('Failed to load profile details:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const session = await authService.getSession();
      if (!session?.user) return;
      await profilesService.updateProfile(session.user.id, {
        full_name: name.trim(),
        phone: phone.trim(),
        email,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '60vh' }}>
        <div className="loading-state">Loading personal details…</div>
      </div>
    );
  }

  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || (email ? email[0].toUpperCase() : 'G');

  return (
    <div style={{ paddingTop: '96px' }}>
      <PageHeader
        eyebrow="Personal Information"
        title={<>Edit your <em>details.</em></>}
        description="Update your name, contact phone number, and service account preferences."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '580px' }}>
          <Link to="/profile" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={14} /> Back to account hub
          </Link>

          {saved && (
            <div className="legal-callout" style={{ marginBottom: '24px', borderLeftColor: 'var(--green)' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> Changes saved successfully to your My Gardener profile.
              </p>
            </div>
          )}

          {error && (
            <div className="legal-callout" style={{ marginBottom: '24px', borderLeftColor: 'var(--terracotta)' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </p>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '36px 32px' }}>
            {/* Avatar Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--line-soft)' }}>
              <div className="profile-avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                {initials}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green)' }}>
                  {name || 'Gardener'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="pe-name">
                  <User size={11} style={{ display: 'inline', marginRight: '4px' }} /> Full Name
                </label>
                <input
                  type="text"
                  id="pe-name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pe-phone">
                  <Phone size={11} style={{ display: 'inline', marginRight: '4px' }} /> Phone Number
                </label>
                <input
                  type="tel"
                  id="pe-phone"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number for visit coordination"
                />
                <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
                  Used by our gardening personnel to contact you prior to on-site visits.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pe-email">
                  <Mail size={11} style={{ display: 'inline', marginRight: '4px' }} /> Primary Email
                </label>
                <input
                  type="email"
                  id="pe-email"
                  className="form-input"
                  value={email}
                  disabled
                  style={{ opacity: 0.65, cursor: 'not-allowed', background: 'var(--paper)' }}
                />
                <p className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
                  Your primary authentication email address.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" className="btn btn--lg" disabled={saving}>
                  {saving ? 'Saving changes…' : 'Save Changes'} <Check size={14} />
                </button>
                <Link to="/profile" className="btn btn--outline">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
