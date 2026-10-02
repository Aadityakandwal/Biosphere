import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { EmptyState } from '@/components/UI';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '96px', minHeight: '100vh' }}>
        <div className="container">
          <EmptyState
            icon={<ShoppingBag size={26} />}
            title="Your cart is empty"
            description="Browse the shop for tonics, plants, tools and planters."
            action={<Link to="/shop" className="btn">Visit shop <ArrowRight size={15} /></Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px' }}>
      <section className="section" style={{ paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Cart</p>
          <h1>Your cart</h1>
          <p className="body-copy" style={{ marginTop: '16px' }}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 'clamp(80px, 12vw, 144px)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {items.map((item) => (
              <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: '24px', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ width: '80px', height: '80px', overflow: 'hidden', background: 'var(--paper)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', lineHeight: '1.4' }}>{item.name}</p>
                  <p className="mono" style={{ fontSize: '13px', color: 'var(--terracotta)', marginTop: '4px' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--line)' }}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="icon-btn" style={{ border: 'none', width: '36px', height: '36px' }} aria-label="Decrease"><Minus size={14} /></button>
                  <span style={{ width: '40px', textAlign: 'center', fontSize: '13px', fontFamily: 'var(--mono)' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="icon-btn" style={{ border: 'none', width: '36px', height: '36px' }} aria-label="Increase"><Plus size={14} /></button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className="mono" style={{ fontSize: '15px', color: 'var(--green)' }}>₹{item.price * item.quantity}</span>
                  <button onClick={() => removeItem(item.productId)} className="icon-btn" aria-label="Remove item" style={{ color: 'var(--muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <Link to="/shop" className="text-link">
              <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Continue shopping
            </Link>
            <div style={{ textAlign: 'right' }}>
              <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Subtotal</p>
              <p className="serif" style={{ fontSize: '36px', color: 'var(--green)' }}>₹{subtotal}</p>
              <Link to="/checkout" className="btn btn--lg" style={{ marginTop: '16px' }}>
                Proceed to checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
