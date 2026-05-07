import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PropTypes from 'prop-types';

const navLinkBase = "font-['Manrope'] tracking-tight transition-colors";
const navLinkDefault = `text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] ${navLinkBase}`;
const navLinkActive = `text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 ${navLinkBase}`;

const Navbar = ({ activePage = 'home' }) => {
  const { cartCount } = useCart();

  const navLinkClass = (page) => activePage === page ? navLinkActive : navLinkDefault;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">

        <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">
          APAPPAREL
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className={navLinkClass('home')}>Home</Link>
          <Link to="/products" className={navLinkClass('products')}>Products</Link>
        </div>

        <div className="flex items-center space-x-6 text-[#56423d] dark:text-[#dcc1ba]">
          <Link to="/account" className={`hover:opacity-80 transition-opacity duration-300 ${activePage === 'account' ? 'text-[#994127]' : ''}`}>
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
  activePage: PropTypes.oneOf(['home', 'products', 'orders', 'account', 'cart']),
};

export default Navbar;
