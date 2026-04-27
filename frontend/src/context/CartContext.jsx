import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext(null);

const STORAGE_KEY = 'access_denied_cart';

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [cart]);

  const addToCart = (product, { size = 'M', color = 'Default', qty = 1 } = {}) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const key = `${productId}-${size}-${color}`;
      const legacyKey = `${product.id}-${size}-${color}`;
      const existing = prev.find((item) => item.key === key || item.key === legacyKey);
      if (existing) {
        return prev.map((item) =>
          item.key === key || item.key === legacyKey
            ? { ...item, key, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { key, product, size, color, qty }];
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const value = { cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
