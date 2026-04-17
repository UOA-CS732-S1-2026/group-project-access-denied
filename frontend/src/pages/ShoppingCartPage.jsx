import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useCart } from '../context/CartContext';

const ShoppingCartPage = () => {
  const { cart, removeFromCart, updateQty, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

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
                      onClick={() => navigate(`/products/${item.product.id}`)}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-on-surface">{cartTotal >= 500 ? 'Free' : 'Calculated at next step'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Estimated Tax</span>
                    <span className="text-on-surface">$0.00</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 mb-10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-on-surface">Total</span>
                    <span className="text-2xl font-bold text-on-surface tracking-tight">
                      ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="block w-full text-center bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded font-semibold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </Link>
                  <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest px-4">
                    Complimentary shipping on orders over $500
                  </p>
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

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#f6f3f2] dark:bg-[#1c1b1b]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 border-t border-[#dcc1ba]/15">
          <div>
            <div className="text-lg font-bold text-[#1c1b1b] dark:text-[#fcf9f8] mb-4">ATELIER</div>
            <p className="text-[#56423d] dark:text-[#dcc1ba] text-sm leading-relaxed max-w-xs">
              Curating the finest essential wardrobe pieces with an artisanal focus on quality and timeless design.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-widest text-[#994127] uppercase">Shop</h4>
              <Link to="/products" className="text-[#56423d] dark:text-[#dcc1ba] text-sm hover:text-[#994127] transition-colors">Clothes</Link>
              <Link to="/products" className="text-[#56423d] dark:text-[#dcc1ba] text-sm hover:text-[#994127] transition-colors">Shoes</Link>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] text-sm hover:text-[#994127] transition-colors">Archive</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-widest text-[#994127] uppercase">Help</h4>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] text-sm hover:text-[#994127] transition-colors">Shipping</a>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] text-sm hover:text-[#994127] transition-colors">Returns</a>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end">
            <div className="flex gap-4">
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors text-sm">Terms</a>
            </div>
            <p className="text-[#56423d] dark:text-[#dcc1ba] text-xs font-['Manrope'] tracking-wide mt-4 md:mt-0">
              © 2024 Atelier Editorial. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ShoppingCartPage;
