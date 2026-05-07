import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cartBadge } from '../components/common/navbarStyles';
import Footer from '../components/common/Footer';
import { createOrder } from '../api/order.api';

const STEPS = ['Shipping', 'Payment'];
const STANDARD_SHIPPING_FEE = 25;

const CheckoutPage = () => {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const shipping = cartTotal >= 500 ? 0 : STANDARD_SHIPPING_FEE;
  const total = cartTotal + shipping;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOrder({
        items: cart.map((item) => ({
          product: item.product._id,
          size: item.size,
          quantity: item.qty,
          priceAtPurchase: item.product.price,
        })),
        total,
        shippingAddress: {
          fullName: `${form.firstName} ${form.lastName}`,
          street: form.address,
          city: form.city,
          postcode: form.zip,
          country: form.country,
        },
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Order failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-transparent border-b border-outline-variant/30 py-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40';
  const labelClass = 'text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block';

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">APAPPAREL</Link>
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant">
            {STEPS.map((s, i) => (
              <span key={s} className={`flex items-center gap-2 ${i <= step ? 'text-primary' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary' : 'border-outline-variant/30 text-on-surface-variant/40'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
                {i < STEPS.length - 1 && <span className="text-outline-variant/30 ml-2">—</span>}
              </span>
            ))}
          </div>
          <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative text-[#994127]">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className={cartBadge}>{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left — Form */}
          <div className="lg:col-span-7">
            <div className="mb-10">
              <Link to="/cart" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit mb-6">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Bag
              </Link>
              <span className="text-xs uppercase tracking-[0.2em] text-outline font-semibold mb-2 block">Secure Checkout</span>
              <h1 className="text-4xl font-bold tracking-tighter text-on-surface">{STEPS[step]}</h1>
            </div>

            <form onSubmit={handlePlaceOrder}>

              {/* Step 0 — Shipping */}
              {step === 0 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} placeholder="Julian" required />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Vance" required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="742 Evergreen Terrace" required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>City</label>
                      <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Springfield" required />
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <input name="state" value={form.state} onChange={handleChange} className={inputClass} placeholder="OR" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>ZIP / Postal Code</label>
                      <input name="zip" value={form.zip} onChange={handleChange} className={inputClass} placeholder="97403" required />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input name="country" value={form.country} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/15">
                    <span className="material-symbols-outlined text-primary">lock</span>
                    <p className="text-xs text-on-surface-variant">Your payment information is encrypted and never stored.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Name on Card</label>
                    <input name="cardName" value={form.cardName} onChange={handleChange} className={inputClass} placeholder="Julian Vance" required />
                  </div>
                  <div>
                    <label className={labelClass}>Card Number</label>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputClass} placeholder="•••• •••• •••• ••••" maxLength={19} required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Expiry Date</label>
                      <input name="expiry" value={form.expiry} onChange={handleChange} className={inputClass} placeholder="MM / YY" maxLength={7} required />
                    </div>
                    <div>
                      <label className={labelClass}>Security Code</label>
                      <input name="cvv" value={form.cvv} onChange={handleChange} className={inputClass} placeholder="CVV" maxLength={4} required />
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 opacity-40 pt-4">
                    <span className="material-symbols-outlined text-2xl">credit_card</span>
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    <span className="material-symbols-outlined text-2xl">shield</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-12 flex gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 py-4 border border-outline/20 hover:border-primary/40 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="flex-1 py-4 bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    Continue to {STEPS[step + 1]}
                    <span className="material-symbols-outlined text-sm ml-2 align-middle">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? 'Placing Order...' : `Place Order — $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-surface-container-low rounded-xl p-8">
              <h2 className="text-lg font-bold tracking-tight text-on-surface mb-6">Your Bag ({cartCount})</h2>

              {cart.length === 0 ? (
                <p className="text-sm text-on-surface-variant font-light">Your bag is empty.</p>
              ) : (
                <div className="space-y-6 mb-8">
                  {cart.map((item) => (
                    <div key={item.key} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-container-highest rounded flex-shrink-0 overflow-hidden">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-on-surface leading-tight">{item.product.name}</p>
                        <p className="text-xs text-on-surface-variant mt-1">Size: {item.size} · Qty: {item.qty}</p>
                        <p className="text-sm font-bold text-primary mt-2">${(item.product.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-outline-variant/15 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/15 mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-extrabold tracking-tight">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {cartTotal >= 500 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-green-700 font-semibold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Complimentary shipping applied
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />

    </div>
  );
};

export default CheckoutPage;
