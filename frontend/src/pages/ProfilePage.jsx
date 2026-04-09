import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { profileBanner } from '../assets/images';

const NAV_ITEMS = [
  { id: 'profile',   icon: 'person',           label: 'Profile' },
  { id: 'orders',    icon: 'shopping_basket',   label: 'Orders' },
  { id: 'security',  icon: 'shield',            label: 'Security' },
  { id: 'addresses', icon: 'location_on',       label: 'Addresses' },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const displayName = user?.username ?? 'Guest';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased">

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</Link>
          <div className="hidden md:flex items-center space-x-12">
            <Link to="/products" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight">Clothes</Link>
            <Link to="/products" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight">Shoes</Link>
            <Link to="/#new-arrivals" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight">New Arrivals</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="hover:opacity-80 transition-opacity duration-300 text-[#994127] font-semibold border-b-2 border-[#994127] pb-1">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative text-[#56423d]">
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

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
                <button className="text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">Edit Details</button>
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

            {/* Security + Addresses Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Security Card */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(86,66,61,0.06)] flex flex-col justify-between border border-outline-variant/10">
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Password &amp; Security</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-8">Maintain your account integrity by updating your password regularly and enabling 2FA.</p>
                </div>
                <button className="w-full bg-gradient-to-tr from-primary to-primary-container text-white py-4 rounded-lg font-bold tracking-tight hover:opacity-90 transition-all scale-95 active:scale-100">
                  Change Password
                </button>
              </div>

              {/* Addresses Card */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(86,66,61,0.06)] border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold">Saved Addresses</h3>
                  <button className="text-primary">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-surface-container-low/50 relative">
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-primary">Default</span>
                    <p className="font-bold text-sm mb-1">Home</p>
                    <p className="text-sm text-on-surface-variant leading-snug">
                      742 Evergreen Terrace<br />
                      Springfield, OR 97403<br />
                      United States
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-outline-variant/20 relative hover:border-primary/30 transition-colors">
                    <p className="font-bold text-sm mb-1 text-on-surface-variant">Studio</p>
                    <p className="text-sm text-on-surface-variant/70 leading-snug">
                      1200 Creative Way, Suite 400<br />
                      Portland, OR 97201
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                      <button className="text-xs font-bold text-on-surface-variant/40 hover:text-error transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

      {/* Footer */}
      <footer className="bg-[#f6f3f2] dark:bg-[#1c1b1b] w-full mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 border-t border-[#dcc1ba]/15 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</div>
            <p className="text-[#56423d] dark:text-[#dcc1ba] text-sm leading-relaxed max-w-xs">
              Redefining the digital shopping experience through curated editorial vision and artisanal craftsmanship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] text-sm tracking-wide">Shipping</a>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] text-sm tracking-wide">Returns</a>
            </div>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] text-sm tracking-wide">Privacy Policy</a>
              <a href="#" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] text-sm tracking-wide">Terms of Service</a>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex space-x-6 mb-8 md:mb-0">
              <span className="material-symbols-outlined text-[#56423d] cursor-pointer hover:text-[#994127] transition-colors">share</span>
              <span className="material-symbols-outlined text-[#56423d] cursor-pointer hover:text-[#994127] transition-colors">public</span>
              <span className="material-symbols-outlined text-[#56423d] cursor-pointer hover:text-[#994127] transition-colors">mail</span>
            </div>
            <p className="text-[#56423d] dark:text-[#dcc1ba] font-['Manrope'] text-sm tracking-wide opacity-60">
              © 2024 Atelier Editorial. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ProfilePage;
