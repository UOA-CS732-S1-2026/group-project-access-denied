import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';

/**
 * Shared Navbar component for store pages (HomePage, ProductListing, OrderHistoryPage, ProfilePage)
 * @param {string} activePage - The current page to highlight nav item ('home', 'products', 'orders', 'account')
 */
const Navbar = ({ activePage = 'home' }) => {
  const { cartCount } = useCart();

  const isActive = (page) => activePage === page;

  const navLinkClass = (page) => {
    const baseClass = "font-['Manrope'] tracking-tight transition-colors";
    return isActive(page)
      ? `text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 ${baseClass}`
      : `text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] ${baseClass}`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">
          ATELIER
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/products" className={navLinkClass('products')}>
            Clothes
          </Link>
          <Link to="/products" className={navLinkClass('shoes')}>
            Shoes
          </Link>
          <Link to="/#new-arrivals" className={navLinkClass('arrivals')}>
            New Arrivals
          </Link>
        </div>

        {/* Icons (Profile, Cart) */}
        <div className="flex items-center space-x-6 text-[#56423d] dark:text-[#dcc1ba]">
          <Link
            to="/account"
            className={`hover:opacity-80 transition-opacity duration-300 ${
              isActive('account') ? 'text-[#994127] font-semibold border-b-2 border-[#994127]' : ''
            }`}
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
          <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
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
