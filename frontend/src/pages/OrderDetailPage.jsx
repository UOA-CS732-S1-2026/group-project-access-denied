import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../api/order.api';
import { useCart } from '../context/CartContext';
import { cartBadge } from '../components/common/navbarStyles';

const statusStyle = (status) => {
  switch (status) {
    case 'delivered':  return { color: 'bg-green-600', text: 'text-green-700' };
    case 'processing': return { color: 'bg-primary',   text: 'text-primary'   };
    case 'pending':    return { color: 'bg-yellow-500', text: 'text-yellow-700' };
    case 'cancelled':  return { color: 'bg-red-500',   text: 'text-red-700'   };
    default:           return { color: 'bg-outline',   text: 'text-outline'   };
  }
};

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderNumber)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface-variant">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Order not found.</p>
          <button onClick={() => navigate('/orders')} className="text-primary underline text-sm">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const { color, text } = statusStyle(order.status);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</Link>
          <div className="flex items-center space-x-6 text-[#994127]">
            <Link to="/account" className="hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link to="/cart" className="hover:opacity-80 transition-opacity relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className={cartBadge}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">

        {/* Back */}
        <Link to="/orders" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit mb-8">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-outline font-semibold mb-2 block">Order Receipt</span>
            <h1 className="text-3xl font-bold tracking-tighter text-on-surface">
              #{order.orderNumber}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${color}`}></span>
            <span className={`text-sm font-bold uppercase tracking-wider ${text}`}>{order.status}</span>
          </div>
        </div>

        {/* Items */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Items</h2>
          <div className="space-y-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-6 bg-surface-container-low rounded-lg p-4">
                {item.product?.images?.[0] && (
                  <div className="w-20 h-24 bg-surface-container-highest rounded overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{item.product?.name || 'Product'}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-primary mt-2">${(item.priceAtPurchase * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="mb-10 bg-surface-container-low rounded-lg p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-4">Shipping Address</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postcode}<br />
            {order.shippingAddress.country}
          </p>
        </section>

        {/* Order Summary */}
        <section className="bg-surface-container-low rounded-lg p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Discount Applied</span>
                <span>-${order.discountApplied.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="border-t border-outline-variant/15 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#f6f3f2] dark:bg-[#1c1b1b] w-full mt-auto">
        <div className="px-12 py-6 border-t border-[#dcc1ba]/10 text-center">
          <span className="text-[#56423d] dark:text-[#dcc1ba] font-['Manrope'] text-xs tracking-widest">© 2024 Atelier Editorial. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
};

export default OrderDetailPage;
