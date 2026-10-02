import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Monitor, X, ShoppingBag, ArrowUpRight, User, LogOut, Search } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useCart } from '@/lib/cart';
import { authService } from '@/services';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Shop', to: '/shop' },
  { label: 'Membership', to: '/membership' },
  { label: 'Green World', to: '/maps' },
  { label: 'About', to: '/about' },
];

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { theme, cycleTheme } = useTheme();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<number>(0);

  const handleOpenSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      window.dispatchEvent(new CustomEvent('mg:open-search'));
    }
  };

  useEffect(() => {
    const onScroll = () => {
      if (scrollRef.current) return;
      scrollRef.current = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        scrollRef.current = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await authService.getSession();
        if (mounted) setUser(session?.user ?? null);
      } catch {
        if (mounted) setUser(null);
      }
    })();

    const { data: authListener } = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  const themeIcon = theme === 'light' ? <Sun size={15} /> : theme === 'dark' ? <Moon size={15} /> : <Monitor size={15} />;
  const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <>
      <div className={`navbar-wrapper ${scrolled ? 'navbar-wrapper--scrolled' : ''}`}>
        <header className={`navbar ${transparent ? 'navbar--transparent' : ''}`}>
          <Link to="/" className="navbar-brand" aria-label="My Gardener home">
            <img className="navbar-logo" src="/logo.jpg" alt="My Gardener" />
          </Link>

          <nav className="navbar-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            {/* Search Trigger Button */}
            <button
              className="icon-btn search-trigger-btn"
              onClick={handleOpenSearch}
              aria-label="Search content (Ctrl+K)"
              title="Search (Ctrl+K)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Search size={15} />
              <span className="search-shortcut mono" style={{ fontSize: '9px', opacity: 0.7, padding: '2px 4px', border: '1px solid var(--line)', borderRadius: '3px' }}>
                ⌘K
              </span>
            </button>

            <button
              className="icon-btn"
              aria-label={`Theme: ${themeLabel}. Click to change.`}
              onClick={cycleTheme}
              title={`Theme: ${themeLabel}`}
            >
              {themeIcon}
            </button>

            <Link
              to="/cart"
              className="icon-btn cart-badge"
              data-count={itemCount}
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag size={16} />
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/profile" className="btn btn--outline" style={{ padding: '8px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} /> Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="icon-btn"
                  title="Sign out"
                  aria-label="Sign out"
                  style={{ width: '36px', height: '36px' }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="sign-in">Sign in</Link>
                <Link to="/signup" className="btn">Get started <ArrowUpRight size={13} /></Link>
              </>
            )}

            <button
              className="icon-btn menu-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </header>
      </div>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu__top">
            <img className="navbar-logo" src="/logo.jpg" alt="My Gardener" />
            <button
              className="icon-btn"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <nav>
            <button
              onClick={() => { setMenuOpen(false); handleOpenSearch(); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--line-soft)',
                color: 'var(--green)',
                fontSize: '18px',
                fontFamily: 'var(--serif)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={18} /> Search catalogue
              </span>
              <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
            </button>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
                <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
              </Link>
            ))}
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({itemCount}) <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
            </Link>
            <Link to="/free-check" onClick={() => setMenuOpen(false)}>
              Free Garden Check <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
            </Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)}>
              FAQ <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
            </Link>
            <Link to="/support" onClick={() => setMenuOpen(false)}>
              Support <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
            </Link>
          </nav>
          <div className="mobile-menu__footer">
            {user ? (
              <>
                <Link to="/profile" className="btn" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button className="btn btn--outline" onClick={() => { handleSignOut(); setMenuOpen(false); }}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="btn" onClick={() => setMenuOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
