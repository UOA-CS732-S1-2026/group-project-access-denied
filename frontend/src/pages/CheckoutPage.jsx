import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/common/Footer';
import { createOrder } from '../api/order.api';

const STEPS = ['Shipping', 'Payment'];
const STANDARD_SHIPPING_FEE = 25;

const validators = {
  firstName: (v) => {
    if (!v.trim()) return 'First name is required';
    if (v.trim().length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Letters, hyphens, and apostrophes only';
    return '';
  },
  lastName: (v) => {
    if (!v.trim()) return 'Last name is required';
    if (v.trim().length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Letters, hyphens, and apostrophes only';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Invalid email address';
    return '';
  },
  phone: (v) => {
    if (!v.trim()) return '';
    if (!/^[\d\s+\-()]{7,15}$/.test(v.trim())) return 'Invalid phone number';
    return '';
  },
  address: (v) => {
    if (!v.trim()) return 'Street address is required';
    if (v.trim().length < 5) return 'Please enter your full street address';
    return '';
  },
  city: (v) => {
    if (!v.trim()) return 'City is required';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Invalid city name';
    return '';
  },
  state: (v) => {
    if (!v.trim()) return 'State / Province is required';
    return '';
  },
  zip: (v) => {
    if (!v.trim()) return 'ZIP / Postal Code is required';
    if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(v.trim())) return 'Invalid ZIP or postal code';
    return '';
  },
  country: (v) => {
    if (!v.trim()) return 'Country is required';
    return '';
  },
  cardName: (v) => {
    if (!v.trim()) return 'Name on card is required';
    if (v.trim().length < 2) return 'Please enter the full name on your card';
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Letters only';
    return '';
  },
  cardNumber: (v) => {
    const digits = v.replace(/\s/g, '');
    if (!digits) return 'Card number is required';
    if (!/^\d{16}$/.test(digits)) return 'Please enter a valid 16-digit card number';
    return '';
  },
  expiry: (v) => {
    if (!v.trim()) return 'Expiry date is required';
    if (!/^\d{2}\/\d{2}$/.test(v)) return 'Use MM/YY format (e.g. 07/28)';
    const [mm, yy] = v.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Month must be between 01 and 12';
    const now = new Date();
    const exp = new Date(2000 + yy, mm - 1, 1);
    if (exp < new Date(now.getFullYear(), now.getMonth(), 1)) return 'This card has expired';
    return '';
  },
  cvv: (v) => {
    if (!v.trim()) return 'CVV is required';
    if (!/^\d{3,4}$/.test(v.trim())) return 'CVV must be 3 or 4 digits';
    return '';
  },
};

const STEP_FIELDS = [
  ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'],
  ['cardName', 'cardNumber', 'expiry', 'cvv'],
];

const CheckoutPage = () => {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [stackCount] = useState(() => Number(localStorage.getItem('stackCount')) || 0);
  const [hasFreeShipping] = useState(() => localStorage.getItem('hasFreeShipping') === 'true');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const baseShipping = STANDARD_SHIPPING_FEE;
  const shipping = hasFreeShipping ? 0 : baseShipping;
  // CTF: intentional vulnerability — logic-flaw
  // 25% of ORIGINAL subtotal per valid code entry, capped at 100%
  const discountRate = Math.min(stackCount * 0.25, 1);
  const discountApplied = cartTotal * discountRate;
  const discountedSubtotal = Math.max(0, cartTotal - discountApplied);
  const total = discountedSubtotal + shipping;

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Auto-format card number as XXXX XXXX XXXX XXXX
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trimEnd();
    }

    // Auto-format expiry as MM/YY
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      value = digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    }

    // Digits only for CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    // Re-validate live once the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) ?? '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) ?? '' }));
  };

  const validateStep = (stepIndex) => {
    if (stepIndex === 1 && total === 0) return true;
    const fields = STEP_FIELDS[stepIndex];
    const newErrors = {};
    const newTouched = {};
    let valid = true;
    fields.forEach((f) => {
      newTouched[f] = true;
      const err = validators[f]?.(form[f]) ?? '';
      newErrors[f] = err;
      if (err) valid = false;
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const handleContinue = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };


  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setSubmitting(true);
    try {
      // CTF: read the simplified cart from localStorage and send the contained
      // price values directly to the server (players can tamper with these).
      const saved = localStorage.getItem('cart');
      const storageCart = saved ? JSON.parse(saved) : [];
      const itemsFromStorage = storageCart.map((it) => ({
        product: it.product,
        size: it.size,
        quantity: it.quantity,
        priceAtPurchase: it.price,
      }));

  
        const response = await createOrder({
          items: itemsFromStorage,
          total: total, // Send the correctly discounted total
          discountApplied,
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

  const inputClass = (name) =>
    `w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors placeholder:text-on-surface-variant/40 ${
      errors[name] && touched[name]
        ? 'border-red-500 focus:border-red-500'
        : 'border-outline-variant/30 focus:border-primary'
    }`;

  const labelClass = 'text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block';

  const renderError = (name) =>
    errors[name] && touched[name]
      ? <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      : null;

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
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
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

            <form onSubmit={handlePlaceOrder} noValidate>

              {/* Step 0 — Shipping */}
              {step === 0 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} onBlur={handleBlur} className={inputClass('firstName')} placeholder="Julian" />
                      {renderError('firstName')}
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} onBlur={handleBlur} className={inputClass('lastName')} placeholder="Vance" />
                      {renderError('lastName')}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} className={inputClass('email')} placeholder="you@example.com" />
                    {renderError('email')}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} className={inputClass('phone')} placeholder="+1 (555) 000-0000" />
                    {renderError('phone')}
                  </div>
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input name="address" value={form.address} onChange={handleChange} onBlur={handleBlur} className={inputClass('address')} placeholder="742 Evergreen Terrace" />
                    {renderError('address')}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>City</label>
                      <input name="city" value={form.city} onChange={handleChange} onBlur={handleBlur} className={inputClass('city')} placeholder="Springfield" />
                      {renderError('city')}
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <input name="state" value={form.state} onChange={handleChange} onBlur={handleBlur} className={inputClass('state')} placeholder="OR" />
                      {renderError('state')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>ZIP / Postal Code</label>
                      <input name="zip" value={form.zip} onChange={handleChange} onBlur={handleBlur} className={inputClass('zip')} placeholder="97403" />
                      {renderError('zip')}
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input name="country" value={form.country} onChange={handleChange} onBlur={handleBlur} className={inputClass('country')} placeholder="United States" />
                      {renderError('country')}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <div className="space-y-8">
                  {total === 0 ? (
                    <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                      <span className="material-symbols-outlined text-4xl text-green-600 mb-2">check_circle</span>
                      <h3 className="text-lg font-bold text-green-700 mb-1">Payment Not Required</h3>
                      <p className="text-sm text-green-700/80">Your balance is $0.00. You can place your order directly.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/15">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        <p className="text-xs text-on-surface-variant">Your payment information is encrypted and never stored.</p>
                      </div>
                      <div>
                        <label className={labelClass}>Name on Card</label>
                        <input name="cardName" value={form.cardName} onChange={handleChange} onBlur={handleBlur} className={inputClass('cardName')} placeholder="Julian Vance" />
                        {renderError('cardName')}
                      </div>
                      <div>
                        <label className={labelClass}>Card Number</label>
                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange} onBlur={handleBlur} className={inputClass('cardNumber')} placeholder="•••• •••• •••• ••••" maxLength={19} inputMode="numeric" />
                        {renderError('cardNumber')}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Expiry Date</label>
                          <input name="expiry" value={form.expiry} onChange={handleChange} onBlur={handleBlur} className={inputClass('expiry')} placeholder="MM/YY" maxLength={5} inputMode="numeric" />
                          {renderError('expiry')}
                        </div>
                        <div>
                          <label className={labelClass}>Security Code</label>
                          <input name="cvv" value={form.cvv} onChange={handleChange} onBlur={handleBlur} className={inputClass('cvv')} placeholder="CVV" maxLength={4} inputMode="numeric" />
                          {renderError('cvv')}
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 opacity-40 pt-4">
                        <span className="material-symbols-outlined text-2xl">credit_card</span>
                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        <span className="material-symbols-outlined text-2xl">shield</span>
                      </div>
                    </>
                  )}
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
                {step < STEPS.length - 1 && total > 0 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
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
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/15 mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-extrabold tracking-tight">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />

    </div>
  );
};

export default CheckoutPage;
