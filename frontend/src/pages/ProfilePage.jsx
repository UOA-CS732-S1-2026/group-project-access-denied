import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { profileBanner } from '../assets/images';

const NAV_ITEMS = [
  { id: 'profile',   icon: 'person',           label: 'Profile' },
  { id: 'orders',    icon: 'shopping_basket',   label: 'Orders' },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const displayName = user?.username ?? 'Guest';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased">
      <Navbar activePage="account" />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tighter mb-2">My Account</h1>
                <p className="text-on-surface-variant text-sm">Welcome back, {displayName}</p>
              </div>
              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'orders') {
                        navigate('/orders');
                      } else {
                        setActiveSection(item.id);
                      }
                    }}
                    className={`group flex items-center px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === item.id
                        ? 'bg-surface-container-low text-primary font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="pt-6 mt-6 border-t border-outline-variant/15">
                  <button
                    onClick={handleLogout}
                    className="group flex items-center px-4 py-3 rounded-lg text-error hover:bg-error/5 transition-all w-full text-left"
                  >
                    <span className="material-symbols-outlined mr-3 text-xl">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">

            {/* Personal Information */}
            <section className="bg-surface-container-low rounded-xl p-8 md:p-10">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2 block">Identity</span>
                  <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60">Username</label>
                  <div className="text-lg font-medium py-2 border-b border-outline-variant/20">{user?.username ?? '—'}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60">Email Address</label>
                  <div className="text-lg font-medium py-2 border-b border-outline-variant/20">{user?.email ?? '—'}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60">Role</label>
                  <div className="text-lg font-medium py-2 border-b border-outline-variant/20 capitalize">{user?.role ?? '—'}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60">Member Since</label>
                  <div className="text-lg font-medium py-2 border-b border-outline-variant/20">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                  </div>
                </div>
              </div>
            </section>


            {/* Featured Collection Banner */}
            <div className="relative h-[300px] rounded-xl overflow-hidden group">
              <img
                alt="Editorial Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={profileBanner}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-transparent flex flex-col justify-center px-12">
                <span className="text-primary-fixed text-xs font-bold tracking-[0.3em] uppercase mb-4">Curated For You</span>
                <h2 className="text-white text-4xl font-extrabold tracking-tighter max-w-md mb-6 leading-tight">The Autumn Editorial Collection</h2>
                <div>
                  <Link to="/products" className="inline-block bg-white text-on-surface px-8 py-3 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all">
                    Explore Lookbook
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default ProfilePage;
