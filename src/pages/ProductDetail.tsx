import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/lib/cart';
import { NotFound } from '@/components/UI';

export default function ProductDetail() {
  const { productId } = useParams();
  const product = productId ? getProductById(productId) : undefined;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <NotFound />;

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
      .slice(0, 3);
  }, [product]);

  const handleAdd = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh' }}>
      <section className="section" style={{ paddingBottom: 'clamp(32px, 4vw, 48px)' }}>
        <div className="container">
          <Link to="/shop" className="text-link" style={{ marginBottom: '32px' }}>
            <ArrowLeft size={15} /> Back to Shop
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>•</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              In Stock &amp; Ready to Ship
            </span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'start' }}>
            {/* Large Product Photography */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div
                className="glass-panel"
                style={{
                  aspectRatio: '1',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />
              </div>

              {/* Guarantees */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginTop: '20px',
                }}
              >
                <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>
                  <Truck size={16} style={{ color: 'var(--green)', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: '11px', fontWeight: 500, margin: 0 }}>Safe Transit</p>
                  <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>2–5 Days</span>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--green)', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: '11px', fontWeight: 500, margin: 0 }}>100% Organic</p>
                  <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>Non-Toxic</span>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '10px', background: 'var(--line-soft)', border: '1px solid var(--line)' }}>
                  <RefreshCw size={16} style={{ color: 'var(--terracotta)', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: '11px', fontWeight: 500, margin: 0 }}>Damaged Transit</p>
                  <span style={{ fontSize: '9.5px', color: 'var(--muted)' }}>Free Replace</span>
                </div>
              </div>
            </div>

            {/* Product Details & Ordering */}
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: '12px' }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                <span className="serif" style={{ fontSize: '36px', color: 'var(--terracotta)', fontWeight: 500 }}>
                  ₹{product.price}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Inclusive of all taxes</span>
              </div>

              <p className="body-copy" style={{ fontSize: '14.5px', lineHeight: '1.7', marginBottom: '32px' }}>
                {product.description}
              </p>

              {/* Product Specifications */}
              <div
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  marginBottom: '32px',
                }}
              >
                <p className="eyebrow" style={{ marginBottom: '10px' }}>Horticultural Information</p>
                <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: 'var(--ink)', margin: 0 }}>
                  {product.info}
                </p>
              </div>

              {/* Quantity selector */}
              <div style={{ marginBottom: '28px' }}>
                <label className="form-label" htmlFor="product-qty" style={{ marginBottom: '10px', display: 'block' }}>
                  Quantity
                </label>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    background: 'var(--paper)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    id="product-qty"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="icon-btn"
                    style={{ border: 'none', width: '44px', height: '44px', borderRadius: 0 }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '48px', textAlign: 'center', fontSize: '15px', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="icon-btn"
                    style={{ border: 'none', width: '44px', height: '44px', borderRadius: 0 }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleAdd}
                  className="btn btn--lg w-full"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: added ? 'var(--terracotta)' : undefined,
                    borderColor: added ? 'var(--terracotta)' : undefined,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Added {quantity} to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart — ₹{product.price * quantity}
                    </>
                  )}
                </button>

                {added && (
                  <Link
                    to="/cart"
                    className="btn btn--outline w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderColor: 'var(--green)',
                      color: 'var(--green)',
                    }}
                  >
                    Proceed to Cart &amp; Checkout <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '96px', borderTop: '1px solid var(--line-soft)', paddingTop: '64px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <p className="eyebrow" style={{ marginBottom: '8px' }}>From the Catalogue</p>
                  <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>Related Essentials</h2>
                </div>
                <Link to="/shop" className="text-link">
                  View full shop <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/shop/${rel.id}`}
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--line)',
                      background: 'var(--paper)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--green)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--line)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--line-soft)' }}>
                      <img src={rel.image} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span className="mono" style={{ fontSize: '9.5px', color: 'var(--terracotta)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {rel.category}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>{rel.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '16px', flex: 1 }}>
                        {rel.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--line-soft)' }}>
                        <span className="mono" style={{ fontSize: '15px', color: 'var(--terracotta)', fontWeight: 600 }}>
                          ₹{rel.price}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          View <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
