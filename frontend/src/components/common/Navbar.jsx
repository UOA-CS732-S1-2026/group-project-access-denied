import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const navLinkBase = "font-['Manrope'] tracking-tight transition-colors";
const navLinkDefault = `text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] ${navLinkBase}`;
const navLinkActive = `text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 ${navLinkBase}`;

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
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className={logoText}>
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
          <Link to="/account" className={`hover:opacity-80 transition-opacity duration-300 ${activePage === 'account' ? 'text-[#994127]' : ''}`}>
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
