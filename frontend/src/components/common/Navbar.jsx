import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';
import { navbarContainer, navLinkDefault, navLinkActive, cartBadge, logoText, iconButton } from './navbarStyles';

/**
 * Shared Navbar component for store pages (HomePage, ProductListing, OrderHistoryPage, ProfilePage)
 * @param {string} activePage - The current page to highlight nav item ('home', 'products', 'orders', 'account')
 */
const Navbar = ({ activePage = 'home' }) => {
  const { cartCount } = useCart();

  const isActive = (page) => activePage === page;

  const navLinkClass = (page) => {
    return isActive(page) ? navLinkActive : navLinkDefault;
  };

  return (
    <nav className={navbarContainer}>
      <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
        
        {/* Logo */}
        <Link to="/" className={logoText}>
          ATELIER
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-12">
           <Link to="/" className={navLinkClass('home')}>
            Home
          </Link>
          <Link to="/products" className={navLinkClass('products')}>
            Products
          </Link>
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
          <Link to="/cart" className={`${iconButton} relative`}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className={cartBadge}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  activePage: PropTypes.oneOf(['home', 'products', 'shoes', 'arrivals', 'orders', 'account']),
};

export default Navbar;
