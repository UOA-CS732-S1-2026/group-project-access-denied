import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { navbarContainer, navLinkDefault, navLinkActive, cartBadge, logoText, iconButton } from './navbarStyles';

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
    <nav className={navbarContainer}>
      <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">

        {/* Logo */}
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className={logoText}>
          APAPPAREL
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Icons (Profile, Cart) */}
        <div className="flex items-center space-x-6 text-[#56423d] dark:text-[#dcc1ba]">
          <Link
            to="/account"
            className={`${iconButton} ${
              isActive('account') ? 'text-[#994127] font-semibold border-b-2 border-[#994127]' : ''
            }`}
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
          {user?.role !== 'admin' && (
            <Link
              to="/cart"
              className={`${iconButton} relative ${
                isActive('cart') ? 'text-[#994127] font-semibold border-b-2 border-[#994127]' : ''
              }`}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className={cartBadge}>
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
