import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { getOrders } from '../api/order.api';

const TABS = ['All Orders', 'In Transit', 'Completed', 'Returns'];

const statusStyle = (status) => {
  switch (status) {
    case 'delivered':   return { color: 'bg-green-600', text: 'text-green-700', pulse: false };
    case 'processing':  return { color: 'bg-primary',   text: 'text-primary',   pulse: true  };
    case 'pending':     return { color: 'bg-yellow-500', text: 'text-yellow-700', pulse: false };
    case 'cancelled':   return { color: 'bg-red-500',   text: 'text-red-700',   pulse: false };
    default:            return { color: 'bg-outline',   text: 'text-outline',   pulse: false };
  }
};

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'In Transit') return o.status === 'processing';
    if (activeTab === 'Completed')  return o.status === 'delivered';
    return false;
  });

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <Navbar activePage="orders" />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">

        {/* Header */}
        <header className="mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-outline font-semibold mb-4 block">Account Dashboard</span>
          <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tighter mb-2">Order History</h1>
          <p className="text-on-surface-variant max-w-md font-light leading-relaxed">
            Review your curated collection of past acquisitions and track pending arrivals.
          </p>
          <div className="mt-4">
            <Link to="/account" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to My Account
            </Link>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="flex space-x-12 mb-12 border-b border-outline-variant/15 pb-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-primary font-semibold border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {loading ? (
            <div className="py-24 text-center text-on-surface-variant font-light">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-on-surface-variant font-light">No orders in this category.</div>
          ) : (
            filtered.map((order) => {
              const { color, text, pulse } = statusStyle(order.status);
              const firstImage = order.items?.[0]?.product?.images?.[0];
              const itemNames = order.items?.map((i) => i.product?.name).filter(Boolean).join(', ');
              return (
                <div
                  key={order._id}
                  className="group relative bg-surface-container-low rounded-lg p-6 md:p-8 shadow-[0_20px_40px_rgba(86,66,61,0.06)] transition-all hover:bg-surface-container-lowest"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                      {firstImage && (
                        <div className="w-24 h-32 bg-surface-container-highest rounded flex-shrink-0 overflow-hidden">
                          <img className="w-full h-full object-cover" alt="Order item" src={firstImage} />
                        </div>
                      )}
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold tracking-wide text-outline mb-1 uppercase">Order #{order.orderNumber}</h3>
                          <p className="text-xl font-bold text-on-surface mb-2 tracking-tight">{itemNames || 'Order'}</p>
                          <p className="text-sm text-on-surface-variant">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}></span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${text}`}>{order.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-between gap-4">
                      <div className="text-right">
                        <span className="text-xs text-on-surface-variant block mb-1">Total Amount</span>
                        <span className="text-2xl font-extrabold text-on-surface">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order.orderNumber}`)}
                        className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white text-sm font-semibold tracking-tight rounded hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        View Details
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Support Section */}
        <section className="mt-24 p-12 bg-surface-container-low rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Need assistance with an order?</h2>
            <p className="text-on-surface-variant">Our concierge team is available 24/7 for size exchanges and returns.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-on-surface text-surface text-sm font-bold tracking-widest uppercase rounded">Contact Support</button>
            <button className="px-8 py-4 border border-outline/20 text-on-surface text-sm font-bold tracking-widest uppercase rounded hover:bg-surface transition-colors">Return Policy</button>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
};

export default OrderHistoryPage;
