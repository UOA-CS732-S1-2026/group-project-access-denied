import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext(null);

// CTF: intentionally persist a simplified cart under `cart` so players can
// tamper with prices via DevTools Application → Local Storage.
const STORAGE_KEY = 'cart';

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // parsed items have shape: { product: <id>, name, size, quantity, price }
    // Map to the internal shape used by the app so UI still renders.
    return parsed.map((it) => {
      const id = it.product;
      const key = `${id}-${it.size}-Default`;
      return {
        key,
        product: { _id: id, id, name: it.name || 'Unknown product', price: it.price || 0, images: [it.image || ''] },
        size: it.size || 'M',
        color: 'Default',
        qty: it.quantity || it.qty || 1,
      };
    });
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      // Write a simplified representation to localStorage for the CTF.
      const simplified = cart.map((item) => ({
        product: item.product._id || item.product.id,
        name: item.product.name,
        size: item.size,
        quantity: item.qty,
        price: item.product.price,
        image: item.product.images?.[0] || '',
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simplified));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [cart]);

  const addToCart = (product, { size = 'M', color = 'Default', qty = 1 } = {}) => {
    if (!product || product.isActive === false) {
      return;
    }

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
