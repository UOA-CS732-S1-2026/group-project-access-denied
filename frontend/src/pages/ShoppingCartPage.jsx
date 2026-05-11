import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';

const STANDARD_SHIPPING_FEE = 25;

const ShoppingCartPage = () => {
  const { cart, removeFromCart, updateQty, cartCount, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [stackCount, setStackCount] = useState(() => Number(localStorage.getItem('stackCount')) || 0);
  const [hasFreeShipping, setHasFreeShipping] = useState(() => localStorage.getItem('hasFreeShipping') === 'true');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('stackCount', stackCount);
    localStorage.setItem('hasFreeShipping', hasFreeShipping);
  }, [stackCount, hasFreeShipping]);

  const baseShipping = STANDARD_SHIPPING_FEE;
  const shipping = hasFreeShipping ? 0 : baseShipping;
  const discountRate = Math.min(stackCount * 0.25, 1);
  const discountApplied = cartTotal * discountRate;
  const discountedSubtotal = Math.max(0, cartTotal - discountApplied);
  const orderTotal = discountedSubtotal + shipping;

  const applyPromo = () => {
    const code = promoInput.trim().toLowerCase();
    if (!code) return;
    
    if (code === 'freeship') {
      if (hasFreeShipping) {
        setPromoError('Free shipping is already applied.');
      } else {
        setHasFreeShipping(true);
        setPromoError('');
        setPromoInput('');
      }
      return;
    }

    if (code !== 'wintersale25') {
      setPromoError('Invalid promo code.');
      return;
    }
    setPromoError('');
    setPromoInput('');
    setStackCount((n) => Math.min(n + 1, 10));
  };

  const handleCheckoutClick = async (e) => {
    if (orderTotal === 0) {
      e.preventDefault();
      setSubmitting(true);
      try {
        const itemsFromStorage = cart.map((it) => ({
          product: it.product._id || it.product.id,
          size: it.size,
          quantity: it.qty,
          priceAtPurchase: it.product.price,
        }));

        const { createOrder } = await import('../api/order.api');
        const response = await createOrder({
          items: itemsFromStorage,
          total: 0, // Backend expects total: 0 to prove both free items and free shipping were achieved
          discountApplied,
          shippingAddress: {
            fullName: 'CTF Player',
            street: '1337 Bypass Ln',
            city: 'Springfield',
            postcode: '00000',
            country: 'United States',
          },
        });
        clearCart();
        const flag = response.data?.ctf?.flag || response.data?.flag;
        if (flag) {
          navigate(`/orders?flag=${encodeURIComponent(flag)}`);
        } else {
          navigate('/orders');
        }
      } catch (err) {
        console.error('Order bypass failed:', err);
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar activePage="cart" />

      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Shopping Bag</h1>
          <p className="text-on-surface-variant font-light">
            {cartCount === 0 ? 'Your bag is empty' : `${cartCount} item${cartCount !== 1 ? 's' : ''} in your selection`}
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <span className="material-symbols-outlined text-6xl text-outline/40">shopping_bag</span>
            <p className="text-on-surface-variant text-lg font-light">Your bag is currently empty.</p>
            <Link to="/products" className="mt-4 px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-12">
                {cart.map((item) => (
                  <div key={item.key} className="flex gap-8 pb-12 border-b border-outline-variant/15 last:border-0">
                    <div
                      className="w-32 h-44 bg-surface-container-highest overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/products/${item.product._id || item.product.id}`)}
                    >
                      <img
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        src={item.product.images[0]}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-on-surface mb-1">{item.product.name}</h3>
                          <p className="text-sm text-on-surface-variant mb-4">
                            {item.color !== 'Default' ? `Color: ${item.color} / ` : ''}Size: {item.size}
                          </p>
                          <div className="flex items-center gap-4 bg-surface-container-low w-fit px-3 py-1 rounded-lg">
                            <button
                              className="text-on-surface hover:text-primary transition-colors"
                              onClick={() => updateQty(item.key, -1)}
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                            <button
                              className="text-on-surface hover:text-primary transition-colors"
                              onClick={() => updateQty(item.key, 1)}
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                        </div>
                        <span className="text-lg font-medium text-on-surface">
                          ${(item.product.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button
                        className="text-sm text-outline hover:text-primary transition-colors w-fit flex items-center gap-2 mt-4"
                        onClick={() => removeFromCart(item.key)}
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 p-8 bg-surface-container-low rounded-lg">
                <h2 className="text-xl font-bold text-on-surface mb-8 tracking-tight">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {/* Promo code input */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Promo code</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                        placeholder="Enter code"
                        className="flex-1 bg-transparent border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50"
                        disabled={stackCount >= 10 || cartTotal <= 0}
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={stackCount >= 10 || cartTotal <= 0 || !promoInput.trim()}
                        className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="mt-2 text-xs text-red-500 font-semibold">{promoError}</p>
                    )}
                  </div>

                  {/* Discount row */}
                  {discountApplied > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">
                        Discount ({Math.round(discountRate * 100)}%)
                      </span>
                      <span className="text-green-700">
                        -${discountApplied.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-on-surface">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 mb-10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-on-surface">Total</span>
                    <span className="text-2xl font-bold text-on-surface tracking-tight">
                      ${orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    onClick={handleCheckoutClick}
                    className={`block w-full text-center bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded font-semibold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98] ${submitting ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {submitting ? 'Processing...' : 'Proceed to Checkout'}
                  </Link>

                </div>
                <div className="mt-12 flex justify-center gap-4 opacity-40">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />

    </div>
  );
};

export default ShoppingCartPage;
