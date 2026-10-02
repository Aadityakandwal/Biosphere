import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { PageHeader } from '@/components/UI';
import { memberApplicationsService } from '@/services';

export default function BecomeMember() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [interests, setInterests] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [website, setWebsite] = useState('');
  const formStartedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedExperience = experience.trim();
    const trimmedInterests = interests.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = trimmedPhone.replace(/\D/g, '');

    if (website.trim() || Date.now() - formStartedAt.current < 1200) {
      setError('Please take a moment to complete the form and try again.');
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(trimmedEmail) || trimmedEmail.length > 160) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (trimmedCity.length < 2 || trimmedCity.length > 80) {
      setError('Please enter your city.');
      return;
    }
    if (trimmedExperience.length < 20 || trimmedExperience.length > 2000) {
      setError('Please tell us a little more about your experience.');
      return;
    }
    if (trimmedInterests.length > 500) {
      setError('Please keep your interests under 500 characters.');
      return;
    }
    if (!accepted) {
      setError('Please confirm the declaration before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await memberApplicationsService.submitApplication({
        full_name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        city: trimmedCity,
        experience: trimmedExperience,
        interests: trimmedInterests || null,
        declaration_accepted: accepted,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '72px' }}>
      <PageHeader
        eyebrow="Join Us"
        title={<>Become part of <em>My Gardener.</em></>}
        description="Join a community of garden lovers and professionals who care about living green spaces. Whether you're a home gardener looking for regular care or an experienced gardener wanting to work with us, tell us about yourself and we'll be in touch."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          {submitted ? (
            <div className="panel-green" style={{ padding: 'clamp(40px, 6vw, 64px)', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 28px', border: '1px solid rgba(247,241,232,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={28} style={{ color: '#b9cbb4' }} />
              </div>
              <h2 style={{ color: '#f7f1e8', marginBottom: '16px' }}>Application received</h2>
              <p className="body-copy" style={{ color: '#c4cfc6', margin: '0 auto 32px', maxWidth: '440px' }}>
                Thank you, {fullName.split(' ')[0]}. We've received your application to become part of My Gardener. Our team will review it and reach out to you at {email} within a few days.
              </p>
              <Link to="/" className="btn btn--light">Back home <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="panel-green" style={{ padding: 'clamp(40px, 6vw, 64px)' }}>
              <form className="member-form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }} noValidate>
                <div className="form-trap" aria-hidden="true">
                  <label htmlFor="ma-website">Website</label>
                  <input id="ma-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label" htmlFor="ma-name" style={{ color: '#c4cfc6' }}>Full name</label>
                    <input id="ma-name" type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" maxLength={80} required style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8' }} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="ma-email" style={{ color: '#c4cfc6' }}>Email</label>
                    <input id="ma-email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={160} required style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label" htmlFor="ma-phone" style={{ color: '#c4cfc6' }}>Phone number</label>
                    <input id="ma-phone" type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" maxLength={20} required style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8' }} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="ma-city" style={{ color: '#c4cfc6' }}>City</label>
                    <input id="ma-city" type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" maxLength={80} required style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8' }} />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="ma-experience" style={{ color: '#c4cfc6' }}>Your experience</label>
                  <textarea id="ma-experience" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Tell us about your gardening experience — what you've grown, for how long, any professional background, or what you'd like to learn." rows={4} maxLength={2000} required style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8', resize: 'vertical' }} />
                </div>

                <div>
                  <label className="form-label" htmlFor="ma-interests" style={{ color: '#c4cfc6' }}>Interests <span style={{ color: 'rgba(247,241,232,0.4)', fontSize: '12px' }}>(optional)</span></label>
                  <input id="ma-interests" type="text" className="form-input" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Balcony gardening, terrace setups, professional landscaping, etc." maxLength={500} style={{ background: 'rgba(247,241,232,0.06)', borderColor: 'rgba(247,241,232,0.2)', color: '#f7f1e8' }} />
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', color: '#c4cfc6', fontSize: '13px', lineHeight: '1.6' }}>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    required
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#b9cbb4', flexShrink: 0 }}
                  />
                  <span>I confirm that whatever I have stated above is to the best of my knowledge and I accept the terms of my application to My Gardener.</span>
                </label>

                {error && <p style={{ fontSize: '13px', color: '#f0b8a0' }}>{error}</p>}

                <button type="submit" className="btn btn--light btn--lg" disabled={submitting} style={{ justifySelf: 'start' }}>
                  {submitting ? 'Submitting…' : 'Submit application'} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
