import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const navLinkBase = "font-['Manrope'] tracking-tight transition-colors";
const navLinkDefault = `text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] ${navLinkBase}`;
const navLinkActive = `text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 ${navLinkBase}`;
const SESSION_WARNING_THRESHOLD_MS = 10 * 60 * 1000;

const formatDuration = (durationMs) => {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const SessionTimer = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const [now, setNow] = useState(() => Date.now());
  const [hasExpired, setHasExpired] = useState(false);
  const expiryHandledRef = useRef(false);
  const [sessionExpiry] = useState(() => {
    const saved = Number(localStorage.getItem('sessionExpiry'));
    return Number.isFinite(saved) ? saved : null;
  });

  useEffect(() => {
    if (!user || !sessionExpiry || hasExpired) {
      return undefined;
    }

    const currentNow = Date.now();
    setNow(currentNow);
    if (currentNow >= sessionExpiry) {
      setHasExpired(true);
      return undefined;
    }

    const tick = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      if (currentNow >= sessionExpiry) {
        setHasExpired(true);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [user, sessionExpiry, hasExpired]);

  useEffect(() => {
    if (!hasExpired || expiryHandledRef.current) {
      return undefined;
    }

    expiryHandledRef.current = true;
    clearCart();
    logout();

    const redirect = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1500);

    return () => clearTimeout(redirect);
  }, [hasExpired, clearCart, logout, navigate]);

  if (!hasExpired && (!user || !sessionExpiry)) {
    return null;
  }

  if (hasExpired) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1c1b1b]/70 backdrop-blur-sm px-4">
        <div className="w-full max-w-md rounded-2xl bg-[#fcf9f8] dark:bg-[#1c1b1b] border border-[#dcc1ba]/30 shadow-2xl p-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#994127] mb-3">Session expired</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1c1b1b] dark:text-[#fcf9f8] mb-3">Your session has ended</h2>
          <p className="text-sm text-[#56423d] dark:text-[#dcc1ba] leading-relaxed">
            Your session has expired and your data has been cleared. You&apos;ll be redirected to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  const remainingMs = sessionExpiry - now;
  const remainingLabel = formatDuration(remainingMs);
  const isWarning = remainingMs <= SESSION_WARNING_THRESHOLD_MS;

  return (
    <div className={`flex flex-col items-end leading-none ${isWarning ? 'text-red-600' : 'text-[#56423d] dark:text-[#dcc1ba]'}`}>
      <span className="text-[10px] uppercase tracking-[0.28em] font-bold opacity-70">Session</span>
      <span className="font-mono text-sm mt-1">{remainingLabel}</span>
    </div>
  );
};

/**
 * Shared Navbar component for store pages (HomePage, ProductListing, OrderHistoryPage, ProfilePage)
 * @param {string} activePage - The current page to highlight nav item ('home', 'products', 'orders', 'account', 'admin')
 */
const Navbar = ({ activePage = 'home' }) => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  const isActive = (page) => activePage === page;

  const navLinkClass = (page) => {
    return isActive(page) ? navLinkActive : navLinkDefault;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">

        {/* Logo */}
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="text-sm font-bold tracking-[0.2em] uppercase text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">
          APAPPAREL
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          {user?.role === 'admin' ? (
            <Link to="/admin" className={navLinkClass('admin')}>
              Admin
            </Link>
          ) : (
            <>
              <Link to="/" className={navLinkClass('home')}>
                Home
              </Link>
              <Link to="/products" className={navLinkClass('products')}>
                Products
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-6 text-[#56423d] dark:text-[#dcc1ba]">
          <SessionTimer />
          <Link to="/account" className={`hover:opacity-80 transition-opacity duration-300 ${activePage === 'account' ? 'text-[#994127]' : ''}`}>
            <span className="material-symbols-outlined">person</span>
          </Link>
          {user?.role !== 'admin' && (
            <Link
              to="/cart"
              className={`relative hover:opacity-80 transition-opacity duration-300 text-[#56423d] dark:text-[#dcc1ba] ${
                isActive('cart') ? 'text-[#994127] font-semibold border-b-2 border-[#994127]' : ''
              }`}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#994127] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  activePage: PropTypes.oneOf(['home', 'products', 'orders', 'account', 'cart', 'admin']),
};

export default Navbar;
