import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { authService, reviewsService } from '@/services';

export default function BookingReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const session = await authService.getSession();
      if (!session?.user) { setError('Please sign in to leave a review.'); setSubmitting(false); return; }
      await reviewsService.createReview({
        user_id: session.user.id,
        rating,
        review_text: review.trim() || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ paddingTop: '72px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={28} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ marginBottom: '16px' }}>Thank you</h1>
          <p className="body-copy" style={{ margin: '0 auto 32px' }}>Your review has been submitted.</p>
          <Link to="/bookings" className="btn">Back to bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '72px' }}>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <Link to="/bookings" className="text-link" style={{ marginBottom: '32px' }}><ArrowLeft size={15} /> All bookings</Link>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Service review</p>
          <h1>Rate your service</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <p className="form-label" style={{ marginBottom: '12px' }}>Rating</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Star size={28} fill={n <= rating ? 'currentColor' : 'none'} style={{ color: n <= rating ? 'var(--terracotta)' : 'var(--line)' }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="review-text">Your review (optional)</label>
              <textarea id="review-text" className="form-input" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your experience…" />
            </div>
            {error && <p style={{ fontSize: '13px', color: 'var(--terracotta)', marginBottom: '20px' }}>{error}</p>}
            <button type="submit" className="btn btn--lg" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit review'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
