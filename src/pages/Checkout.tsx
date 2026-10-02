import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { authService, ordersService } from '@/services';

import { openRazorpayPayment } from '@/lib/razorpay';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0 && !confirmed) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
          <p className="body-copy" style={{ margin: '0 auto 28px' }}>Add products before proceeding to checkout.</p>
          <Link to="/shop" className="btn">Visit shop</Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setSubmitting(true);
    setError('');

    try {
      const session = await authService.getSession();
      const userId = session?.user?.id || null;

      const { order } = await ordersService.createOrderWithItems({
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        address_line: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        total: subtotal,
        user_id: userId,
        items,
      });

      // Launch Razorpay payment popup
      await openRazorpayPayment({
        amount: subtotal,
        name: 'My Gardener Shop',
        description: `Order #${order.id.slice(0, 8)} — Garden Essentials`,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        notes: {
          order_id: order.id,
          city: city.trim(),
        },
        onSuccess: async (response) => {
          await ordersService.updateOrderStatus(
            order.id,
            'confirmed',
            response.razorpay_payment_id,
            response.razorpay_order_id
          );
          clearCart();
          setConfirmed(true);
        },
        onDismiss: () => {
          setError('Payment was not completed. Your order is saved as pending.');
          setSubmitting(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', margin: '0 auto 28px', border: '1px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={30} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ marginBottom: '16px' }}>Order confirmed</h1>
          <p className="body-copy" style={{ margin: '0 auto 32px' }}>
            Thank you. Your order has been confirmed and will be processed shortly. A confirmation has been sent to {email}.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/shop" className="btn">Continue shopping</Link>
            <Link to="/" className="btn btn--outline">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div className="container">
          <Link to="/cart" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={15} /> Back to cart
          </Link>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Checkout</p>
          <h1>Complete your order</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 12vw, 144px)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start' }}>
            {/* Form */}
            <div>
              <h3 style={{ marginBottom: '24px' }}>Delivery details</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="co-name">Full name</label>
                <input type="text" id="co-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-email">Email</label>
                  <input type="email" id="co-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-phone">Phone</label>
                  <input type="tel" id="co-phone" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="co-address">Address</label>
                <textarea id="co-address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, area" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-city">City</label>
                  <input type="text" id="co-city" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="co-pincode">Pincode</label>
                  <input type="text" id="co-pincode" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--paper)', padding: '32px 28px', position: 'sticky', top: '100px' }}>
              <p className="eyebrow" style={{ marginBottom: '20px' }}>Order summary</p>
              {items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                  <div>
                    <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{item.name}</p>
                    <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>Qty: {item.quantity}</p>
                  </div>
                  <span className="mono" style={{ fontSize: '13px', color: 'var(--green)' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', marginTop: '12px', borderTop: '1px solid var(--line)' }}>
                <span style={{ fontSize: '14px' }}>Total</span>
                <span className="serif" style={{ fontSize: '28px', color: 'var(--green)' }}>₹{subtotal}</span>
              </div>

              <button onClick={handleCheckout} className="btn btn--lg w-full" style={{ marginTop: '24px' }} disabled={submitting || !name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()}>
                {submitting ? 'Processing…' : `Pay ₹${subtotal}`}
              </button>

              {error && <p style={{ fontSize: '12px', color: 'var(--terracotta)', marginTop: '14px', lineHeight: '1.5' }}>{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
